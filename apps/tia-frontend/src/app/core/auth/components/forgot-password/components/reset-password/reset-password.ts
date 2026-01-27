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
import { firstValueFrom } from 'rxjs';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { AuthLayout } from '../../../shared/auth-layout/auth-layout';
import { ForgotPasswordService } from '../../../../services/forgot-password.service';
import { passwordValidator } from '../../../../utils/validators/form-validations';

@Component({
  selector: 'app-reset-password',
  imports: [AuthLayout, TextInput, ButtonComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPassword implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(ForgotPasswordService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly isSubmitting = signal(false);
  public readonly submitError = signal<string | null>(null);
  public readonly passwordValue = signal('');
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

  public readonly requirements = computed(() => {
    const value = this.passwordValue() || '';
    return {
      length: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    };
  });

  public readonly strengthCount = computed(() => {
    const reqs = this.requirements();
    return Object.values(reqs).filter(Boolean).length;
  });

  public readonly strengthLabel = computed(() => {
    const count = this.strengthCount();
    if (count <= 2) return 'Weak';
    if (count <= 4) return 'Good';
    return 'Strong';
  });

  public readonly strengthPercent = computed(() => {
    const count = this.strengthCount();
    return Math.min(100, Math.round((count / 5) * 100));
  });

  public readonly strengthClass = computed(() => {
    const label = this.strengthLabel();
    return label.toLowerCase();
  });

  constructor() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateConfirmMismatch());
    this.form.controls.password.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.passwordValue.set(value || ''));
  }

  async ngOnInit(): Promise<void> {
    if (!this.authService.accessToken()) {
      await this.router.navigate(['/auth/forgot-password/otp']);
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

  async submit(): Promise<void> {
    this.submitError.set(null);
    this.form.markAllAsTouched();
    this.updateConfirmMismatch();

    if (this.form.invalid) return;

    if (!this.authService.accessToken()) {
      await this.router.navigate(['/auth/forgot-password/otp']);
      return;
    }

    this.isSubmitting.set(true);
    try {
      const password = this.form.controls.password.value;
      await firstValueFrom(this.authService.createNewPassword(password));

      try {
        await firstValueFrom(this.authService.resetPhoneOtp());
      } catch {
        // Ignore cleanup errors
      }

      await this.router.navigate(['/auth/forgot-password/success']);
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      if (httpError?.status === 400) {
        this.submitError.set('Unable to reset password. Please try again.');
      } else {
        this.submitError.set('Something went wrong. Please try again.');
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
