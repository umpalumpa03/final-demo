import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
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
  COUNTRY_OPTIONS,
  REGISTATION_FORM,
  PASSWORD_RULE_MESSAGES,
  PASSWORD_RULES,
} from '../models/forms.config';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-registration-form',
  imports: [TextInput, ReactiveFormsModule, ButtonComponent],
  templateUrl: './registration-form.html',
  styleUrl: './registration-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationForm {
  public countries = COUNTRY_OPTIONS;
  public inputConfig = REGISTATION_FORM;
  public readonly isRegistration = input<boolean>(true);
  public readonly buttonText = input<string>('Continue');
  public readonly passwordTouched = signal<boolean>(false);
  public readonly passwordInteracted = signal<boolean>(false);

  private readonly fb = inject(FormBuilder);
  public readonly submitRegistrationForm = output<IRegistrationForm>();
  private readonly ALL_PASSWORD_RULES = PASSWORD_RULES;

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
  }

  public registrationForm = this.fb.nonNullable.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [passwordValidator]],
      confirmPassword: ['', [Validators.required]],
      username: ['', Validators.required],
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
      return 'Weak';
    }

    const passed = Object.values(rules).filter(Boolean).length;

    if (passed <= 1) {
      return 'Weak';
    } else if (passed <= 3) {
      return 'Fair';
    } else if (passed <= 4) {
      return 'Good';
    }

    return 'Strong';
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
    const base = this.inputConfig.password;
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
      confirm.setErrors({ ...confirm.errors });
    } else if (confirm.errors) {
      delete confirm.errors['passwordMismatch'];
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
