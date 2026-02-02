import { ITransactionsCategory } from '@tia/shared/models/transactions/transactions-category.models';
import {
  ITransactions,
  ITransactionFilter,
} from '../../../shared/models/transactions/transactions.models';

export interface TransactionState {
  items: ITransactions[];
  nextCursor: string | null;
  filters: ITransactionFilter;
  total: number;
  isLoading: boolean;
  error: unknown;
  categories: ITransactionsCategory[];
}
