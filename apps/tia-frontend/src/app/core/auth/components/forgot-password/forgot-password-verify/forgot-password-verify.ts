import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { OtpVerification } from '../../../shared/otp-verification/otp-verification';

@Component({
  selector: 'app-forgot-password-verify',
  imports: [OtpVerification],
  templateUrl: './forgot-password-verify.html',
  styleUrl: './forgot-password-verify.scss',
})
export class ForgotPasswordVerify {
  private authService = inject(AuthService);

  public submitOtp = (code: string) =>
    this.authService.verifyForgotPasswordOtp(code);
}
