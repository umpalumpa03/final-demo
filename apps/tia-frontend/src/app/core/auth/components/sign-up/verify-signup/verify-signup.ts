import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { OtpVerification } from '../../../shared/otp-verification/otp-verification';
import { IVerified } from '../../../models/otp-verification.models';

@Component({
  selector: 'app-verify-signup',
  imports: [OtpVerification],
  templateUrl: './verify-signup.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifySignup {
  private authService = inject(AuthService);

  public verifyRegisterOtp(event: IVerified): void {
    if (event.isCalled) {
      this.authService.verifyPhoneOtpCode(event.otp!).subscribe();
    }
  }

  public resendOtp(isCalled: boolean): void {
    if (isCalled) {
      this.authService.resetPhoneOtp().subscribe();
    }
  }
}
