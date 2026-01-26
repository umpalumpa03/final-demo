import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import {
  TableActionEvent,
  TableConfig,
  TableRowCell,
  TransactionAction,
  TransactionActionEvent,
} from '../models/table.model';
import { Badges } from '../../primitives/badges/badges';
import { CurrencyPipe, DatePipe, SlicePipe } from '@angular/common';
import { crudConfig } from '../models/table.crud.config';
import { Checkboxes } from '../../forms/checkboxes/checkboxes';
import { Pagination } from '../../navigation/pagination/pagination';
import { ButtonComponent } from '../../primitives/button/button';
import { Spinner } from '../../feedback/spinner/spinner';

@Component({
  selector: 'app-tables',
  imports: [
    Badges,
    Checkboxes,
    DatePipe,
    Pagination,
    CurrencyPipe,
    ButtonComponent,
    Spinner,
  ],
  templateUrl: './tables.html',
  styleUrl: './tables.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tables {
  // Given Inputs to draw table or change state
  public readonly tableConfig = input.required<TableConfig>();
  public isLoading = input<boolean>(false);
  public hasError = input<boolean>(false);

  public readonly crudConfig = crudConfig;
  public currentPage = signal<number>(1);
  public readonly totalPage = computed(() => this.tableConfig().totalPage ?? 2);

  // Here I check for different kind of tables
  public readonly isSelectable = computed(
    () => this.tableConfig().type === 'row-selection',
  );
  public readonly isAction = computed(
    () => this.tableConfig().type === 'actions',
  );
  public readonly isSelectAndAction = computed(
    () => this.tableConfig().type === 'select-actions',
  );

  public readonly isStriped = computed(
    () => this.tableConfig().type === 'striped',
  );

  public readonly isCompact = computed(
    () => this.tableConfig().type === 'compact',
  );

  public readonly isPagination = computed(
    () => this.tableConfig().paginationType === 'page',
  );

  // /////////////////////

  // public allSelected = signal<boolean>(false);
  public readonly allSelected = computed(() => {
    const rows = this.tableConfig().rows;
    const selected = this.selectedItems();
    return (
      rows.length > 0 &&
      rows.every((row) => selected.some((s) => s.id === row.id))
    );
  });
  public readonly selectedItems = signal<TableRowCell[]>([]);

  public isRowSelected(row: TableRowCell): boolean {
    return this.selectedItems().some((item) => item.id === row.id);
  }

  // Output
  public actionClickedOutput = output<TableActionEvent>();
  public sortClickedOutput = output<string>();
  public transactionClickedOutput = output<TransactionActionEvent>();
  public pageChangeOutput = output<number>();

  // Methods

  public toggleSelectAll(): void {
    if (this.allSelected()) {
      this.selectedItems.set([]);
    } else {
      this.selectedItems.set([...this.tableConfig().rows]);
    }
  }

  public onIndividualSelect(row: TableRowCell): void {
    this.selectedItems.update((items) => {
      const exists = items.some((item) => item.id === row.id);
      if (exists) {
        return items.filter((item) => item.id !== row.id);
      } else {
        return [...items, row];
      }
    });
  }

  public onCrudClick(action: string, rowId: string): void {
    this.actionClickedOutput.emit({
      action,
      rowId,
      selectedItems: this.selectedItems(),
    });
  }

  public onSortClick(title: string): void {
    this.sortClickedOutput.emit(title);
  }

  public onPageChange(page: number): void {
    this.currentPage.set(page);
    this.pageChangeOutput.emit(page);
  }

  public onTransactionActionClicked(
    action: TransactionAction,
    row: TableRowCell,
  ): void {
    this.transactionClickedOutput.emit({
      action,
      rowId: row.id,
      rowData: row.info,
    });
  }
}
