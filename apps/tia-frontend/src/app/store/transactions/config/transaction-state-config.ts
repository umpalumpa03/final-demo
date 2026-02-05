import { TransactionState } from '../models/transactions-store.models';

export const transactionInitialState: TransactionState = {
  items: [],
  nextCursor: null,
  filters: {
    pageLimit: 20,
  },
  total: 0,
  isLoading: false,
  loaded:false,
  error: null,
  categories: [],
} as const;
