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
} from '../models/table.model';
import { Badges } from '../../primitives/badges/badges';
import { DatePipe } from '@angular/common';
import { crudConfig } from '../models/table.crud.config';
import { Checkboxes } from '../../forms/checkboxes/checkboxes';

@Component({
  selector: 'app-tables',
  imports: [Badges, Checkboxes, DatePipe],
  templateUrl: './tables.html',
  styleUrl: './tables.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tables {
  public readonly tableConfig = input.required<TableConfig>();
  public readonly crudConfig = crudConfig;
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

  public allSelected = signal<boolean>(false);
  public readonly selectedItems = signal<TableRowCell[]>([]);

  // Output
  public actionClickedOutput = output<TableActionEvent>();
  public sortClickedOutput = output<string>();

  public toggleSelectAll(): void {
    this.allSelected.update((val) => !val);

    this.allSelected()
      ? this.selectedItems.set(this.tableConfig().rows)
      : this.selectedItems.set([]);
  }

  public onIndividualSelect(row: TableRowCell): void {
    this.selectedItems.update((val) => [...val, row]);
  }

  public onCrudClick(action: string, rowId: string) {
    this.actionClickedOutput.emit({
      action,
      rowId,
      selectedItems: this.selectedItems(),
    });
  }

  public onSortClick(title: string) {
    this.sortClickedOutput.emit(title);
  }
}
