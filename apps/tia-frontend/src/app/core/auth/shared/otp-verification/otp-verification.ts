import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { catchError, Observable, tap, EMPTY } from 'rxjs';
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
  imports: [ButtonComponent, ReactiveFormsModule, Spinner, Otp],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpVerification {
  private fb = inject(FormBuilder);

  public isLoading = input<boolean>(false);
  public title = input<string>('');
  public subText = input<string>('');
  public submitBtnName = input<string>('submit');
  public otpConfig = input<OtpConfig>({ length: 4, inputType: 'number' });
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
  public submitResult = output<{ message: string }>();
  public submitErrorOutput = output<string>();

  public otpForm = this.fb.group({
    code: ['', Validators.required],
  });

  public onSubmit(): void {
    if (this.otpForm.invalid) return;

    this.isSubmitting.set(true);
    this.submitMethod()(this.otpForm.value.code!)
      .pipe(
        tap(() => {
          this.submitResult.emit({
            message: 'success',
          });
          this.isSubmitting.set(false);
        }),
        catchError((err) => {
          this.submitErrorOutput.emit(err.message || 'incorrect otp');
          this.isSubmitting.set(false);
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
