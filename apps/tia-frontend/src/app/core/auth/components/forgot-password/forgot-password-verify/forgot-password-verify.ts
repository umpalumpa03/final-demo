import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { OtpVerification } from '../../../shared/otp-verification/otp-verification';
import { forgotPasswordSegments } from '../forgot-password.routes';
import { IVerified } from '../../../models/otp-verification.models';

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

  public verifyResetOtp(event: IVerified): void {
    if (event.isCalled) {
      this.authService
        .verifyForgotPasswordOtp(event.otp!)
        .pipe(
          tap(() =>
            this.router.navigate(['/auth', ...forgotPasswordSegments.reset])
          )
        )
        .subscribe();
    }
  }

  public resendOtp(isCalled: boolean): void {
    if (isCalled) {
      this.authService.resendVerificationCode().subscribe();
    }
  }
}
