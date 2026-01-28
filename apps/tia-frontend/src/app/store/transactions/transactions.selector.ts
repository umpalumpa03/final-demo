import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  TRANSACTION_FEATURE_KEY,
  TransactionState,
} from './transactions.reducer';

export const selectTransactionState = createFeatureSelector<TransactionState>(
  TRANSACTION_FEATURE_KEY,
);

export const selectItems = createSelector(
  selectTransactionState,
  (state) => state.items,
);

export const selectIsLoading = createSelector(
  selectTransactionState,
  (state) => state.isLoading,
);

export const selectFilters = createSelector(
  selectTransactionState,
  (state) => state.filters,
);

export const selectNextCursor = createSelector(
  selectTransactionState,
  (state) => state.nextCursor,
);

export const selectError = createSelector(
  selectTransactionState,
  (state) => state.error,
);

export const selectTransactionViewModel = createSelector(
  selectItems,
  selectIsLoading,
  selectFilters,
  (items, isLoading, filters) => ({ items, isLoading, filters }),
);
