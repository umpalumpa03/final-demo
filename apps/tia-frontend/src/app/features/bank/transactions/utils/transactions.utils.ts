import { TableConfig } from '@tia/shared/lib/tables/models/table.model';
import { TransactionInterface } from '../models/transactions.models';

export interface PrintedData {
  type: 'text' | 'money' | 'status';
  value: string;
  align: 'left' | 'right' | 'center';
  category?: string;
  accountName?: string;
  date?: string;
  currency?: string;
}

export interface TransactionRow {
  id: string;
  transactionType: 'credit' | 'debit';
  info: PrintedData[];
}

export const TRANSACTION_TABLE_HEADERS = [
  { title: 'Details', align: 'left' as const, width: '47%' },
  { title: 'Amount', align: 'right' as const, width: '25%' },
  { title: 'Actions', align: 'right' as const, width: '28%' },
];

export function mapTransactionToRow(txn: TransactionInterface): TransactionRow {
  const accountDisplay =
    txn.transactionType === 'debit'
      ? txn.debitAccountNumber
      : txn.creditAccountNumber || 'External Account';

  const categoryName =
    typeof txn.category === 'string'
      ? txn.category
      : txn.category?.categoryName || 'Uncategorized';

  return {
    id: txn.id,
    transactionType:
      txn.transactionType === 'debit' || txn.transactionType === 'credit'
        ? txn.transactionType
        : 'credit',

    info: [
      {
        type: 'text',
        value: txn.description,
        category: categoryName,
        accountName: accountDisplay,
        date: txn.createdAt,
        align: 'left',
      },
      {
        type: 'money',
        value: txn.amount.toString(),
        currency: txn.currency,
        align: 'right',
      },
    ],
  };
}

export function buildTransactionTableConfig(
  transactions: TransactionInterface[],
  limit: number = 20,
): TableConfig {
  return {
    type: 'transactions',
    itemsPerPage: limit,
    headers: TRANSACTION_TABLE_HEADERS,
    rows: transactions.map(mapTransactionToRow) as any[],
  };
}
