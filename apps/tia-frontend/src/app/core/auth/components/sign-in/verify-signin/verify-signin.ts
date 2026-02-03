import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { OtpVerification } from '../../../shared/otp-verification/otp-verification';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { IMfaVerifyRequest } from '../../../models/authRequest.models';
import { IVerified } from '../../../models/otp-verification.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-verify-signin',
  imports: [OtpVerification, ReactiveFormsModule],
  templateUrl: './verify-signin.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifySignin {
  private authService = inject(AuthService);
  public otpError = this.authService.otpError;
  private destroyRef = inject(DestroyRef);

  public verifyOtp(event: IVerified): void {
    if (event.isCalled) {
      this.authService
        .verifyMfa({
          code: event.otp,
          challengeId: this.authService.getChallengeId(),
        } as IMfaVerifyRequest).pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }
  }

  public resendOtp(isCalled: boolean): void {
    if (isCalled) {
      this.authService.resendVerificationCode().subscribe();
    }
  }
}
