import { createFeature, createReducer, on } from '@ngrx/store';
import { initialAccountsState } from './products.state';
import { ProductsActions } from './products.actions';

export const productsFeature = createFeature({
  name: 'products',
  reducer: createReducer(
    initialAccountsState,
    on(ProductsActions.loadAccounts, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(ProductsActions.loadAccountsSuccess, (state, { accounts }) => ({
      ...state,
      accounts,
      isLoading: false,
      error: null,
    })),
    on(ProductsActions.loadAccountsFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),
    on(ProductsActions.selectAccount, (state, { accountId }) => ({
      ...state,
      selectedAccountId: accountId,
    })),
  ),
});

export const {
  name: productsFeatureKey,
  reducer: productsReducer,
  selectProductsState,
  selectAccounts,
  selectSelectedAccountId,
  selectIsLoading,
  selectError,
  selectIsCreateModalOpen,
} = productsFeature;

export const selectProducts = selectAccounts;
