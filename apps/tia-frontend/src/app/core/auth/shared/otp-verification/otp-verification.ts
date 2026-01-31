import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable, catchError, finalize, tap } from 'rxjs';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';
import { OtpConfig } from '@tia/shared/lib/forms/models/otp.model';
import { Otp } from '@tia/shared/lib/forms/otp/otp';
import {
  ForgotPasswordVerifyResponse,
  IMfaVerifyResponse,
} from '../../models/authResponse.model';
import { OtpResponse } from '../../models/authRequest.models';
import { Timer } from '../timer/timer';
import { TimerType } from '../../models/auth.models';

@Component({
  selector: 'app-otp-verification',
  imports: [ButtonComponent, ReactiveFormsModule, Spinner, Otp, RouterLink, Timer],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpVerification {
  private fb = inject(FormBuilder);
  public timerTime = input<number>(1);
  public timerType = input<TimerType>("phone");
  public isButtonDisabled = signal(true);

  onTimerStatusChange(isFinished: boolean) {
    console.log('Is the timer done?', isFinished);
    this.isButtonDisabled.set(!isFinished);
    
    if (isFinished) {
      console.log('isFinished');
    }
  }

  onResendTriggered() {
    console.log('The user clicked resend! Showing loading state...');
  }

  public isLoading = input<boolean>(false);
  public title = input<string>();
  public subText = input<string>();
  public submitBtnName = input<string>();
  public otpConfig = input<OtpConfig>({ length: 4, inputType: 'number' });
  public showIcon = input<boolean>(false);
  public iconUrl = input<string>();
  public showResend = input<boolean>(false);
  public resendText = input<string>();
  public resendLinkText = input<string>();
  public backLink = input<string | null>(null);
  public backLinkText = input<string>();
  public submitMethod =
    input.required<
      (
        code: string,
      ) => Observable<
        IMfaVerifyResponse | OtpResponse | ForgotPasswordVerifyResponse
      >
    >();
  public isSubmitting = signal(false);
  public submitError = signal<string | null>(null);
  public submitResult = output<{ statusCode: number; message: string }>();

  public otpForm = this.fb.group({
    code: ['', Validators.required],
  });

  public onSubmit(): void {
    if (this.otpForm.invalid || !this.submitMethod()) return;

    this.isSubmitting.set(true);
    this.submitError.set(null);
    const code = this.otpForm.value.code;
    this.submitMethod()(code!)
      .pipe(
        tap(() => {
          this.submitResult.emit({ statusCode: 200, message: 'veirfied' });
        }),
        catchError((err) => {
          return err.message;
        }),
        finalize(() => this.isSubmitting.set(false)),
      )
      .subscribe();
  }
}
