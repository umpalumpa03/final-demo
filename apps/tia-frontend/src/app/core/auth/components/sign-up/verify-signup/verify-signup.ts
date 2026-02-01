import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { OtpVerification } from '../../../shared/otp-verification/otp-verification';
import { IVerified } from '../../../models/otp-verification.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-verify-signup',
  imports: [OtpVerification],
  templateUrl: './verify-signup.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifySignup {
  private authService = inject(AuthService);
  public otpError = this.authService.otpError;
  private destroyRef = inject(DestroyRef);

  public verifyRegisterOtp(event: IVerified): void {
    if (event.isCalled) {
      this.authService.verifyPhoneOtpCode(event.otp!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }
  }


  public resendOtp(isCalled: boolean): void {
    if (isCalled) {
      this.authService.resetPhoneOtp().subscribe();
    }

  }
  
}
