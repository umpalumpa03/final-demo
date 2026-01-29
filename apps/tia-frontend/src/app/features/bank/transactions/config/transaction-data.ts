import { TableConfig } from '@tia/shared/lib/tables/models/table.model';

export const TRANSACTIONS_BASE_CONFIG: TableConfig = {
  type: 'transactions',
  paginationType: 'scroll',
  itemsPerPage: 20,
  headers: [
    { title: 'Details', align: 'left', width: '47%' },
    { title: 'Amount', align: 'right', width: '25%' },
    { title: 'Actions', align: 'right', width: '28%' },
  ],
  rows: [],
} as const;
