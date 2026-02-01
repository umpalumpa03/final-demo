import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { OtpVerification } from '../../../shared/otp-verification/otp-verification';
import { TokenService } from '../../../services/token.service';
import { IVerified } from '../../../models/otp-verification.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-phone-verification',
  imports: [ReactiveFormsModule, OtpVerification],
  templateUrl: './phone-verification.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneVerification {
  private authService = inject(AuthService);
  private router = inject(Router);
  private tokenService = inject(TokenService);
  public PhoneOtpError = this.authService.otpError;
  private destroyRef = inject(DestroyRef);

  public submit(event: IVerified): void {
    if (event.isCalled) {
      let telNumber = event.otp;
      this.authService.sendPhoneVerificationCode(telNumber!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }
  }

  public handlePhoneTimer(): void {
    this.tokenService.clearAllToken();
    this.router.navigate(['/auth/sign-in']);
  }
}
