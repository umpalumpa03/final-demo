import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LibraryTitle } from '../../../shared/library-title/library-title';
import { Tables } from '@tia/shared/lib/tables/components/tables';
import {
  TableConfig,
  TableRowCell,
} from '@tia/shared/lib/tables/models/table.model';
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
import { delay, map, of, switchMap, throwError, timer } from 'rxjs';

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
  // public transactionsConfig: TableConfig = transactionsTable;

  onPageChange($event: number) {
    this.loadTransactions($event);
  }

  private ALL_TRANSACTIONS: TableRowCell[] = [
    {
      id: '1',
      transactionType: 'credit',
      info: [
        {
          type: 'text',
          value: 'Salary Payment',
          category: 'Salary',
          accountName: 'Main Account',
          date: '2026-01-14T00:00:00Z',
          align: 'left',
        },
        { type: 'money', value: '5000', align: 'right', currency: 'USD' },
      ],
    },
    {
      id: '2',
      transactionType: 'debit',
      info: [
        {
          type: 'text',
          value: 'Grocery Shopping',
          category: 'Shopping',
          accountName: 'Main Account',
          date: '2026-01-13T00:00:00Z',
          align: 'left',
        },
        { type: 'money', value: '5000', align: 'right', currency: 'EUR' },
      ],
    },
    {
      id: '3',
      transactionType: 'credit',
      info: [
        {
          type: 'text',
          value: 'Electricity Bill',
          category: 'Utilities',
          accountName: 'Main Account',
          date: '2026-01-12T00:00:00Z',
          align: 'left',
        },
        { type: 'money', value: '5000', align: 'right', currency: 'USD' },
      ],
    },
  ];

  transactionsConfig = signal<TableConfig>({
    type: 'transactions',
    paginationType: 'page',
    itemsPerPage: 1,
    totalPage: 3,
    headers: [
      { title: 'Details', align: 'left', width: '47%' },
      { title: 'Amount', align: 'right', width: '25%' },
      { title: 'Actions', align: 'right', width: '28%' },
    ],
    rows: [],
  });

  ngOnInit() {
    this.loadTransactions(1);
  }

  private fakeApi(page: number) {
    const errorChance = 0.5; // 30% chance of error

    if (Math.random() < errorChance) {
      return timer(500).pipe(
        switchMap(() => throwError(() => new Error('Server is tired 😴'))),
      );
    }

    return of(this.ALL_TRANSACTIONS).pipe(
      delay(1000),
      map((data) => {
        const start = (page - 1) * this.transactionsConfig().itemsPerPage;
        const end = start + this.transactionsConfig().itemsPerPage;
        console.log(start, end);
        console.log(data.slice(start, end));
        return data.slice(start, end);
      }),
    );
  }

  loadTransactions(page: number) {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.fakeApi(page).subscribe({
      next: (rows) => {
        this.transactionsConfig.update((config) => ({
          ...config,
          rows,
        }));
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  isLoading = signal<boolean>(false);
  hasError = signal<boolean>(false);
}
