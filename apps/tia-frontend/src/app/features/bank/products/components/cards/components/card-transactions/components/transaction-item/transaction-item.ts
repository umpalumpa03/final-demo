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
  readonly description = input.required<string>();
  readonly date = input.required<string>();
  readonly category = input.required<string>();
  readonly referenceNumber = input.required<string>();
  readonly amount = input.required<string>();
  readonly status = input.required<string>();
}