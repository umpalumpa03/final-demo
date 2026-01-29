import { createReducer, on } from '@ngrx/store';
import { TransactionActions } from './transactions.actions';
import { transactionInitialState } from './config/transaction-state-config';

export const TRANSACTION_FEATURE_KEY = 'transactions';

export const transactionReducer = createReducer(
  transactionInitialState,

  on(TransactionActions.enter, (state) => ({
    ...state,
    items: [],
    nextCursor: null,
    total: 0,
    isLoading: true,
  })),

  on(TransactionActions.loadMore, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

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

  on(TransactionActions.loadTotalSuccess, (state, { total }) => ({
    ...state,
    total,
  })),
);
