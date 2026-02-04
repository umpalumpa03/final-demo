import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ITransactions } from '@tia/shared/models/transactions/transactions.models';
import { TransactionItem } from '../transaction-item/transaction-item';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.html',
  styleUrls: ['./transaction-list.scss'],
  imports: [TransactionItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionList {
  readonly transactions = input.required<ITransactions[]>();

  protected formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

protected formatAmount(amount: number | string, currency: string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `-${currency} ${numAmount.toFixed(2)}`;
}
protected getCategoryName(category: string | { categoryName: string } | null): string {
  if (!category) return 'Uncategorized';
  return typeof category === 'string' ? category : category.categoryName;
}
}