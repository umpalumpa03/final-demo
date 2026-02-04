import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-transaction-card-header',
  templateUrl: './transaction-card-header.html',
  styleUrls: ['./transaction-card-header.scss'],
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionCardHeader {
  readonly imageBase64 = input.required<string>();
  readonly cardName = input.required<string>();
  readonly maskedNumber = input.required<string>();
  readonly linkedAccountName = input.required<string>();
  readonly totalTransactions = input.required<number>();
}