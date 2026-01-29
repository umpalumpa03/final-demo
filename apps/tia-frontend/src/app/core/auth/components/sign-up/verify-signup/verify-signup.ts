import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { OtpVerification } from "../../../shared/otp-verification/otp-verification";

@Component({
  selector: 'app-verify-signup',
  imports: [OtpVerification],
  templateUrl: './verify-signup.html',
  styleUrl: './verify-signup.scss',
})
export class VerifySignup {
  private authService = inject(AuthService);

  public submitOtp = signal((code: string) => this.authService.verifyOtpCode(code));
}
