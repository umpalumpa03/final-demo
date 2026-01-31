import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { OtpVerification } from '../../../shared/otp-verification/otp-verification';
import { forgotPasswordSegments } from '../forgot-password.routes';

@Component({
  selector: 'app-forgot-password-verify',
  imports: [OtpVerification],
  templateUrl: './forgot-password-verify.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordVerify implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  public ngOnInit(): void {
    if (!this.authService.getChallengeId()) {
      this.router.navigate(['/auth', ...forgotPasswordSegments.base]);
    }
  }

  public verifyResetOtp(event: { isCalled: boolean; otp: string | null }) {
    if (event.isCalled) {
      this.authService.forgotPasswordRequest(event.otp!).subscribe();
    }
  }

  public resendOtp(isCalled: boolean) {
    if (isCalled) {
      this.authService.resendVerificationCode().subscribe();
    }
  }
}
