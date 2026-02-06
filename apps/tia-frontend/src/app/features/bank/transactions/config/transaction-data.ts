import { TableConfig } from '@tia/shared/lib/tables/models/table.model';

export const TRANSACTIONS_BASE_CONFIG: TableConfig = {
  type: 'transactions',
  paginationType: 'scroll',
  itemsPerPage: 20,
  headers: [
    {
      title: 'transactions.table.headers.details',
      align: 'left',
      width: '47%',
    },
    {
      title: 'transactions.table.headers.amount',
      align: 'right',
      width: '25%',
    },
    {
      title: 'transactions.table.headers.actions',
      align: 'right',
      width: '28%',
    },
  ],
  rows: [],
} as const;
