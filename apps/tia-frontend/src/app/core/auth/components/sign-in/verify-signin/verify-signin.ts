import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OtpVerification } from '../../../shared/otp-verification/otp-verification';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { IMfaVerifyRequest } from '../../../models/authRequest.models';
import { IVerified } from '../../../models/otp-verification.models';

@Component({
  selector: 'app-verify-signin',
  imports: [OtpVerification, ReactiveFormsModule],
  templateUrl: './verify-signin.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifySignin {
  private authService = inject(AuthService);

  public verifyOtp(event: IVerified) {
    if (event.isCalled) {
      this.authService
        .verifyMfa({
          code: event.otp,
          challengeId: this.authService.getChallengeId(),
        } as IMfaVerifyRequest)
        .subscribe();
    }
  }

  public resendOtp(isCalled: boolean) {
    if (isCalled) {
      this.authService.resendVerificationCode().subscribe();
    }
  }
}
