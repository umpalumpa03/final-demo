import { createReducer, on } from '@ngrx/store';

import { TransactionActions } from './transactions.actions';
import {
  TransactionFilter,
  TransactionInterface,
} from '../../features/bank/transactions/models/transactions.models';

export const TRANSACTION_FEATURE_KEY = 'transactions';

export interface TransactionState {
  items: TransactionInterface[];
  nextCursor: string | null;
  filters: TransactionFilter;
  isLoading: boolean;
  error: unknown;
}

export const initialState: TransactionState = {
  items: [],
  nextCursor: null,
  filters: {
    pageLimit: 20,
  },
  isLoading: false,
  error: null,
};

export const transactionReducer = createReducer(
  initialState,

  on(TransactionActions.updateFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
    items: [],
    nextCursor: null,
    isLoading: true,
  })),
  on(TransactionActions.loadTransactions, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(TransactionActions.loadSuccess, (state, { response }) => ({
    ...state,
    isLoading: false,
    items: [...state.items, ...response.items],
    nextCursor: response.pageInfo.nextCursor || null,
  })),

  on(TransactionActions.loadFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
);
