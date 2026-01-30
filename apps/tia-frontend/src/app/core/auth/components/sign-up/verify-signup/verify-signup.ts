
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { OtpVerification } from '../../../shared/otp-verification/otp-verification';

@Component({
  selector: 'app-verify-signup',
  imports: [OtpVerification],
  templateUrl: './verify-signup.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifySignup {
  private authService = inject(AuthService);


  public isLoading = false;
  public title = 'OTP Verification';
  public subText = "We've sent a 6-digit code to test";
  public submitBtnName = 'Verify';
  
  public submitOtp = (code: string) =>
    this.authService.verifyPhoneOtpCode(code);
}