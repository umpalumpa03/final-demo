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

@Component({
  selector: 'app-tables',
  imports: [
    Badges,
    Checkboxes,
    DatePipe,
    Pagination,
    SlicePipe,
    CurrencyPipe,
    ButtonComponent,
  ],
  templateUrl: './tables.html',
  styleUrl: './tables.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tables {
  // Given Inputs to draw table or change state
  public readonly tableConfig = input.required<TableConfig>();
  public readonly crudConfig = crudConfig;
  public currentPage = signal<number>(1);
  public readonly totalPage = computed(() =>
    Math.ceil(this.tableConfig().rows.length / this.tableConfig().itemPerPage),
  );

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

  // Needed for Page navigation
  public readonly startIndex = computed(
    () => (this.currentPage() - 1) * this.tableConfig().itemPerPage,
  );

  public readonly endIndex = computed(
    () => this.startIndex() + this.tableConfig().itemPerPage,
  );
  // /////////////////

  public allSelected = signal<boolean>(false);
  public readonly selectedItems = signal<TableRowCell[]>([]);

  // Output
  public actionClickedOutput = output<TableActionEvent>();
  public sortClickedOutput = output<string>();
  public transactionClickedOutput = output<TransactionActionEvent>();

  // Methods
  public toggleSelectAll(): void {
    this.allSelected.update((val) => !val);

    this.allSelected()
      ? this.selectedItems.set(this.tableConfig().rows)
      : this.selectedItems.set([]);
  }

  public onIndividualSelect(row: TableRowCell): void {
    this.selectedItems.update((val) => [...val, row]);
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
  }

  public onTransactionActionClicked(
    action: TransactionAction,
    row: TableRowCell,
  ) {
    this.transactionClickedOutput.emit({
      action,
      rowId: row.id,
      rowData: row.info,
    });
  }
}
