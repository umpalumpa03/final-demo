import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../../../models/filter.model';

@Component({
  selector: 'app-finances-transactions',
  imports: [CommonModule],
  templateUrl: './finances-transactions.html',
  styleUrl: './finances-transactions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancesTransactions {
  public readonly transactions = input<Transaction[]>([]);
}