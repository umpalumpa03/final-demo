import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { PaymentSummary } from '../../shared/ui/payment-summary/payment-summary';
import {
  PaybillPayload,
  PaybillProvider,
} from '../../shared/models/paybill.model';
import { otpConfiguration } from './config/otp.config';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-paybill-otp-verification',
  imports: [
    Otp,
    ButtonComponent,
    AlertTypesWithIcons,
    LibraryTitle,
    BasicCard,
    PaymentSummary,
    TranslatePipe
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

  public onOtpResend(): void {
    this.resendCode.emit();
  }

  public handleVerify(): void {
    if (this.currentCode().length === 4) {
      this.verify.emit(this.currentCode());
    }
  }
}
