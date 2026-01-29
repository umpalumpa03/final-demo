import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
import { passwordValidator } from '../../../utils/validators/form-validations';
import { forgotPasswordSegments } from '../forgot-password.routes';

@Component({
  selector: 'app-reset-password',
  imports: [TextInput, ButtonComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPassword implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly isSubmitting = signal(false);
  public readonly submitError = signal<string | null>(null);
  public readonly confirmErrorMessage = signal('');

  public readonly form = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(8), passwordValidator]],
    confirmPassword: ['', [Validators.required]],
  });

  public readonly passwordConfig = {
    label: 'New Password',
    required: true,
    placeholder: 'Enter new password',
  };

  public readonly confirmConfig = computed(() => ({
    label: 'Confirm Password',
    required: true,
    placeholder: 'Re-enter new password',
    errorMessage: this.confirmErrorMessage() || undefined,
  }));

  constructor() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateConfirmMismatch());
  }

  ngOnInit(): void {
    if (!this.tokenService.accessToken) {
      this.router.navigate(['/auth', ...forgotPasswordSegments.otp]);
    }
  }

  private updateConfirmMismatch(): void {
    const password = this.form.controls.password.value;
    const confirm = this.form.controls.confirmPassword.value;
    const control = this.form.controls.confirmPassword;
    const errors = { ...(control.errors || {}) };

    if (confirm && password && password !== confirm) {
      errors['passwordMismatch'] = true;
    } else {
      delete errors['passwordMismatch'];
    }

    const hasErrors = Object.keys(errors).length > 0;
    control.setErrors(hasErrors ? errors : null);

    if (control.hasError('required')) {
      this.confirmErrorMessage.set('Confirm password is required');
    } else if (control.hasError('passwordMismatch')) {
      this.confirmErrorMessage.set('Passwords do not match');
    } else {
      this.confirmErrorMessage.set('');
    }
  }

  submit(): void {
    this.submitError.set(null);
    this.form.markAllAsTouched();
    this.updateConfirmMismatch();

    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    const password = this.form.controls.password.value;
    this.authService
      .createNewPassword(password)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/auth', ...forgotPasswordSegments.success]);
        },
        error: (error) => {
          const httpError = error as HttpErrorResponse;
          if (httpError?.status === 400) {
            this.submitError.set('Unable to reset password. Please try again.');
          } else {
            this.submitError.set('Something went wrong. Please try again.');
          }
        },
      });
  }
}
