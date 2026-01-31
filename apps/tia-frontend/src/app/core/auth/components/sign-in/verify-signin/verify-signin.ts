import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OtpVerification } from '../../../shared/otp-verification/otp-verification';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { IMfaVerifyRequest } from '../../../models/authRequest.models';

@Component({
  selector: 'app-verify-signin',
  imports: [OtpVerification, ReactiveFormsModule],
  templateUrl: './verify-signin.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifySignin {
  private authService = inject(AuthService);

  public verifyOtp(event: { isCalled: boolean; otp: string | null }) {
    if (event.isCalled) {
      this.authService
        .verifyMfa({
          code: event.otp,
          challengeId: this.authService.getChallengeId(),
        } as IMfaVerifyRequest)
        .subscribe();
    }
  }

  public resendOtp(isCalled: boolean):void {
    if (isCalled) {
      this.authService.resendVerificationCode().subscribe();
    }
  }
}
