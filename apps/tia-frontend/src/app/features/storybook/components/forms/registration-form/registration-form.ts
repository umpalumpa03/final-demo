import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  IRegistrationForm,
  PasswordStrength,
} from '../models/contact-forms.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  passwordMatchValidator,
  passwordValidator,
} from 'apps/tia-frontend/src/app/core/auth/utils/validators/form-validations';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import {
  REGISTATION_FORM,
  PASSWORD_RULE_MESSAGES,
  PASSWORD_RULES,
} from '../models/forms.config';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { translateConfig } from '@tia/shared/utils/translate-config/config-translator.util';

@Component({
  selector: 'app-registration-form',
  imports: [TextInput, ReactiveFormsModule, ButtonComponent, TranslatePipe],
  templateUrl: './registration-form.html',
  styleUrl: './registration-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationForm {
  private translate = inject(TranslateService);
  public readonly isRegistration = input<boolean>(true);
  public readonly buttonText = input<string>('auth.sign-up.buttonText');
  public readonly usernameError = input<boolean | null>();
  public readonly emailError = input<boolean | null>();
  public readonly passwordTouched = signal<boolean>(false);
  public readonly passwordInteracted = signal<boolean>(false);

  private readonly fb = inject(FormBuilder);
  public readonly submitRegistrationForm = output<IRegistrationForm>();
  private readonly ALL_PASSWORD_RULES = PASSWORD_RULES;

  @HostListener('input', ['$event'])
  public handleInput(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.tagName !== 'INPUT') {
      return;
    }

    const { confirmPassword, ...regRequest } =
      this.registrationForm.getRawValue();

    this.formIncompleteData.emit(regRequest);
  }

  public formIncompleteData = output<IRegistrationForm>();
  public currentUsername = output<string>();
  public currentEmail = output<string>();

  public inputConfig = toSignal(
    this.translate.onLangChange.pipe(
      startWith({
        lang: this.translate.getCurrentLang(),
        translation: null,
      }),
      map(() => {
        return translateConfig(REGISTATION_FORM, (key) =>
          this.translate.instant(key),
        );
      }),
    ),
    {
      initialValue: translateConfig(REGISTATION_FORM, (key) =>
        this.translate.instant(key),
      ),
    },
  );

  constructor() {
    effect(() => {
      this.passwordValue();
      this.onPasswordChange();

      this.confirmPasswordValue();
      this.comparePasswords();

      const isRegister = this.isRegistration();
      const toggle = (name: string) => {
        const control = this.registrationForm.get(name);
        if (!control) return;
        if (isRegister) {
          control.enable({ emitEvent: false });
        } else {
          control.disable({ emitEvent: false });
        }
      };

      ['firstName', 'lastName', 'email', 'username'].forEach(toggle);
    });

    effect(() => {
      const username = this.usernameValue() ?? '';
      this.currentUsername.emit(username);
    });
    effect(() => {
      const email = this.emailValue() ?? '';
      this.currentEmail.emit(email);
    });
  }

  public registrationForm = this.fb.nonNullable.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [passwordValidator]],
      confirmPassword: ['', [Validators.required]],
      username: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]{2,}$/)],
      ],
    },
    {
      validators: passwordMatchValidator,
    },
  );

  public get passwordControl() {
    return this.registrationForm.get('password');
  }

  public get confirmPasswordControl() {
    return this.registrationForm.get('confirmPassword');
  }

  private get usernameControl() {
    return this.registrationForm.get('username');
  }
  private get emailControl() {
    return this.registrationForm.get('email');
  }

  private onPasswordChange(): void {
    const control = this.passwordControl;
    if (!control) {
      return;
    }

    const userTouched =
      control.touched || control.dirty || this.passwordInteracted();
    if (!userTouched && !control.valid) {
      return;
    }

    this.passwordRules.set(
      control.errors?.['passwordRules'] ??
        (control.valid ? this.ALL_PASSWORD_RULES : null),
    );

    if (!this.passwordInteracted() && (control.touched || control.dirty)) {
      this.passwordInteracted.set(true);
    }

    this.comparePasswords();
  }

  private usernameValue = toSignal(this.usernameControl!.valueChanges);
  private emailValue = toSignal(this.emailControl!.valueChanges);

  private passwordValue = toSignal(this.passwordControl!.valueChanges);

  public readonly passwordRules = signal<Record<string, boolean> | null>(
    this.passwordControl?.errors?.['passwordRules'] ?? null,
  );

  public readonly showPasswordRules = computed<boolean>(() => {
    const rules = this.passwordRules();
    if (!rules) return false;
    return this.passwordInteracted() || Object.values(rules).every(Boolean);
  });

  public readonly minLength = computed<boolean>(() => {
    const rules = this.passwordRules();
    return !!rules && !!rules['minLength'];
  });

  public readonly uppercaseLowercase = computed<boolean>(() => {
    const rules = this.passwordRules();
    return !!rules && !!(rules['uppercase'] && rules['lowercase']);
  });

  public readonly numberRule = computed<boolean>(() => {
    const rules = this.passwordRules();
    return !!rules && !!rules['number'];
  });

  public readonly specialRule = computed<boolean>(() => {
    const rules = this.passwordRules();
    return !!rules && !!rules['special'];
  });

  public readonly passwordStrength = computed<PasswordStrength>(() => {
    const rules = this.passwordRules();
    if (!rules) {
      return 'auth.sign-up.weak';
    }

    const passed = Object.values(rules).filter(Boolean).length;

    if (passed <= 1) {
      return 'auth.sign-up.weak';
    } else if (passed <= 3) {
      return 'auth.sign-up.fair';
    } else if (passed <= 4) {
      return 'auth.sign-up.good';
    }

    return 'auth.sign-up.strong';
  });

  public readonly strengthPercent = computed<number>(() => {
    const rules = this.passwordRules();
    if (!rules) {
      return 0;
    }
    return (
      (Object.values(rules).filter(Boolean).length /
        Object.values(rules).length) *
      100
    );
  });

  public readonly firstFailedRule = computed<string | null>(() => {
    const rules = this.passwordRules();
    if (!rules) {
      return null;
    } else if (!rules['minLength']) {
      return PASSWORD_RULE_MESSAGES.minLength;
    } else if (!rules['uppercase'] || !rules['lowercase']) {
      return PASSWORD_RULE_MESSAGES.uppercaseLowercase;
    } else if (!rules['number']) {
      return PASSWORD_RULE_MESSAGES.number;
    } else if (!rules['special']) {
      return PASSWORD_RULE_MESSAGES.special;
    }
    return null;
  });

  public readonly passwordConfig = computed(() => {
    const base = this.inputConfig().password;
    const error =
      this.passwordInteracted() && this.firstFailedRule()
        ? this.firstFailedRule()
        : undefined;
    return {
      ...base,
      ...(error ? { errorMessage: error } : ''),
    };
  });

  public showError(controlName: string): boolean {
    const control = this.registrationForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  private comparePasswords(): void {
    const confirm = this.confirmPasswordControl;
    if (!confirm) {
      return;
    }

    if (this.passwordControl?.value !== confirm.value) {
      const errs = {
        ...(confirm.errors || {}),
        passwordMismatch: true,
      } as Record<string, boolean>;
      confirm.setErrors(errs);
    } else if (confirm.errors && confirm.errors['passwordMismatch']) {
      const next = { ...(confirm.errors || {}) } as Record<string, boolean>;
      delete next['passwordMismatch'];
      const hasOther = Object.keys(next).length > 0;
      confirm.setErrors(hasOther ? next : null);
    }
  }

  private confirmPasswordValue = toSignal(
    this.confirmPasswordControl!.valueChanges,
  );

  public submit(): void {
    if (this.registrationForm.invalid || !this.registrationForm.value) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    const regRequest = { ...this.registrationForm.value };
    if ('confirmPassword' in regRequest) delete regRequest['confirmPassword'];

    this.submitRegistrationForm.emit(regRequest as IRegistrationForm);
    this.registrationForm.reset();
    this.passwordTouched.set(false);
    this.passwordInteracted.set(false);
    this.passwordRules.set(null);
  }
}
