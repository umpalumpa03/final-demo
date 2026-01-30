import { Component, inject } from '@angular/core';
import { OtpVerification } from '../../../shared/otp-verification/otp-verification';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { IMfaVerifyRequest } from '../../../models/authRequest.models';
import { OtpConfig } from '@tia/shared/lib/forms/models/otp.model';

@Component({
  selector: 'app-verify-signin',
  imports: [OtpVerification, ReactiveFormsModule],
  templateUrl: './verify-signin.html',
  styleUrl: './verify-signin.scss',
})
export class VerifySignin {
  private authService = inject(AuthService);

  public isLoading = false;
  public title = 'OTP Verification';
  public subText = "We've sent a 6-digit code to test";
  public submitBtnName = 'Verify';

  public submitOtp = (code: string) =>
    this.authService.verifyMfa({
      code,
      challengeId: this.authService.getChallengeId(),
    } as IMfaVerifyRequest);
}
