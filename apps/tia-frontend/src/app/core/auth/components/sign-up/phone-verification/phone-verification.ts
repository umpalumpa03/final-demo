import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Routes } from '../../../models/tokens.model';
import { otpVerificationConfig } from '../../../config/otp-verification.config';
import { OtpVerification } from '@tia/core/otp-verification/container/otp-verification';
import { OtpResendTypes } from '@tia/core/otp-verification/config/otp.config';

@Component({
  selector: 'app-phone-verification',
  imports: [ReactiveFormsModule, OtpVerification],
  templateUrl: './phone-verification.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneVerification {
  private authService = inject(AuthService);
  private router = inject(Router);
  private tokenService = inject(TokenService);
  private destroyRef = inject(DestroyRef);
  public inputOtpConfig = otpVerificationConfig['sign-up'];
  public readonly otpResendType = OtpResendTypes.PHONE_RESEND
  public PhoneOtpError = this.authService.otpError;

  public submit(otp: string): void {
    this.authService
      .sendPhoneVerificationCode(otp!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  public clearedBackout(): void {
    this.tokenService.clearAllToken();
    this.router.navigate([Routes.SIGN_IN]);
  }
}
