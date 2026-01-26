import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LibraryTitle } from '../../../shared/library-title/library-title';
import { Tables } from '@tia/shared/lib/tables/components/tables';
import { TableConfig } from '@tia/shared/lib/tables/models/table.model';
import { ShowcaseCard } from '../../../shared/showcase-card/showcase-card';
import {
  actionsTable,
  basicTable,
  compactTable,
  rowsForPagination,
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
  public basicConfig = signal<TableConfig>({ ...basicTable });
  public rowConfig = signal<TableConfig>({ ...rowTable });
  public actionsConfig = signal<TableConfig>({ ...actionsTable });
  public sortableConfig = signal<TableConfig>({ ...sortableTable });
  public strippedConfig = signal<TableConfig>({ ...strippedTable });
  public compactConfig = signal<TableConfig>({ ...compactTable });
  public rowStatesConfig = signal<TableConfig>({ ...rowStates });
  public transactionsConfig = signal<TableConfig>({ ...transactionsTable });

  private readonly rowsPaginationData: TableConfig['rows'] = rowsForPagination;
  private readonly rowsInitialPageData: TableConfig['rows'] = basicTable.rows;

  public isLoading = signal<boolean>(false);
  public hasError = signal<boolean>(false);

  public onPageChange(page: number): void {
    this.loadNextData(page);
  }

  public errorReload(page: number): void {
    this.hasError.set(false);
    this.loadNextData(page);
  }

  private loadNextData(page: number): void {
    this.isLoading.set(true);

    setTimeout(() => {
      const shouldError = Math.random() < 0.5;

      if (shouldError) {
        this.hasError.set(true);
        this.isLoading.set(false);
        return;
      }

      const rows =
        page === 1 ? this.rowsInitialPageData : this.rowsPaginationData;

      this.basicConfig.update((config) => ({
        ...config,
        rows,
      }));

      this.isLoading.set(false);
    }, 500);
  }
}
