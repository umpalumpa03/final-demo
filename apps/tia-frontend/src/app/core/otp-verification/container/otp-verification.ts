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
import { catchError, EMPTY, tap } from 'rxjs';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { SimpleAlerts } from '@tia/shared/lib/alerts/components/simple-alerts/simple-alerts';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ErrorPage } from '../../auth/shared/error-page/error-page';
import { Routes } from '../../auth/models/tokens.model';
import {
  IOtpVerificationConfig,
  OtpSettingsConfiguration,
  OtpVerificationType,
} from '../models/otp-verification.models';
import { TimerType } from '../../auth/models/auth.models';
import { numberValidator } from '../../auth/utils/validators/form-validations';
import { OtpVerificationService } from '../services/otp-verification.service';
import { DEFAULT_SETTING_CONFIG } from '../config/otp.config';
import { ExpirationTimer } from '../directive/expiration-timer';
import { OtpResend } from '../components/otp-resend';
import { OtpVerifyService } from '../config/otp-verify.state';

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
  providers: [OtpVerifyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpVerification implements OnInit {
  private fb = inject(FormBuilder);
  private otpService = inject(OtpVerificationService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  public otpForms = inject(OtpVerifyService);

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
  public otpResendType = input<string>('');

  public onBackOut = output<void>();
  public onTimeout = output<void>();
  public isVerifyCalled = output<string>();
  public isResendCalled = output<void>();
  public customError = output<void>();

  public activeConfig = signal<OtpSettingsConfiguration>(
    DEFAULT_SETTING_CONFIG,
  );
  public resendRetries = signal<number>(0);
  public maxAttempts = signal<number>(0);
  public maxTotalTime = signal<number>(0);
  public maxTimeoutMs = signal<number>(0);
  public isButtonDisabled = signal(false);
  public buttonLoading = signal(false);
  public isInputDisabled = signal(false);
  public submitError = signal<string | null>(null);
  public isErrorPageVisible = signal<boolean>(false);
  public pendingVerification = signal<boolean>(false);

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

    effect(() => {
      if (this.pendingVerification() && !!this.errorMessage()) {
        this.pendingVerification.set(false);
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
    const form = this.activeForm();

    if (form.invalid) {
      form.markAllAsTouched();
      this.showTemporaryError('Please check the required fields.');
      return;
    }

    this.setLoadingState(true);

    const otp = this.extractOtp();

    this.pendingVerification.set(true);
    this.decreaseAttempts();
    this.isVerifyCalled.emit(otp);

    this.handlePostSubmitReset();
  }

  private extractOtp(): string {
    if (this.timerType() === 'phone') {
      return this.setPhoneNumberForm.controls.phoneNumber.value!;
    }

    return this.otpForm.controls.code.value!;
  }

  private decreaseAttempts(): void {
    this.maxAttempts.update((att) => (att > 0 ? att - 1 : att));
  }

  private setLoadingState(isLoading: boolean): void {
    this.isInputDisabled.set(isLoading);
    this.buttonLoading.set(isLoading);
  }

  private showTemporaryError(message: string): void {
    this.submitError.set(message);
    setTimeout(() => this.submitError.set(null), 5000);
  }

  private handlePostSubmitReset(): void {
    const delay = !this.onErrorRedirect() || this.isButtonLoading() ? 1000 : 0;

    setTimeout(() => {
      this.otpForm.reset();
      this.setLoadingState(false);
      this.otpComponent()?.focusFirst();
    }, delay);
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
    this.isResendCalled.emit();
    this.isButtonDisabled.set(false);
    this.isInputDisabled.set(false);
    this.otpForm.reset();
    this.submitError.set(null);
    setTimeout(() => {
      this.otpComponent()?.focusFirst();
    }, 0);
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
