import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { Otp } from '@tia/shared/lib/forms/otp/otp';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { PaymentSummary } from './components/payment-summary/payment-summary';
import {
  PaybillPayload,
  PaybillProvider,
} from '../../../../models/paybill.model';

@Component({
  selector: 'app-paybill-otp-verification',
  imports: [
    Otp,
    ButtonComponent,
    AlertTypesWithIcons,
    LibraryTitle,
    BasicCard,
    PaymentSummary,
  ],
  templateUrl: './paybill-otp-verification.html',
  styleUrl: './paybill-otp-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillOtpVerification {
  public readonly summary = input.required<PaybillPayload>();
  public readonly provider = input<PaybillProvider | null>(null);

  public readonly verify = output<string>();
  public readonly cancelPayment = output<void>();

  protected readonly otpTitle = 'OTP Verification';
  protected readonly otpSubtitle =
    'Enter the 6-digit code sent to your registered mobile number';
  protected readonly otpAlert =
    'For transactions above $50, we require additional verification for your security.';

  public currentCode = model('');
  public onOtpComplete(code: string): void {
    this.currentCode.set(code);
  }

  public handleVerify(): void {
    if (this.currentCode().length === 6) {
      this.verify.emit(this.currentCode());
    }
  }
}
