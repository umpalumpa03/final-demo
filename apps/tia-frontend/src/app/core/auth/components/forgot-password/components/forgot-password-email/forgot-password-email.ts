import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
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

@Component({
  selector: 'app-forgot-password-email',
  imports: [AuthLayout, TextInput, ButtonComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password-email.html',
  styleUrl: './forgot-password-email.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordEmail {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(ForgotPasswordService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly isSubmitting = signal(false);
  public readonly serverError = signal<string | null>(null);

  public readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  public readonly emailConfig = computed(() => {
    const errorMessage = this.serverError();
    return {
      label: 'Email',
      required: true,
      placeholder: 'you@example.com',
      errorMessage: errorMessage || undefined,
    };
  });

  constructor() {
    this.form.controls.email.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.serverError()) {
          this.serverError.set(null);
        }
        const control = this.form.controls.email;
        if (control.errors?.['notFound'] || control.errors?.['server']) {
          const errors = { ...(control.errors || {}) };
          delete errors['notFound'];
          delete errors['server'];
          control.setErrors(Object.keys(errors).length ? errors : null);
        }
      });
  }

  async submit(): Promise<void> {
    this.serverError.set(null);
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    const email = this.form.controls.email.value;

    try {
      const response = (await firstValueFrom(
        this.authService.requestPasswordReset(email),
      )) as { challengeId: string };

      this.authService.setResetChallenge(email, response.challengeId);
      await this.router.navigate(['/auth/forgot-password/otp'], {
        queryParams: email ? { contact: email } : undefined,
      });
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      if (httpError?.status === 404) {
        this.serverError.set('User with this email not found');
        this.form.controls.email.setErrors({ notFound: true });
      } else {
        this.serverError.set('Unable to send reset code. Please try again.');
        this.form.controls.email.setErrors({ server: true });
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
