import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { AuthLayout } from '../../../shared/auth-layout/auth-layout';
import { AuthService } from '../../../../services/auth.service';
import { TokenService } from '../../../../services/token.service';
import { forgotPasswordSegments } from '../../forgot-password.routes';

@Component({
  selector: 'app-forgot-password-email',
  imports: [AuthLayout, TextInput, ButtonComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password-email.html',
  styleUrl: './forgot-password-email.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordEmail {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);
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
      placeholder: 'Enter your email',
      errorMessage,
    };
  });

  public async submit(): Promise<void> {
    this.submitError.set(null);
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    try {
      const { email } = this.form.getRawValue();
      this.tokenService.setForgotPasswordEmail(email);
      await firstValueFrom(this.authService.forgotPasswordRequest(email));
      await this.router.navigate(['/auth', ...forgotPasswordSegments.otp]);
    } catch {
      this.submitError.set('Unable to send reset code. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
