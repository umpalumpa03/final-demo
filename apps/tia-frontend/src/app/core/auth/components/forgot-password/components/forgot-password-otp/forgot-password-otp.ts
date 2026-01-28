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
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Otp } from '@tia/shared/lib/forms/otp/otp';
import { OtpConfig } from '@tia/shared/lib/forms/models/otp.model';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { AuthLayout } from '../../../shared/auth-layout/auth-layout';
import { AuthService } from '../../../../services/auth.service';
import { TokenService } from '../../../../services/token.service';
import { forgotPasswordSegments } from '../../forgot-password.routes';

@Component({
  selector: 'app-forgot-password-otp',
  imports: [AuthLayout, Otp, ButtonComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password-otp.html',
  styleUrl: './forgot-password-otp.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordOtp implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isSubmitting = signal(false);
  readonly resendMessage = signal<string | null>(null);
  readonly resendStatus = signal<'success' | 'error' | null>(null);
  readonly otpError = signal<string | null>(null);

  readonly email = computed(() => this.tokenService.forgotPasswordEmail ?? '');
  readonly otpConfig: OtpConfig = {
    length: 4,
    inputType: 'number',
  };

  readonly form = this.fb.nonNullable.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
  });

  readonly otpErrorMessage = computed(() => this.otpError());

  constructor() {
    this.form.controls.otp.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.otpError()) {
          this.otpError.set(null);
        }
      });
  }

  async ngOnInit(): Promise<void> {
    if (!this.tokenService.forgotPasswordChallengeId) {
      await this.router.navigate(['/auth', ...forgotPasswordSegments.base]);
    }
  }

  async submit(): Promise<void> {
    this.otpError.set(null);
    this.form.markAllAsTouched();

    const otpValue = this.form.controls.otp.value;
    if (!otpValue) {
      this.otpError.set('OTP is required');
      return;
    }

    if (otpValue.length < 4) {
      this.otpError.set('OTP must be 4 digits');
      return;
    }

    if (this.form.invalid) {
      this.otpError.set('OTP must be 4 digits');
      return;
    }

    if (!this.tokenService.forgotPasswordChallengeId) {
      await this.router.navigate(['/auth', ...forgotPasswordSegments.base]);
      return;
    }

    this.isSubmitting.set(true);
    try {
      await firstValueFrom(this.authService.verifyForgotPasswordOtp(otpValue));
      await this.router.navigate(['/auth', ...forgotPasswordSegments.reset]);
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      if (httpError?.status === 400) {
        this.otpError.set('Invalid OTP code');
      } else {
        this.otpError.set('Unable to verify OTP. Please try again.');
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async resendOtp(): Promise<void> {
    this.resendMessage.set(null);
    this.resendStatus.set(null);
    try {
      await firstValueFrom(this.authService.resetPhoneOtp());
      this.resendMessage.set('OTP code resent successfully.');
      this.resendStatus.set('success');
    } catch {
      this.resendMessage.set('Unable to resend OTP. Please try again.');
      this.resendStatus.set('error');
    }
  }
}
