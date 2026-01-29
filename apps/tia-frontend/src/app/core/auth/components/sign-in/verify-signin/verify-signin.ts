import { Component, inject } from '@angular/core';
import { OtpVerification } from '../../../shared/otp-verification/otp-verification';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { IMfaVerifyResponse } from '../../../models/authResponse.model';
import { IMfaVerifyRequest } from '../../../models/authRequest.models';

@Component({
  selector: 'app-verify-signin',
  imports: [OtpVerification, ReactiveFormsModule],
  templateUrl: './verify-signin.html',
  styleUrl: './verify-signin.scss',
})
export class VerifySignin {
  private authService = inject(AuthService);

  public submitOtp = (code: string) =>
    this.authService.verifyMfa({
      code,
      challengeId: this.authService.getChallengeId(),
    } as IMfaVerifyRequest);
}
