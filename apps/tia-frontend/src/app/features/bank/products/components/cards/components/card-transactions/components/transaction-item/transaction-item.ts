import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.html',
  styleUrls: ['./transaction-item.scss'],
  imports: [Badges, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionItem {
  public readonly description = input.required<string>();
  public readonly date = input.required<string>();
  public readonly category = input.required<string>();
  public readonly referenceNumber = input.required<string>();
  public readonly amount = input.required<string>();
  public readonly status = input.required<string>();
  public readonly transactionType = input.required<string>(); 
    

      protected readonly iconPath = computed(() => {
    return this.transactionType() === 'credit' 
      ? '/images/svg/transactions/income.svg'  
      : '/images/svg/transactions/expense.svg';       
  });
    protected readonly iconClass = computed(() => {
    return this.transactionType() === 'credit'
      ? 'transaction-item__icon--income'
      : 'transaction-item__icon--outcome';
  });
}