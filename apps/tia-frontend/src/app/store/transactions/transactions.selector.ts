import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TRANSACTION_FEATURE_KEY } from './transactions.reducer';
import { TransactionState } from './models/transactions-store.models';

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

export const selectTotalTransactions = createSelector(
  selectTransactionState,
  (state) => state.total,
);

export const selectCategoriesRaw = createSelector(
  selectTransactionState,
  (state) => state.categories || [],
);

export const selectCategoryOptions = createSelector(
  selectCategoriesRaw,
  (categories) => {
    return categories.map((cat) => ({
      label: cat.categoryName,
      value: cat.categoryName,
    }));
  },
);

export const selectTransactionViewModel = createSelector(
  selectItems,
  selectIsLoading,
  selectFilters,
  selectTotalTransactions,
  selectCategoryOptions,
  (items, isLoading, filters, total, categoryOptions) => ({
    items,
    isLoading,
    filters,
    total,
    categoryOptions,
  }),
);
