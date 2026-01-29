import {
  ITransactions,
  TransactionFilter,
} from '../../../shared/models/transactions/transactions.models';

export interface TransactionState {
  items: ITransactions[];
  nextCursor: string | null;
  filters: TransactionFilter;
  total: number;
  isLoading: boolean;
  error: unknown;
}
