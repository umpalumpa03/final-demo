import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { AlertTypesWithIcons } from '@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { PaymentSummary } from '../../../../shared/ui/payment-summary/payment-summary';
import {
  PaybillPayload,
  PaybillProvider,
} from '../../../../shared/models/paybill.model';
import { TranslatePipe } from '@ngx-translate/core';
import { OtpVerification } from 'apps/tia-frontend/src/app/core/auth/shared/otp-verification/otp-verification';
import { IVerified } from 'apps/tia-frontend/src/app/core/auth/models/otp-verification.models';
import { otpConfiguration } from '../../config/otp.config';

@Component({
  selector: 'app-paybill-otp-verification',
  imports: [
    AlertTypesWithIcons,
    BasicCard,
    PaymentSummary,
    TranslatePipe,
    OtpVerification,
  ],
  templateUrl: './paybill-otp-verification.html',
  styleUrl: './paybill-otp-verification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillOtpVerification {
  public readonly summary = input.required<PaybillPayload>();
  public readonly provider = input<PaybillProvider | null>(null);
  public readonly iconBgColor = input<string>('#F0F9FF');
  public readonly iconBgPath = input<string>();
  public readonly errorMessage = input<string | null>(null);

  public readonly verify = output<string>();
  public readonly cancelPayment = output<void>();
  public readonly resendCode = output<void>();

  protected readonly otpConfig = otpConfiguration;

  public currentCode = model('');

  protected readonly summaryItems = computed(() => [
    {
      label: 'paybill.main.otp.summary_fields.service',
      value:
        this.provider()?.name ??
        this.provider()?.serviceName ??
        'paybill.main.otp.summary_fields.unknown_service',
      canTranslate: !this.provider()?.name && !this.provider()?.serviceName,
    },
    {
      label: 'paybill.main.otp.summary_fields.account',
      value: this.summary()?.identification.accountNumber ?? '',
      canTranslate: false,
    },
    {
      label: 'paybill.main.otp.summary_fields.amount',
      value: `${this.summary()?.amount}`,
      isTotal: true,
      canTranslate: false,
    },
  ]);

  public onOtpComplete(code: string): void {
    this.currentCode.set(code);
  }

  public onCancel(): void {
    this.cancelPayment.emit();
  }

  public onResend(): void {
    this.resendCode.emit();
  }

  public onVerify(event: IVerified): void {
    if (event.isCalled && event.otp) {
      this.verify.emit(event.otp);
    }
  }
}
