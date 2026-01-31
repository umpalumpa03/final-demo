import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { OtpVerification } from '../../../shared/otp-verification/otp-verification';

@Component({
  selector: 'app-verify-signup',
  imports: [OtpVerification],
  templateUrl: './verify-signup.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifySignup {
  private authService = inject(AuthService);

  public verifyRegisterOtp(event: { isCalled: boolean; otp: string | null }) {
    if (event.isCalled) {
      this.authService.verifyPhoneOtpCode(event.otp!).subscribe();
    }
  }

  public resendOtp(isCalled: boolean) {
    if (isCalled) {
      this.authService.resetPhoneOtp().subscribe();
    }
  }
}
