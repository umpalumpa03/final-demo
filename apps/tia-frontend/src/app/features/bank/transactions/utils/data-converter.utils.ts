import {
  PrintedData,
  TableRowCell,
} from '@tia/shared/lib/tables/models/table.model';
import { ITransactions  } from '../models/transactions.models';

export function convertTransactionData(
  transaction: ITransactions ,
): TableRowCell {
  const accDisplay =
    transaction.transactionType === 'debit'
      ? transaction.debitAccountNumber
      : transaction.creditAccountNumber || 'External';

  const categoryName =
    typeof transaction.category === 'string'
      ? transaction.category
      : transaction.category?.categoryName || 'Uncategorized';
  const infoData: PrintedData[] = [
    {
      type: 'text',
      value: transaction.description,
      category: categoryName,
      accountName: (accDisplay as string) || '',
      date: transaction.createdAt,
      align: 'left',
    },
    {
      type: 'money',
      value: transaction.amount.toString(),
      currency: transaction.currency,
      align: 'right',
    },
  ];

  return {
    id: transaction.id,
    transactionType: (['credit', 'debit'].includes(transaction.transactionType)
      ? transaction.transactionType
      : 'credit') as 'credit' | 'debit',
    info: infoData, 
  };
}
