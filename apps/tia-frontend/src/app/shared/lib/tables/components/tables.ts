import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { TableConfig, TableRowCell } from '../models/table.model';
import { Badges } from '../../primitives/badges/badges';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tables',
  imports: [Badges, DatePipe],
  templateUrl: './tables.html',
  styleUrl: './tables.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tables {
  public readonly tableConfig = input.required<TableConfig>();

  public readonly isSelectable = computed(
    () => this.tableConfig().type === 'row-selection',
  );

  public allSelected = signal<boolean>(false);
  public readonly selectedItems = signal<TableRowCell[]>([]);

  public toggleSelectAll(): void {
    this.allSelected.update((val) => !val);

    this.allSelected()
      ? this.selectedItems.set(this.tableConfig().rows)
      : this.selectedItems.set([]);
  }

  public onIndividualSelect(row: TableRowCell): void {
    this.selectedItems.update((val) => [...val, row]);
  }
}
