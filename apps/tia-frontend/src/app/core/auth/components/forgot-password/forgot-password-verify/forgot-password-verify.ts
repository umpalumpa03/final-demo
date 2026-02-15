import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  HostListener,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { forgotPasswordSegments } from '../forgot-password.routes';
import { TokenService } from '../../../services/token.service';
import { Routes } from '../../../models/tokens.model';
import { otpVerificationConfig } from '../../../config/otp-verification.config';
import { OtpVerification } from '@tia/core/otp-verification/container/otp-verification';
import { OtpVerificationService } from '@tia/core/otp-verification/services/otp-verification.service';
import { OtpResendTypes } from '@tia/core/otp-verification/config/otp.config';

@Component({
  selector: 'app-forgot-password-verify',
  imports: [OtpVerification],
  templateUrl: './forgot-password-verify.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordVerify implements OnInit {
  private otpService = inject(OtpVerificationService)
  private authService = inject(AuthService);
  private tokenService = inject(TokenService)
  private router = inject(Router);
  public readonly otpResendType = OtpResendTypes.RESET;
  public otpInputConfig = otpVerificationConfig['forgot-password']

  public readonly errorMessage = signal<string | null>(null);

  public ngOnInit(): void {
    if (!this.authService.getChallengeId()) {
      this.router.navigate(['/auth', ...forgotPasswordSegments.base]);
    }
  }

  @HostListener('input')
  public onOtpInputChanged(): void {
    if (this.errorMessage()) {
      this.errorMessage.set(null);
    }
  }

  public verifyResetOtp(otp: string): void {
      this.errorMessage.set(null);
      this.authService
        .verifyForgotPasswordOtp(otp)
        .pipe(
          tap(() =>
            this.router.navigate(['/auth', ...forgotPasswordSegments.reset]),
          ),
          catchError((error) => {
            const httpError = error as HttpErrorResponse;
            this.errorMessage.set(httpError.error?.message || 'Invalid code');
            return EMPTY;
          }),
        )
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
