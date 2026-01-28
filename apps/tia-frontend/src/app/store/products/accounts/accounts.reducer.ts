import { createFeature, createReducer, on } from '@ngrx/store';
import { initialAccountsState } from './accounts.state';
import { AccountsActions } from './accounts.actions';

export const accountsFeature = createFeature({
  name: 'accounts',
  reducer: createReducer(
    initialAccountsState,
    on(AccountsActions.loadAccounts, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(AccountsActions.loadAccountsSuccess, (state, { accounts }) => ({
      ...state,
      accounts,
      isLoading: false,
      error: null,
    })),
    on(AccountsActions.loadAccountsFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),
    on(AccountsActions.selectAccount, (state, { accountId }) => ({
      ...state,
      selectedAccountId: accountId,
    })),
  ),
});

export const {
  name: accountsFeatureKey,
  reducer: accountsReducer,
  selectAccountsState,
  selectAccounts,
  selectSelectedAccountId,
  selectIsLoading,
  selectError,
  selectIsCreateModalOpen,
} = accountsFeature;
