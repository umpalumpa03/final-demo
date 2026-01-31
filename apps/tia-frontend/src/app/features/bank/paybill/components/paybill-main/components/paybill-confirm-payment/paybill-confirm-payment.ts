import { Component, computed, input, output } from '@angular/core';
import {
  BillDetails,
  PaybillPayload,
  PaybillProvider,
} from '../../shared/models/paybill.model';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { PaymentSummary } from '../../shared/ui/payment-summary/payment-summary';

@Component({
  selector: 'app-paybill-confirm-payment',
  imports: [BasicCard, LibraryTitle, ButtonComponent, PaymentSummary],
  templateUrl: './paybill-confirm-payment.html',
  styleUrl: './paybill-confirm-payment.scss',
})
export class PaybillConfirmPayment {
  public readonly provider = input.required<PaybillProvider>();
  public readonly summary = input.required<PaybillPayload>();
  public readonly details = input.required<BillDetails>();
  public readonly iconBgColor = input('');
  public readonly iconBgPath = input('');

  public readonly confirm = output<void>();
  public readonly cancelPayment = output<void>();

  protected readonly summaryItems = computed(() => [
    {
      label: 'Account Number:',
      value: this.summary().accountNumber ?? 'Unknown Service',
    },
    { label: 'Customer Name:', value: this.details().accountHolder },
    { label: 'Due Date:', value: this.details().dueDate },
    {
      label: 'Amount to Pay:',
      value: `$${this.summary()!.amount}`,
      isTotal: true,
    },
  ]);

  protected readonly title = 'Confirm Payment';
  protected readonly subtitle = 'Review the details before proceeding';
}
