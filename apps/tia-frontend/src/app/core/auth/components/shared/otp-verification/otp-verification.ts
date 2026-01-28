import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

import { AuthService } from '../../../services/auth.service';
import { catchError, EMPTY, take, finalize, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';
import { forgotPasswordSegments } from 'apps/tia-frontend/src/app/core/auth/components/forgot-password/forgot-password.routes';
import { TokenService } from '../../../services/token.service';
import { OtpConfig } from '@tia/shared/lib/forms/models/otp.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Otp } from '@tia/shared/lib/forms/otp/otp';

@Component({
  selector: 'app-otp-verification',
  imports: [
    ButtonComponent,
    TextInput,
    ReactiveFormsModule,
    ButtonComponent,
    Spinner,
    Otp,
  ],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpVerification {
  //ამაზე კომპონენტზე რივიუ არ მიიღებაა დასამთავრებელია დდ
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private readonly tokenService = inject(TokenService);
  readonly isSubmitting = signal(false);
  readonly resendMessage = signal<string | null>(null);
  readonly resendStatus = signal<'success' | 'error' | null>(null);
  readonly otpError = signal<string | null>(null);

  readonly email = 'test@test.com';
  readonly otpConfig: OtpConfig = {
    length: 4,
    inputType: 'number',
  };

  public errorMessage = signal<string>('');

  private registerVerifyLogic = signal<boolean>(true);
  private otpContext = signal<'sign-in' | 'sign-up' | 'forgot-password'>(
    'sign-up',
  );

  ///ბექააა
  public isLoading = computed(() => this.authService.isLoginLoading());

  public otpForm = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.pattern('^\\d*$')]],
  });

  public verifyOtp(): void {
    this.authService
      .verifyMfa({
        ...this.otpForm.getRawValue(),
        challengeId: this.authService.getChallengeId(),
      })
      .subscribe();
  }
  /////////

  //nikaaaa
  public readonly form = this.fb.nonNullable.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
  });

  ////

  // Mock Version got code length:4, In task: 6
  public smsCodeVerificationForm = this.fb.nonNullable.group({
    verificationCode: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
    ],
  });

  public ngOnInit(): void {
    const context = this.route.snapshot.data?.['otpContext'];
    if (context === 'forgot-password') {
      this.otpContext.set('forgot-password');
      return;
    }

    const path = this.route.snapshot.url[0]?.path;
    if (path === 'sign-in') {
      this.registerVerifyLogic.set(false);
      this.otpContext.set('sign-in');
    } else if (path === 'sign-up') {
      this.registerVerifyLogic.set(true);
      this.otpContext.set('sign-up');
    }
  }

  public submit(): void {
    const context = this.otpContext();
    if (context === 'forgot-password') {
      this.forgotPasswordVerification();
      return;
    }

    if (this.registerVerifyLogic()) {
      this.registerVerification();
    }
  }

  private registerVerification(): void {
    if (this.smsCodeVerificationForm.invalid) {
      this.smsCodeVerificationForm.markAllAsTouched();
      return;
    }

    const { verificationCode } = this.smsCodeVerificationForm.getRawValue();

    this.authService
      .verifyOtpCode(verificationCode)
      .pipe(
        tap((res) => {
          this.router.navigate(['/auth/success']);
        }),
        catchError((err) => {
          const messages = err.error?.message;
          this.errorMessage.set(messages);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  private forgotPasswordVerification(): void {
    if (this.smsCodeVerificationForm.invalid) {
      this.smsCodeVerificationForm.markAllAsTouched();
      return;
    }

    const { verificationCode } = this.smsCodeVerificationForm.getRawValue();

    this.authService
      .verifyForgotPasswordOtp(verificationCode)
      .pipe(
        tap(() => {
          this.router.navigate(['/auth', ...forgotPasswordSegments.reset]);
        }),
        catchError((err) => {
          this.errorMessage.set(err);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  //ესენი ასინქების გარეშე რომ გვქონდეს,წესით ტავიდან იქნება დასაწერი
  submitReset(): void {
    this.otpError.set(null);
    this.form.markAllAsTouched();

    const otpValue = this.form.controls.otp.value;
    if (!otpValue) {
      this.otpError.set('OTP is required');
      return;
    }

    if (otpValue.length < 4) {
      this.otpError.set('OTP must be 4 digits');
      return;
    }

    if (this.form.invalid) {
      this.otpError.set('OTP must be 4 digits');
      return;
    }

    this.isSubmitting.set(true);
    this.authService
      .verifyForgotPasswordOtp(otpValue)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/auth/reset-password']);
        },
        error: (error) => {
          const httpError = error as HttpErrorResponse;
          if (httpError?.status === 400) {
            this.otpError.set('Invalid OTP code');
          } else {
            this.otpError.set('Unable to verify OTP. Please try again.');
          }
        },
      });
  }

  public resendVerification(): void {
    this.authService.resendVerificationCode().pipe(take(1)).subscribe();
  }

  public goBack(): void {
    this.router.navigate(['auth/phone']);
  }
}
