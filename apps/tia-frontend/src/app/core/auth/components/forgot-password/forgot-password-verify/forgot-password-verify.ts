import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  HostListener,
  OnInit,
  signal,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
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

  public readonly errorMessage = signal<string | null>(null);

  public ngOnInit(): void {
    if (!this.authService.getChallengeId()) {
      this.router.navigate(['/auth', ...forgotPasswordSegments.base]);
    }
  }

  @HostListener('input')
  public onOtpInputChanged(): void {
    if (this.errorMessage()) {
      this.errorMessage.set(null);
    }
  }

  public verifyResetOtp(event: IVerified): void {
    if (event.isCalled) {
      this.errorMessage.set(null);
      this.authService
        .verifyForgotPasswordOtp(event.otp!)
        .pipe(
          tap(() =>
            this.router.navigate(['/auth', ...forgotPasswordSegments.reset])
          ),
          catchError((error) => {
            const httpError = error as HttpErrorResponse;
            this.errorMessage.set(httpError.error?.message || 'Invalid code');
            return EMPTY;
          })
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
