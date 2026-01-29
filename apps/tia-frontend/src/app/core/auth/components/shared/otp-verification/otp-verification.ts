import {
  ChangeDetectionStrategy,
  Component,
  signal,
  computed,
  inject,
  OnDestroy,
  effect,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

import { AuthService } from '../../../services/auth.service';
import {
  catchError,
  EMPTY,
  take,
  finalize,
  tap,
  interval,
  Subject,
  takeWhile,
  takeUntil,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';
import { forgotPasswordSegments } from 'apps/tia-frontend/src/app/core/auth/components/forgot-password/forgot-password.routes';
import { OtpConfig } from '@tia/shared/lib/forms/models/otp.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Otp } from '@tia/shared/lib/forms/otp/otp';
import { AuthFromType } from '../../../models/auth.models';

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
export class OtpVerification implements OnDestroy {
  // gavitanot
  private readonly MAX_TIME = 60;
  private readonly CIRCUMFERENCE = 282.7;

  //ამაზე კომპონენტზე რივიუ არ მიიღებაა დასამთავრებელია დდ
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  readonly isSubmitting = signal(false);
  readonly resendMessage = signal<string | null>(null);
  readonly resendStatus = signal<'success' | 'error' | null>(null);
  readonly otpError = signal<string | null>(null);

  public isResendDisabled = signal<boolean>(true);

  private destroy$ = new Subject<void>();

  public countdown = signal<number>(this.MAX_TIME);
  private timer$ = interval(1000);

  readonly email = 'test@test.com';
  readonly otpConfig: OtpConfig = {
    length: 4,
    inputType: 'number',
  };

  public errorMessage = signal<string>('');

  private registerVerifyLogic = signal<boolean>(true);

  public from = signal<AuthFromType>('sign-up');

  public strokeOffset = computed(() => {
    const progress = this.countdown() / this.MAX_TIME;
    return this.CIRCUMFERENCE * (1 - progress);
  });

  constructor() {
    const nav = this.router.currentNavigation();
    const source = nav?.extras.state?.['from'];

    if (source) {
      this.from.set(source);
    }

    effect(() => {
      this.countdown();

      if (this.countdown() === 0) {
        this.isResendDisabled.set(false);
      }
    });
  }

  public ngOnInit() {
    this.startTimer();
  }

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
    [
      Validators.required, 
      Validators.minLength(4), 
      Validators.maxLength(4),
    ],
  ],
});

  public submit(): void {
    // disable when timeout


    const context = this.from();
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
    if (this.isResendDisabled()) return;
    this.countdown.set(this.MAX_TIME)
    this.startTimer();
    this.authService.resendVerificationCode().pipe(take(1)).subscribe();
  }

  public goBack(): void {
    this.router.navigate(['auth/phone']);
  }

  private startTimer() {
    this.timer$
      .pipe(
        takeUntil(this.destroy$),
        takeWhile(() => this.countdown() > 0),
        tap(() => {
          this.countdown.update((s) => s - 1);
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
