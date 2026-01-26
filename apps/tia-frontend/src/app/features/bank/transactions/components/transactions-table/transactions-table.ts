import { Component, input } from '@angular/core';
import { Tables } from '@tia/shared/lib/tables/components/tables';
import { TableConfig } from '@tia/shared/lib/tables/models/table.model';
import { ScrollArea } from "@tia/shared/lib/layout/components/scroll-area/container/scroll-area";

@Component({
  selector: 'app-transactions-table',
  imports: [Tables, ScrollArea],
  templateUrl: './transactions-table.html',
  styleUrl: './transactions-table.scss',
})
export class TransactionsTable {
  public transactionsData = input.required<TableConfig>();
}
