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
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';
import { OtpConfig } from '@tia/shared/lib/forms/models/otp.model';
import { Otp } from '@tia/shared/lib/forms/otp/otp';
import {
  ForgotPasswordVerifyResponse,
  IMfaVerifyResponse,
} from '../../models/authResponse.model';
import { OtpResponse } from '../../models/authRequest.models';

@Component({
  selector: 'app-otp-verification',
  imports: [ButtonComponent, ReactiveFormsModule, Spinner, Otp, RouterLink],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpVerification {
  private fb = inject(FormBuilder);

  public isLoading = input<boolean>(false);
  public title = input<string>('');
  public subText = input<string>('');
  public submitBtnName = input<string>('Submit');
  public otpConfig = input<OtpConfig>({ length: 4, inputType: 'number' });
  public showIcon = input<boolean>(false);
  public iconUrl = input<string>('images/svg/button-icons/confirm-icon.svg');
  public showResend = input<boolean>(false);
  public resendText = input<string>("Didn't receive the code?");
  public resendLinkText = input<string>('Resend');
  public backLink = input<string | null>(null);
  public backLinkText = input<string>('Back to Sign In');
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
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.submitResult.emit({ statusCode: 200, message: 'Success' });
        },
        error: (err) => {
          const httpError = err as HttpErrorResponse;
          const statusCode = httpError?.status ?? 0;
          const message =
            statusCode === 400
              ? 'Invalid code. Please try again.'
              : 'Something went wrong. Please try again.';
          this.submitError.set(message);
          this.submitResult.emit({ statusCode, message });
        },
      });
  }
}
