import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { IMfaVerifyRequest } from '../../../models/authRequest.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TokenService } from '../../../services/token.service';
import { Router } from '@angular/router';
import { Routes } from '../../../models/tokens.model';
import { otpVerificationConfig } from '../../../config/otp-verification.config';
import { OtpVerification } from '@tia/core/otp-verification/container/otp-verification';
import { OtpVerificationService } from '@tia/core/otp-verification/services/otp-verification.service';
import { OtpResendTypes } from '@tia/core/otp-verification/config/otp.config';

@Component({
  selector: 'app-verify-signin',
  imports: [OtpVerification, ReactiveFormsModule],
  templateUrl: './verify-signin.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifySignin {
  private otpService = inject(OtpVerificationService);
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  public otpError = this.authService.otpError;
  private destroyRef = inject(DestroyRef);
  public otpResendType = OtpResendTypes.AUTH;
  public otpConfig = otpVerificationConfig['sign-in'];

  public verifyOtp(otp: string): void {
    this.authService
      .verifyMfa({
        code: otp,
        challengeId: this.authService.getChallengeId(),
      } as IMfaVerifyRequest)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  public resendOtp(): void {
    this.otpService
      .resendVerificationCode(this.authService.getChallengeId())
      .subscribe();
  }

  public clearedBackout(): void {
    this.tokenService.clearAllToken();
    this.router.navigate([Routes.SIGN_IN]);
  }
}
