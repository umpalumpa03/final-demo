import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { OtpVerification } from '../../../shared/otp-verification/otp-verification';
import { catchError, EMPTY, tap } from 'rxjs';
import { Routes } from '../../../models/tokens.model';
import { TokenService } from '../../../services/token.service';

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

  public submit(event: { isCalled: boolean; otp: string | null }) {
    if (event.isCalled) {
      let telNumber = event.otp;
      this.authService
        .sendPhoneVerificationCode(telNumber!)
        .pipe(
          tap((res) => {
            this.authService.setChellangeId(res.challengeId);
            this.router.navigate([Routes.OTP_SIGN_UP]);
          }),
          catchError((err) => {
            const messages = err.error?.message;
            return EMPTY;
          }),
        )
        .subscribe();
    }
  }

  public handlePhoneTimer():void {
    this.tokenService.clearAllToken();
    this.router.navigate(['/auth/sign-in']);
  }
}
