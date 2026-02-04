import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UiModal } from '../ui-modal/ui-modal';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { Otp } from '@tia/shared/lib/forms/otp/otp';
import { OtpConfig } from '@tia/shared/lib/forms/models/otp.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-otp-modal',
  imports: [UiModal, ReactiveFormsModule, Otp, ButtonComponent, TranslatePipe],
  templateUrl: './otp-modal.html',
  styleUrl: './otp-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpModal {
  private readonly fb = inject(FormBuilder);

  public readonly isOpen = input.required<boolean>();
  public readonly title = input<string>('Verify Transfer');
  public readonly description = input<string>(
    'Enter the code sent to your phone.',
  );
  public readonly verifyOtpTitle = input<string>('Verify');
  public readonly isLoading = input<boolean>(false);

  public readonly closed = output<void>();
  public readonly verify = output<string>();
  public readonly hasResend = input<boolean>(false);
  public readonly resendText = input<string>("Didn't receive the code?");

  public readonly resend = output<void>();
  //temporary will be here, this component needs changes
  public readonly inputConfig: OtpConfig = {
    label: 'OTP Code *',
    length: 4,
    inputType: 'number',
  };

  public readonly form = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(4)]],
  });

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.verify.emit(this.form.controls.otp.value!);
  }
}
