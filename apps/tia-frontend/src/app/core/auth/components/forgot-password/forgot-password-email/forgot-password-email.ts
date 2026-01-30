import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { AuthService } from '../../../services/auth.service';
import { Routes } from '../../../models/tokens.model';

@Component({
  selector: 'app-forgot-password-email',
  imports: [ TextInput, ButtonComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password-email.html',
  styleUrl: './forgot-password-email.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordEmail {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public readonly isSubmitting = signal(false);
  public readonly submitError = signal<string | null>(null);

  public readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  public readonly emailConfig = computed(() => {
    const control = this.form.controls.email;
    let errorMessage: string | undefined;

    if (control.hasError('required')) {
      errorMessage = 'Email is required';
    } else if (control.hasError('email')) {
      errorMessage = 'Enter a valid email';
    }

    return {
      label: 'Email',
      required: true,
      placeholder: 'your.email@example.com',
      errorMessage,
    };
  });

  public submit(): void {
    this.submitError.set(null);
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    const { email } = this.form.getRawValue();
    this.authService
      .forgotPasswordRequest(email)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (response) => {
          this.authService.setChellangeId(response.challengeId);
          this.router.navigate([Routes.OTP_FORGOT_PASSWORD]);
        },
        error: () => {
          this.submitError.set('Unable to send reset code. Please try again.');
        },
      });
  }
}
