import { createReducer, on } from '@ngrx/store';
import { TransactionActions } from './transactions.actions';
import { transactionInitialState } from './config/transaction-state-config';

export const TRANSACTION_FEATURE_KEY = 'transactions';

export const transactionReducer = createReducer(
  transactionInitialState,

  on(TransactionActions.enter, (state) => ({
    ...state,
    error: null,
  })),
  on(TransactionActions.loadTransactionsSuccess, (state, { response }) => ({
    ...state,
    items: response.items,
    isLoading: false,
    loaded: true,
    nextCursor: response.pageInfo.nextCursor || null,
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
    loaded: false,
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

  on(TransactionActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories: categories,
  })),
  on(TransactionActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(
    TransactionActions.assignCategorySuccess,
    (state, { transactionId, categoryId }) => {
      const newCategory = state.categories.find((c) => c.id === categoryId);

      const updateItems = state.items.map((item) => {
        if (item.id === transactionId) {
          return {
            ...item,
            categoryId: categoryId,
            category: newCategory ? newCategory : item.category,
          };
        }
        return item;
      });
      return {
        ...state,
        items: updateItems,
      };
    },
  ),
);
