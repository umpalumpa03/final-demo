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
import { Observable } from 'rxjs';
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
  public submitBtnName = input<string>('Submit');
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

  public submitResult = output<{ statusCode: number; message: string }>();

  public otpForm = this.fb.group({
    code: ['', Validators.required],
  });

  public onSubmit(): void {
    if (this.otpForm.invalid) return;

    this.isSubmitting.set(true);
    this.submitMethod()(this.otpForm.value.code!).subscribe({});
  }
}
