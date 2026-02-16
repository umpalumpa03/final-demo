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
import { otpConfiguration } from '../../config/otp.config';
import { OtpVerification } from '@tia/core/otp-verification/container/otp-verification';

import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';

@Component({
  selector: 'app-paybill-otp-verification',
  imports: [
    AlertTypesWithIcons,
    BasicCard,
    PaymentSummary,
    TranslatePipe,
    OtpVerification,
    Skeleton,
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
  public readonly isLoading = input(false);

  public readonly verify = output<string>();
  public readonly cancelPayment = output<void>();
  public readonly resendCode = output<void>();

  protected readonly otpConfig = otpConfiguration;

  public currentCode = model('');

  protected readonly summaryItems = computed(() => {
    const payload = this.summary();
    const ident = payload?.identification;

    const userIdentifier =
      ident?.accountNumber ||
      ident?.phoneNumber ||
      ident?.policyNumber ||
      ident?.propertyCode ||
      ident?.tenantId ||
      Object.entries(ident || {}).find(
        ([key]) => key.toLowerCase() !== 'amount',
      )?.[1] ||
      '';

    return [
      {
        label: 'paybill.main.otp.summary_fields.service',
        value:
          this.provider()?.serviceName ||
          this.provider()?.name ||
          'paybill.main.otp.summary_fields.unknown_service',
        canTranslate: !this.provider()?.name && !this.provider()?.serviceName,
      },
      {
        label: 'paybill.main.otp.summary_fields.account',
        value: userIdentifier,
        canTranslate: false,
      },
      {
        label: 'paybill.main.otp.summary_fields.amount',
        value: `${payload?.amount ?? 0}`,
        isTotal: true,
        canTranslate: false,
      },
    ];
  });

  public onOtpComplete(code: string): void {
    this.currentCode.set(code);
  }

  public onCancel(): void {
    this.cancelPayment.emit();
  }

  public onResend(): void {
    this.resendCode.emit();
  }

  public onVerify(otp: string): void {
    this.verify.emit(otp);
  }
}
