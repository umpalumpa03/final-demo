import {
  ChangeDetectionStrategy,
  Component,
  computed,
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

@Component({
  selector: 'app-otp-verification',
  imports: [ButtonComponent, ReactiveFormsModule, Spinner, Otp, RouterLink, Timer],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpVerification {
  private fb = inject(FormBuilder);
  public type = input.required<OtpVerificationType>();
  public isVerifyCalled = output<{ isCalled: boolean; otp: string | null }>();
  public isRsendCalled = output<boolean>();

  public config = computed(() => getOtpVerificationConfig(this.type()));

  public isLoading = signal(false);
  public isSubmitting = signal(false);
  public submitError = signal<string | null>(null);
  public otpConfig = signal({ length: 4 });

  public showIcon = computed(() => this.config().showIcon);
  public iconUrl = computed(() => this.config().iconUrl);
  public title = computed(() => this.config().title);
  public subText = computed(() => this.config().subText);
  public submitBtnName = computed(() => this.config().submitBtnName);
  public resendText = computed(() => this.config().resendText);
  public resendLinkText = computed(() => this.config().resendLinkText);
  public backLink = computed(() => this.config().backLink);
  public backLinkText = computed(() => this.config().backLinkText);

  public otpForm = this.fb.group({
    code: ['', Validators.required],
  });

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
    if (this.otpForm.invalid) {
      return;
    }

    this.isRsendCalled.emit(true);
  }
}
