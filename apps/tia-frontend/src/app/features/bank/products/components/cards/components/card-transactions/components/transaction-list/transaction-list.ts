import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ITransactions } from '@tia/shared/models/transactions/transactions.models';
import { TransactionItem } from '../transaction-item/transaction-item';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { inject } from 'vitest';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.html',
  styleUrls: ['./transaction-list.scss'],
  imports: [TransactionItem, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionList {
  readonly transactions = input.required<ITransactions[]>();
  readonly uncategorizedText = input.required<string>();
  readonly locale = input.required<string>();
  protected formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(this.locale(), {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  protected formatAmount(
    amount: number | string,
    currency: string,
    transactionType: string,
  ): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    const absoluteAmount = Math.abs(numAmount);
    const sign = transactionType === 'debit' ? '-' : '+';
    return `${sign}${currency} ${absoluteAmount.toFixed(2)}`;
  }
  protected getCategoryName(
    category: string | { categoryName: string } | null,
  ): string {
    if (!category) return this.uncategorizedText();
    return typeof category === 'string' ? category : category.categoryName;
  }
}
