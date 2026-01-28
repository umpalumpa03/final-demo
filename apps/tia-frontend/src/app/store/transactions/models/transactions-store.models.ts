import {
  ITransactions,
  TransactionFilter,
} from '../../../features/bank/transactions/models/transactions.models';

export interface TransactionState {
  items: ITransactions[];
  nextCursor: string | null;
  filters: TransactionFilter;
  isLoading: boolean;
  error: unknown;
}
