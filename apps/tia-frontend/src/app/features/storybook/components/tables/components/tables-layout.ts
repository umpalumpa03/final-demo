import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
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
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tables-layout',
  imports: [LibraryTitle, Tables, ShowcaseCard, TranslatePipe],
  templateUrl: './tables-layout.html',
  styleUrl: './tables-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesLayout {
  private readonly translate = inject(TranslateService);
  public basicConfig = signal<TableConfig>(basicTable(this.translate));
  public rowConfig = signal<TableConfig>(rowTable(this.translate));
  public actionsConfig = signal<TableConfig>(actionsTable(this.translate));
  public sortableConfig = signal<TableConfig>(sortableTable(this.translate));
  public strippedConfig = signal<TableConfig>(strippedTable(this.translate));
  public compactConfig = signal<TableConfig>(compactTable(this.translate));
  public rowStatesConfig = signal<TableConfig>(rowStates(this.translate));
  public transactionsConfig = signal<TableConfig>(
    transactionsTable(this.translate),
  );

  private readonly rowsPaginationData: TableConfig['rows'] = rowsForPagination(
    this.translate,
  );
  private readonly rowsInitialPageData: TableConfig['rows'] = basicTable(
    this.translate,
  ).rows;

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
