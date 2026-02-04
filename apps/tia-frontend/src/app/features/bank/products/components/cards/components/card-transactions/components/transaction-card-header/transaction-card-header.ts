import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-transaction-card-header',
  templateUrl: './transaction-card-header.html',
  styleUrls: ['./transaction-card-header.scss'],
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionCardHeader {
  public readonly imageBase64 = input.required<string>();
  public readonly cardName = input.required<string>();
  public readonly maskedNumber = input.required<string>();
  public readonly linkedAccountName = input.required<string>();
  public readonly totalTransactions = input.required<number>();
}