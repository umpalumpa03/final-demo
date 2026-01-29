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
  private readonly MAX_TIME = 60;
  private readonly CIRCUMFERENCE = 282.7;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  readonly isSubmitting = signal(false);
  readonly resendMessage = signal<string | null>(null);
  readonly resendStatus = signal<'success' | 'error' | null>(null);
  readonly otpError = signal<string | null>(null);

  public isResendDisabled = signal<boolean>(false);
  public isTimerActive = signal<boolean>(false);

  private destroy$ = new Subject<void>();

  public countdown = signal<number>(this.MAX_TIME);
  private timer$ = interval(1000);

  readonly email = 'test@test.com';
  readonly otpConfig: OtpConfig = {
    length: 4,
    inputType: 'number',
  };

  public errorMessage = signal<string>('');

  public from = signal<string>('otp-sign-up');

  public strokeOffset = computed(() => {
    const progress = this.countdown() / this.MAX_TIME;
    return this.CIRCUMFERENCE * (1 - progress);
  });


  constructor() {

    effect(() => {
      this.countdown();

      if (this.countdown() === 0) {
        this.isResendDisabled.set(false);
      }

      this.isResendDisabled.set(true)
      this.isTimerActive.set(true)
    });
  }

  public ngOnInit() {
    const source = this.route.snapshot.url[0].path;
    if (source) {
      this.from.set(source);
    }

    this.startTimer();
  }

  public isLoading = computed(() => this.authService.isLoginLoading());

  public otpForm = this.fb.nonNullable.group({
    code: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
    ],
  });

  public submit(): void {
    this.otpError.set(null);
    this.otpForm.markAllAsTouched();

    const otpValue = this.otpForm.controls.code.value;

    if (!otpValue) {
      this.otpError.set('OTP is required');
      return;
    }

    const context = this.from();

    switch (context) {
      case 'otp-sign-in':
        this.verifyOtp();
        break;

      case 'otp-forgot-password':
        this.forgotPasswordVerification();
        break;

      case 'otp-sign-up':
      default:
        this.registerVerification();
        break;
    }
  }

  public verifyOtp(): void {
    this.authService
      .verifyMfa({
        ...this.otpForm.getRawValue(),
        challengeId: this.authService.getChallengeId(),
      })
      .subscribe();
  }

  private registerVerification(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    const { code } = this.otpForm.getRawValue();

    this.authService
      .verifyOtpCode(code)
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
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    const { code } = this.otpForm.getRawValue();

    this.authService
      .verifyForgotPasswordOtp(code)
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

  public resendVerification(): void {
    if (this.isResendDisabled()) return;
    this.countdown.set(this.MAX_TIME);
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
