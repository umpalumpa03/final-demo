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
import { catchError, EMPTY, map, startWith, tap } from 'rxjs';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { SimpleAlerts } from '@tia/shared/lib/alerts/components/simple-alerts/simple-alerts';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { translateConfig } from '@tia/shared/utils/translate-config/config-translator.util';
import { ErrorPage } from '../../auth/shared/error-page/error-page';
import { Routes } from '../../auth/models/tokens.model';
import {
  IOtpVerificationConfig,
  IVerified,
  OtpSettingsConfiguration,
  OtpVerificationType,
} from '../models/otp-verification.models';
import { TimerType } from '../../auth/models/auth.models';
import { OTP_VERIFY_FORM } from '../../auth/config/inputs.config';
import { numberValidator } from '../../auth/utils/validators/form-validations';
import { OtpVerificationService } from '../services/otp-verification.service';
import { DEFAULT_SETTING_CONFIG } from '../config/otp.config';
import { ExpirationTimer } from '../directive/expiration-timer';
import { OtpResend } from '../components/otp-resend';

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
    ExpirationTimer,
    OtpResend,
  ],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpVerification implements OnInit {
  private fb = inject(FormBuilder);
  private otpService = inject(OtpVerificationService);
  private translate = inject(TranslateService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  public type = input.required<OtpVerificationType>();
  public timerType = input<TimerType>('phone');
  public errorMessage = input<string | null>(null);
  public noMoreAttempsRedirectRoute = input<string | null>(null);
  public phoneErrorMessage = input<string | null>(null);
  public isBtnRowDirection = input<boolean>(false);
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

  private activeConfig = signal<OtpSettingsConfiguration>(
    DEFAULT_SETTING_CONFIG,
  );
  public resendRetries = signal<number>(0);
  public maxAttempts = signal<number>(0);
  public maxTotalTime = signal<number>(0);
  public maxTimeoutMs = signal<number>(0);
  public isButtonDisabled = signal(false);
  public isInputDisabled = signal(false);
  public submitError = signal<string | null>(null);
  public isErrorPageVisible = signal<boolean>(false);

  public readonly otpComponent = viewChild(Otp);

  public isHeaderVisible = computed(
    () =>
      this.inputOtpConfig()?.iconUrl ||
      this.inputOtpConfig()?.title ||
      this.inputOtpConfig()?.subText,
  );

  public unitedError = computed(() => {
    const error = this.errorMessage();
    const attempts = this.maxAttempts();

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
      if (this.maxAttempts() === 0) {
        this.customError.emit();
        if (this.onErrorRedirect()) {
          this.isErrorPageVisible.set(true);
        }
      }
    });
  }

  public ngOnInit(): void {
    this.otpService
      .getOtpConfig()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((res) => {
          this.activeConfig.set(res);
        }),
        catchError(() => {
          this.activeConfig.set(DEFAULT_SETTING_CONFIG);
          return EMPTY;
        }),
      )
      .subscribe();

    this.resendRetries.set(this.activeConfig().otp.maxResendAttempts);
    this.maxAttempts.set(this.activeConfig().otp.maxVerifyAttempts);
    this.maxTotalTime.set(this.activeConfig().otp.expirationMinutes * 60);
    this.maxTimeoutMs.set(this.activeConfig().otp.resendTimeoutMs);
  }

  public onSubmit(): void {
    this.isInputDisabled.set(true)
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

    if (this.maxAttempts() !== null) {
      this.maxAttempts.update((value) =>
        value !== null && value > 0 ? value - 1 : value,
      );
    }

    this.isVerifyCalled.emit({
      isCalled: true,
      otp: otp,
    });

    if (!this.onErrorRedirect() || this.isButtonLoading()) {
      setTimeout(() => {
        this.otpForm.reset();
        this.otpComponent()?.focusFirst();
      }, 2000);
    }

    setTimeout(() => {
      this.otpForm.reset();
      this.isInputDisabled.set(false)
      this.otpComponent()?.focusFirst();
    }, 0);
  }

  public resgisterBackout(): void {
    this.onBackOut.emit();
  }

  public handleAutoSubmit(code: string): void {
    this.otpForm.patchValue({ code });

    this.onSubmit();
  }

  public expirationTimerHandle(): void {
    if (this.onErrorRedirect()) {
      this.isErrorPageVisible.set(true);
    } else {
      this.router.navigate([Routes.ERROR_PAGE]);
    }
  }

  public handleResend(): void {
    this.isResendCalled.emit(true);
    this.isButtonDisabled.set(false);
  }

  public handleTimeout(): void {
    this.isButtonDisabled.set(true);
    this.onTimeout.emit();
  }

  @HostListener('window:keydown.enter', ['$event'])
  public handleKeyBoardEvent(event: Event): void {
    event.preventDefault();
    this.onSubmit();
  }
}
