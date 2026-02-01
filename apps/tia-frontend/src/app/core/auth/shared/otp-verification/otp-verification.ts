import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';
import { Otp } from '@tia/shared/lib/forms/otp/otp';
import {
  interval,
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
  IVerified,
  OtpVerificationType,
} from '../../models/otp-verification.models';
import { getOtpVerificationConfig } from '../../config/otp-verification.config';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-otp-verification',
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    Spinner,
    Otp,
    RouterLink,
    TextInput,
    SimpleAlerts,
    TranslatePipe
  ],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpVerification {
  private fb = inject(FormBuilder);
  public type = input.required<OtpVerificationType>();
  public timeLimit = input(1);
  public timerType = input<TimerType>('phone');
  public isVerifyCalled = output<IVerified>();
  public isResendCalled = output<boolean>();

  public config = computed(() => getOtpVerificationConfig(this.type()));

  public isLoading = signal(false);
  public submitError = signal<string | null>(null);
  public otpConfig = signal({ length: 4, label: 'Verification Code' });
  public phoneConfig = signal({
    label: 'Phone Number',
    errorMessage: 'invalid phone number',
    placeholder: '(555) 0000-0000',
  });


  public iconUrl = computed(() => this.config().iconUrl);
  public title = computed(() => this.config().title);
  public subText = computed(() => this.config().subText);
  public submitBtnName = computed(() => this.config().submitBtnName);
  public backLink = computed(() => this.config().backLink);
  public backLinkText = computed(() => this.config().backLinkText);

  private destroy$ = new Subject<void>();
  private timerSubscription?: Subscription;
  public maxTime = computed(() => {
    const limit = Math.abs(Number(this.timeLimit()));

    return limit * 60;
  });
  
  public countdown = signal<number>(0);
  private timer$ = interval(1000);

  public isResendActive = signal<boolean>(false);

  public onTimeout = output<void>();
  public resendClicked = output<void>();

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
    });
  }

  public ngOnInit(): void {
    this.countdown.set(this.maxTime());
    this.startTimer();
  }

  private startTimer(): void {
    this.timerSubscription = this.timer$
      .pipe(
        takeUntil(this.destroy$),
        takeWhile(() => this.countdown() > 0),
        tap(() => {
          this.countdown.update((s) => s - 1);
        }),
      )
      .subscribe();
    this.isResendActive.set(false);
  }

  public onSubmit(): void {
  const currentForm = this.activeForm();
  
  if (currentForm.invalid) {
    currentForm.markAllAsTouched();
    this.submitError.set("Please check the required fields.");
    return;
  }

  const rawValue = currentForm.getRawValue();
  let otp: string | null = null;

  if ('phoneNumber' in rawValue) {
    otp = rawValue.phoneNumber;
  } else if ('code' in rawValue) {
    otp = rawValue.code;
  }

  this.isVerifyCalled.emit({
    isCalled: true,
    otp: otp
  });
}

  public onResend(): void {
    if (this.countdown() > 0) {
      return;
    }

    this.isResendCalled.emit(true);
    this.countdown.set(this.maxTime());
    this.startTimer();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.timerSubscription?.unsubscribe();
  }
}
