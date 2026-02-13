import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { Otp } from '@tia/shared/lib/forms/otp/otp';
import {
  catchError,
  EMPTY,
  interval,
  map,
  startWith,
  Subject,
  Subscription,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs';
import { TimerType } from '../../models/auth.models';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { numberValidator } from '../../utils/validators/form-validations';
import { SimpleAlerts } from '@tia/shared/lib/alerts/components/simple-alerts/simple-alerts';
import {
  IOtpVerificationConfig,
  IVerified,
  OtpVerificationType,
} from '../../models/otp-verification.models';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { translateConfig } from '@tia/shared/utils/translate-config/config-translator.util';
import { OTP_VERIFY_FORM } from '../../config/inputs.config';
import { Routes } from '../../models/tokens.model';
import { ErrorPage } from '../error-page/error-page';
import { OtpSettingsConfiguration } from '../../models/authResponse.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-otp-verification',
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    Otp,
    TextInput,
    SimpleAlerts,
    TranslatePipe,
    ErrorPage,
  ],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpVerification implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private translate = inject(TranslateService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  public type = input.required<OtpVerificationType>();
  public timeLimit = input(1);
  public timerType = input<TimerType>('phone');
  public errorMessage = input<string | null>(null);
  public remainingAttempts = input<number | null>(null);
  public customRemainingAttempts = input<number | null>(null);
  public noMoreAttempsRedirectRoute = input<string | null>(null);
  public phoneErrorMessage = input<string | null>(null);
  public isBtnRowDirection = input<boolean>(false);
  public isTimerDisplayed = input<boolean>(true);
  public onErrorRedirect = input<boolean>(true);
  public inputOtpConfig = input<IOtpVerificationConfig>();
  public redirectUrl = input<string>();
  public redirectText = input<string>();
  public isButtonLoading = input<boolean>(false);

  public onBackOut = output<void>();
  public onTimeout = output<void>();
  public isVerifyCalled = output<IVerified>();
  public isResendCalled = output<boolean>();
  public customError = output<void>();

  public resendTries = signal<number>(3);
  public internalRemainingAttempts = signal<number | null>(null);
  public isLoading = signal(false);
  public submitError = signal<string | null>(null);
  public countdown = signal<number>(0);
  public isResendActive = signal<boolean>(false);
  public isLimitExeeded = signal<boolean>(false);
  public isErrorPageVisible = signal<boolean>(false);


  // Default In case of Error?
  public defaultSettingConfig = signal<OtpSettingsConfiguration>({
    otp: {
      expirationMinutes: 5,
      maxResendAttempts: 3,
      maxVerifyAttempts: 5,
      resendTimeoutMs: 60000,
    },
  });

  public isHeaderVisible = computed(
    () =>
      this.inputOtpConfig()?.iconUrl ||
      this.inputOtpConfig()?.title ||
      this.inputOtpConfig()?.subText,
  );

  public maxTime = computed(() => {
    const limit = Math.abs(Number(this.timeLimit()));

    return limit * 60;
  });

  public effectiveRemainingAttempts = computed(() => {
    const internalAttempts = this.internalRemainingAttempts();

    if (internalAttempts !== null) {
      return internalAttempts;
    }

    return this.remainingAttempts();
  });

  public unitedError = computed(() => {
    const error = this.errorMessage();
    const attempts = this.effectiveRemainingAttempts();

    if (!this.onErrorRedirect()) {
      this.customError.emit();
      return '';
    }

    if (error && attempts !== null && attempts > 0) {
      return `${error} (Remaining attempts: ${attempts})`;
    }

    if (attempts === 0) {
      const redirectRoute = this.noMoreAttempsRedirectRoute();
      this.router.navigate([redirectRoute || Routes.ERROR_PAGE]);
    }

    return '';
  });

  public isButtonDisabled = computed(() => {
    if (this.isLimitExeeded() || this.phoneErrorMessage()) {
      return true;
    }

    if (this.isResendActive()) {
      return true;
    }

    return false;
  });

  @HostListener('window:keydown.enter', ['$event'])
  public handleKeyBoardEvent(event: Event) {
    event.preventDefault();
    this.onSubmit();
  }

  public readonly otpComponent = viewChild(Otp);

  private destroy$ = new Subject<void>();
  private timerSubscription?: Subscription;

  private timer$ = interval(1000);

  public formConfig = toSignal(
    this.translate.onLangChange.pipe(
      startWith({
        lang: this.translate.getCurrentLang(),
        translation: null,
      }),
      map(() => {
        return translateConfig(OTP_VERIFY_FORM, (key) =>
          this.translate.instant(key),
        );
      }),
    ),
    {
      initialValue: translateConfig(OTP_VERIFY_FORM, (key) =>
        this.translate.instant(key),
      ),
    },
  );

  public setPhoneNumberForm = this.fb.group({
    phoneNumber: ['', [Validators.required, numberValidator]],
  });

  public otpForm = this.fb.group({
    code: ['', Validators.required],
  });

  public activeForm = computed(() => {
    return this.timerType() === 'phone'
      ? this.setPhoneNumberForm
      : this.otpForm;
  });

  constructor() {
    effect(() => {
      this.countdown();
      if (this.countdown() === 0) {
        setTimeout(() => {
          this.onTimeout.emit();
        }, 1000);
        this.isResendActive.set(true);
      }

      if (this.countdown() === 0 && this.resendTries() === 0) {
        this.router.navigate([Routes.ERROR_PAGE]);
        setTimeout(() => {
          this.resendTries.set(3);
        }, 2000);
      }
    });

    effect(() => {
      if (this.effectiveRemainingAttempts() === 0) {
        this.isLimitExeeded.set(true);
        this.customError.emit();
        if (this.onErrorRedirect()) {
          this.isErrorPageVisible.set(true);
        }
      }
    });

    effect(() => {
      if (!this.isButtonDisabled()) {
        setTimeout(() => {
          this.otpComponent()?.focusFirst();
        }, 0);
      }
    });
  }

  public ngOnInit(): void {
    const customAttempts = this.customRemainingAttempts();
    const parentAttempts = this.remainingAttempts();

    this.authService
      .getOtpConfig()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          console.log(res, '__Res');
          this.resendTries.set(res.otp.maxResendAttempts);
          // ... Do Rest Same Way
          // this.defaultSettingConfig.set(res);
        }),
        catchError(() => {
          // this.defaultSettingConfig.set();
          return EMPTY;
        }),
      )
      .subscribe();

    if (customAttempts !== null) {
      this.internalRemainingAttempts.set(customAttempts);
    } else if (parentAttempts !== null) {
      this.internalRemainingAttempts.set(parentAttempts);
    }

    this.countdown.set(this.maxTime());
    if (this.isTimerDisplayed()) {
      this.startTimer();
    }
  }

  private startTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timerSubscription = this.timer$
      .pipe(
        takeUntil(this.destroy$),
        takeWhile(() => this.countdown() > 0),
        tap(() => {
          this.countdown.update((sec) => sec - 1);
        }),
      )
      .subscribe();
    this.isResendActive.set(false);
  }

  public onSubmit(): void {
    if (this.isButtonDisabled()) {
      return;
    }

    if (!this.onErrorRedirect() || this.isButtonLoading()) {
      this.isLoading.set(true);
    }

    const currentForm = this.activeForm();

    if (currentForm.invalid) {
      currentForm.markAllAsTouched();
      this.submitError.set('Please check the required fields.');

      setTimeout(() => {
        this.submitError.set('');
      }, 5000);
      return;
    }

    const rawValue = currentForm.getRawValue();
    let otp: string | null = null;

    if ('phoneNumber' in rawValue) {
      otp = rawValue.phoneNumber;
    } else if ('code' in rawValue) {
      otp = rawValue.code;
    }

    if (this.internalRemainingAttempts() !== null) {
      this.internalRemainingAttempts.update((value) =>
        value !== null && value > 0 ? value - 1 : value,
      );
    }

    this.isVerifyCalled.emit({
      isCalled: true,
      otp: otp,
    });

    if (!this.onErrorRedirect() || this.isButtonLoading()) {
      setTimeout(() => {
        this.isLoading.set(false);
        this.otpForm.reset();
        this.otpComponent()?.focusFirst();
      }, 2000);
    }

    setTimeout(() => {
      this.otpForm.reset();
      this.otpComponent()?.focusFirst();
    }, 0);
  }

  public handleAutoSubmit(code: string): void {
    this.otpForm.patchValue({ code });

    this.onSubmit();
  }

  public canResend = computed(
    () => this.countdown() === 0 && this.resendTries() > 0,
  );

  public onResend(): void {
    if (!this.canResend()) {
      return;
    }

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.resendTries.update((sec) => sec - 1);
    this.isResendCalled.emit(true);
    this.countdown.set(this.maxTime());
    this.startTimer();
  }

  public resgisterBackout(): void {
    this.onBackOut.emit();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.timerSubscription?.unsubscribe();
  }
}
