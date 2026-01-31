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
  OtpVerificationType,
  getOtpVerificationConfig,
} from './models/otp-verification.model';
import {
  interval,
  Subject,
  Subscription,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs';
import { TimerType } from '../../models/auth.models';
import { TextInput } from "@tia/shared/lib/forms/input-field/text-input";

@Component({
  selector: 'app-otp-verification',
  imports: [ButtonComponent, ReactiveFormsModule, Spinner, Otp, RouterLink, TextInput],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpVerification {
  private fb = inject(FormBuilder);
  public type = input.required<OtpVerificationType>();
  public timeLimit = input(1);
  public timerType = input<TimerType>('phone');
  public isVerifyCalled = output<{ isCalled: boolean; otp: string | null }>();
  public isResendCalled = output<boolean>();

  public config = computed(() => getOtpVerificationConfig(this.type()));

  public isLoading = signal(false);
  public isSubmitting = signal(false);
  public submitError = signal<string | null>(null);
  public otpConfig = signal({ length: 4 });
  public phoneConfig = signal({ label: "Phone Number" });

  public showIcon = computed(() => this.config().showIcon);
  public iconUrl = computed(() => this.config().iconUrl);
  public title = computed(() => this.config().title);
  public subText = computed(() => this.config().subText);
  public submitBtnName = computed(() => this.config().submitBtnName);
  public resendText = computed(() => this.config().resendText);
  public resendLinkText = computed(() => this.config().resendLinkText);
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

  public otpForm = this.fb.group({
    code: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      this.countdown();
      if (this.countdown() === 0) {
        setTimeout(() => {
          this.onTimeout.emit();
        }, 1000);
      }
    });
  }

  public ngOnInit() {
    this.countdown.set(this.maxTime());
    this.startTimer();
  }

  private startTimer() {
    this.timerSubscription = this.timer$
      .pipe(
        takeUntil(this.destroy$),
        takeWhile(() => this.countdown() > 0),
        tap(() => {
          this.countdown.update((s) => s - 1);
        }),
      )
      .subscribe();
  }

  public onSubmit(): void {
    if (this.otpForm.invalid) {
      return;
    }

    this.isVerifyCalled.emit({
      isCalled: true,
      otp: this.otpForm.getRawValue().code,
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.timerSubscription?.unsubscribe();
  }
}
