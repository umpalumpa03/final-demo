import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.html',
  styleUrls: ['./transaction-item.scss'],
  imports: [Badges],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionItem {
  public readonly description = input.required<string>();
  public readonly date = input.required<string>();
  public readonly category = input.required<string>();
  public readonly referenceNumber = input.required<string>();
  public readonly amount = input.required<string>();
  public readonly status = input.required<string>();
}