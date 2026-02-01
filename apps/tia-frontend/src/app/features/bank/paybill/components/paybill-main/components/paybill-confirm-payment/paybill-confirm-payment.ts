import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  BillDetails,
  PaybillPayload,
  PaybillProvider,
} from '../../shared/models/paybill.model';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { LibraryTitle } from 'apps/tia-frontend/src/app/features/storybook/shared/library-title/library-title';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { PaymentSummary } from '../../shared/ui/payment-summary/payment-summary';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { Store } from '@ngrx/store';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { CurrencyPipe } from '@angular/common';
import { paymentOptionPaybill } from './config/input.config';

@Component({
  selector: 'app-paybill-confirm-payment',
  imports: [
    BasicCard,
    LibraryTitle,
    ButtonComponent,
    PaymentSummary,
    Dropdowns,
    CurrencyPipe,
  ],
  templateUrl: './paybill-confirm-payment.html',
  styleUrl: './paybill-confirm-payment.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class PaybillConfirmPayment {
  public readonly provider = input.required<PaybillProvider>();
  public readonly summary = input.required<PaybillPayload>();
  public readonly details = input.required<BillDetails>();
  public readonly iconBgColor = input('');
  public readonly iconBgPath = input('');

  public readonly confirm = output<void>();
  public readonly cancelPayment = output<void>();

  public readonly accountChanged = output<string>();
  public readonly selectedAccountId = model<string | null>(null);
  public readonly currentAccounts = input<
    { label: string; value: string }[] | null
  >(null);

  protected readonly selectConfig = paymentOptionPaybill;

  public handleAccountChange(id: string): void {
    this.accountChanged.emit(id);
  }

  protected readonly summaryItems = computed(() => [
    {
      label: 'Account Number:',
      value: this.summary().accountNumber ?? 'Unknown Service',
    },
    { label: 'Customer Name:', value: this.details().accountHolder },
    { label: 'Due Date:', value: this.details().dueDate },
    {
      label: 'Amount to Pay:',
      value: `GEL${this.summary()!.amount}`,
      isTotal: true,
    },
  ]);

  protected readonly title = 'Confirm Payment';
  protected readonly subtitle = 'Review the details before proceeding';
}
