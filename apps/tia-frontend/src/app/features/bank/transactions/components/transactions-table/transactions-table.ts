import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Tables } from '@tia/shared/lib/tables/components/tables';
import { TableConfig } from '@tia/shared/lib/tables/models/table.model';

@Component({
  selector: 'app-transactions-table',
  imports: [Tables],
  templateUrl: './transactions-table.html',
  styleUrl: './transactions-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsTable {
  public transactionsData = input.required<TableConfig>();
}
