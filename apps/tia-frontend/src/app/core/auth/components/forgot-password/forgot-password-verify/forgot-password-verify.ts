import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { OtpVerification } from '../../../shared/otp-verification/otp-verification';
import { forgotPasswordSegments } from '../forgot-password.routes';

@Component({
  selector: 'app-forgot-password-verify',
  imports: [OtpVerification],
  templateUrl: './forgot-password-verify.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordVerify implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  public readonly title = 'OTP Verification';
  public readonly subText = "We've sent a 6-digit code to your email.";
  public readonly submitText = 'Verify OTP';
  public readonly resendText = "Didn't receive the code?";
  public readonly resendLinkText = 'Resend';
  public readonly backLink = '/auth/sign-in';
  public readonly backLinkText = 'Back to Sign In';
  public readonly iconUrl = 'images/svg/button-icons/confirm-icon.svg';

  public submitOtp = (code: string) =>
    this.authService.verifyForgotPasswordOtp(code);

  public ngOnInit(): void {
    if (!this.authService.getChallengeId()) {
      this.router.navigate(['/auth', ...forgotPasswordSegments.base]);
    }
  }

  public onSubmitResult(result: { statusCode: number; message: string }): void {
    if (result.statusCode === 200) {
      this.router.navigate(['/auth', ...forgotPasswordSegments.reset]);
    }
  }
}
