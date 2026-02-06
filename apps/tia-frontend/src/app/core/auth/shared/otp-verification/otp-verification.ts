import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { toSignal } from '@angular/core/rxjs-interop';
import { translateConfig } from '@tia/shared/utils/translate-config/config-translator.util';
import { OTP_VERIFY_FORM } from '../../config/inputs.config';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { Routes } from '../../models/tokens.model';

@Component({
  selector: 'app-otp-verification',
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    Otp,
    TextInput,
    SimpleAlerts,
    TranslatePipe,
    RouteLoader,
  ],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpVerification implements OnInit {
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);
  private router = inject(Router);

  public type = input.required<OtpVerificationType>();
  public timeLimit = input(1);
  public timerType = input<TimerType>('phone');
  public errorMessage = input<string | null>(null);
  public remainingAttempts = input<number | null>(null);
  public customRemainingAttempts = input<number | null>(null);
  public noMoreAttempsRedirectRoute = input<string | null>(null);
  public phoneErrorMessage = input<string | null>(null);
  public isBtnRowDirection = input<boolean>(false);
  public isDisabled = input<boolean>(false);
  public isTimerDisplayed = input<boolean>(true);
  public onErrorRedirect = input<boolean>(true);
  public inputOtpConfig = input<IOtpVerificationConfig>();


  public onBackOut = output<void>();
  public onTimeout = output<void>();
  public isVerifyCalled = output<IVerified>();
  public isResendCalled = output<boolean>();
  public clickedOnCancl = output<void>();
  public customError = output<void>();

  public resendTries = signal<number>(3);
  public internalRemainingAttempts = signal<number | null>(null);
  public isLoading = signal(false);
  public submitError = signal<string | null>(null);
  public countdown = signal<number>(0);
  public isResendActive = signal<boolean>(false);
  public isLimitExeeded = signal<boolean>(false);

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

    if (customAttempts !== null) {
      this.internalRemainingAttempts.set(customAttempts);
    } else if (parentAttempts !== null) {
      this.internalRemainingAttempts.set(parentAttempts);
    }

    this.countdown.set(this.maxTime());
    this.startTimer();
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

    setTimeout(() => {
      this.otpForm.reset();
    }, 0);

    setTimeout(() => {
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
