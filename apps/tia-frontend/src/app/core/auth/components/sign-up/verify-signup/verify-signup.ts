import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { OtpVerification } from '../../../shared/otp-verification/otp-verification';
import { IVerified } from '../../../models/otp-verification.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take, tap } from 'rxjs';
import { TokenService } from '../../../services/token.service';
import { Router } from '@angular/router';
import { Routes } from '../../../models/tokens.model';
import { otpVerificationConfig } from '../../../config/otp-verification.config';

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
  public inputOtpConfig = otpVerificationConfig['sign-up']

  public verifyRegisterOtp(event: IVerified): void {
    if (event.isCalled) {
      this.authService
        .verifyPhoneOtpCode(event.otp!)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }
  }

  public resendOtp(isCalled: boolean): void {
    if (isCalled) {
      this.authService.resendPhoneOtp().pipe(take(1)).subscribe();
    }
  }

  public clearedBackout(): void {
    this.tokenService.clearAllToken();
    this.router.navigate([Routes.SIGN_IN]);
  }
}
