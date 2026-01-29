import {
  ChangeDetectionStrategy,
  Component,
  inject,
  effect,
  input,
  output,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TranslatePipe } from '@ngx-translate/core';

const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const form = control as FormGroup;
  const newPassword = form.get('newPassword')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;

  if (newPassword !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
};

@Component({
  selector: 'app-security',
  imports: [
    BasicCard,
    TextInput,
    ButtonComponent,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './security.component.html',
  styleUrl: './security.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityComponent {
  private readonly fb = inject(FormBuilder);


  public readonly isLoading = input<boolean>(false);
  public readonly error = input<string | null>(null);
  public readonly success = input<boolean>(false);


  public readonly changePassword = output<{ currentPassword: string; newPassword: string }>();

  public readonly changePasswordForm: FormGroup;

  public constructor() {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: passwordMatchValidator });


    effect(() => {
      if (this.success()) {
        this.changePasswordForm.reset();
      }
    });
  }

  public isFormInvalid(): boolean {
    return this.changePasswordForm.invalid;
  }

  public onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const { currentPassword, newPassword } = this.changePasswordForm.value;
      this.changePassword.emit({ currentPassword, newPassword });
    }
  }
}
