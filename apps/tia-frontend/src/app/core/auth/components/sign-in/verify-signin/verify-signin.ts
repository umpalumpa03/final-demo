import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { OtpVerification } from '../../../shared/otp-verification/otp-verification';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { IMfaVerifyRequest } from '../../../models/authRequest.models';

@Component({
  selector: 'app-verify-signin',
  imports: [OtpVerification, ReactiveFormsModule],
  templateUrl: './verify-signin.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifySignin {
  private authService = inject(AuthService);

  public isLoading = signal(false);
  public title = 'auth.otp-verify.title';
  public subText = "auth.otp-verify.subtitle";
  public submitBtnName = 'auth.otp-verify.btnName';

  public submitOtp = (code: string) =>
    this.authService.verifyMfa({
      code,
      challengeId: this.authService.getChallengeId(),
    } as IMfaVerifyRequest);
}
