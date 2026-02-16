import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { TokenService } from '../../../services/token.service';
import { Router } from '@angular/router';
import { Routes } from '../../../models/tokens.model';
import { otpVerificationConfig } from '../../../config/otp-verification.config';
import { OtpVerification } from '@tia/core/otp-verification/container/otp-verification';

@Component({
  selector: 'app-verify-signup',
  imports: [OtpVerification],
  templateUrl: './verify-signup.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifySignup {
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  public otpError = this.authService.otpError;
  private destroyRef = inject(DestroyRef);
  public inputOtpConfig = otpVerificationConfig['sign-up'];

  public verifyRegisterOtp(otp: string): void {
    this.authService
      .verifyPhoneOtpCode(otp)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  public resendOtp(): void {
    this.authService.resendPhoneOtp().pipe(take(1)).subscribe();
  }

  public clearedBackout(): void {
    this.tokenService.clearAllToken();
    this.router.navigate([Routes.SIGN_IN]);
  }
}
