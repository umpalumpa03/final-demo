import {
  Component,
  computed,
  inject,
  input,
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
import { selectCurrentAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import { Account } from '@tia/shared/models/accounts/accounts.model';

@Component({
  selector: 'app-paybill-confirm-payment',
  imports: [
    BasicCard,
    LibraryTitle,
    ButtonComponent,
    PaymentSummary,
    Dropdowns,
  ],
  templateUrl: './paybill-confirm-payment.html',
  styleUrl: './paybill-confirm-payment.scss',
})
export class PaybillConfirmPayment {
  private readonly store = inject(Store);
  public readonly provider = input.required<PaybillProvider>();
  public readonly summary = input.required<PaybillPayload>();
  public readonly details = input.required<BillDetails>();
  public readonly iconBgColor = input('');
  public readonly iconBgPath = input('');

  public readonly confirm = output<void>();
  public readonly cancelPayment = output<void>();

  // public readonly currentAccounts = this.store.selectSignal(
  //   selectCurrentAccounts,
  // );

  public readonly selectedAccountId = signal<string | null>(null);
  public readonly currentAccounts = input<Account[]|null>(null);

  protected readonly accountOptions = computed(() =>
    this.currentAccounts()!.map((acc) => ({
      label: `${acc.friendlyName || acc.name} (****${acc.id.slice(-4)}) - ${acc.balance} ${acc.currency}`,
      value: acc.id,
    })),
  );

  public handleAccountChange(id: string): void {
    this.selectedAccountId.set(id);
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
      value: `$${this.summary()!.amount}`,
      isTotal: true,
    },
  ]);

  protected readonly title = 'Confirm Payment';
  protected readonly subtitle = 'Review the details before proceeding';
}
