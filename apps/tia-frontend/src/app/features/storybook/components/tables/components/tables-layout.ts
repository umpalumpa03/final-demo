import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LibraryTitle } from '../../../shared/library-title/library-title';
import { Tables } from '@tia/shared/lib/tables/components/tables';
import { TableConfig } from '@tia/shared/lib/tables/models/table.model';
import { ShowcaseCard } from '../../../shared/showcase-card/showcase-card';
import {
  actionsTable,
  basicTable,
  compactTable,
  rowStates,
  rowTable,
  sortableTable,
  strippedTable,
  transactionsTable,
} from '../config/tables.config';

@Component({
  selector: 'app-tables-layout',
  imports: [LibraryTitle, Tables, ShowcaseCard],
  templateUrl: './tables-layout.html',
  styleUrl: './tables-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesLayout {
  public basicConfig: TableConfig = basicTable;
  public rowConfig: TableConfig = rowTable;
  public actionsConfig: TableConfig = actionsTable;
  public sortableConfig: TableConfig = sortableTable;
  public strippedConfig: TableConfig = strippedTable;
  public compactConfig: TableConfig = compactTable;
  public rowStatesConfig: TableConfig = rowStates;
  public transactionsConfig: TableConfig = transactionsTable;
}
