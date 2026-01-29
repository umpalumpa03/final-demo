import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { OtpVerification } from '../../../shared/otp-verification/otp-verification';
import { forgotPasswordSegments } from '../forgot-password.routes';

@Component({
  selector: 'app-forgot-password-verify',
  imports: [OtpVerification],
  templateUrl: './forgot-password-verify.html',
  styleUrl: './forgot-password-verify.scss',
})
export class ForgotPasswordVerify {
  private authService = inject(AuthService);
  private router = inject(Router);

  public submitOtp = (code: string) =>
    this.authService.verifyForgotPasswordOtp(code);

  public onSubmitResult(result: { statusCode: number; message: string }): void {
    if (result.statusCode >= 200 && result.statusCode < 300) {
      this.router.navigate(['/auth', ...forgotPasswordSegments.reset]);
    }
  }
}
