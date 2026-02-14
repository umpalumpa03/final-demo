import { createFeature, createReducer, on } from '@ngrx/store';
import { initialAccountsState } from './model/accounts-state.model';
import { AccountsActions } from './accounts.actions';
import { UserInfoActions } from '../../user-info/user-info.actions';

export const accountsFeature = createFeature({
  name: 'accounts',
  reducer: createReducer(
    initialAccountsState,
    on(AccountsActions.loadAccounts, (state) => ({
      ...state,
      isLoading: state.accounts.length === 0, //addedchheck load only if data comes rom api and not from cashe
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
    on(AccountsActions.loadActiveAccounts, (state) => ({
      ...state,
      isLoading: state.accounts.length === 0, //addedchheck load only if data comes rom api and not from cache
      error: null,
    })),
    on(AccountsActions.loadActiveAccountsSuccess, (state, { accounts }) => ({
      ...state,
      accounts,
      isLoading: false,
      error: null,
    })),
    on(AccountsActions.loadActiveAccountsFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    on(AccountsActions.fetchMoreAccounts, (state) => ({
      ...state,
      isFetching: true,
    })),
    on(AccountsActions.fetchMoreAccountsSuccess, (state, { accounts }) => ({
      ...state,
      accounts: [...state.accounts, ...accounts],
      isFetching: false,
    })),
    on(AccountsActions.fetchMoreAccountsFailure, (state, { error }) => ({
      ...state,
      isFetching: false,
      error,
    })),
    on(AccountsActions.selectAccount, (state, { account }) => ({
      ...state,
      selectedAccountId: account,
    })),
    on(AccountsActions.createAccount, (state) => ({
      ...state,
      isCreating: true,
      createError: null,
    })),
    on(AccountsActions.createAccountSuccess, (state, { account }) => ({
      ...state,
      accounts: [...state.accounts, account],
      isCreating: false,
      createError: null,
      isCreateModalOpen: false,
    })),
    on(AccountsActions.createAccountFailure, (state, { error }) => ({
      ...state,
      isCreating: false,
      createError: error,
    })),
    on(AccountsActions.openCreateModal, (state) => ({
      ...state,
      isCreateModalOpen: true,
    })),
    on(AccountsActions.closeCreateModal, (state) => ({
      ...state,
      isCreateModalOpen: false,
    })),
    on(
      AccountsActions.updateFriendlyName,
      (state, { accountId, friendlyName }) => ({
        ...state,
        accounts: state.accounts.map((acc) =>
          acc.id === accountId ? { ...acc, friendlyName } : acc,
        ),
        isUpdatingFriendlyName: true,
        updateFriendlyNameError: null,
      }),
    ),
    on(AccountsActions.updateFriendlyNameSuccess, (state, { account }) => {
      return {
        ...state,
        accounts: account?.id
          ? state.accounts.map((acc) => (acc.id === account.id ? account : acc))
          : state.accounts,
        isUpdatingFriendlyName: false,
        updateFriendlyNameError: null,
      };
    }),
    on(AccountsActions.updateFriendlyNameFailure, (state, { error }) => ({
      ...state,
      isUpdatingFriendlyName: false,
      updateFriendlyNameError: error,
    })),
    on(UserInfoActions.loadUser, () => initialAccountsState),
  ),
});

export const {
  name: accountsFeatureKey,
  reducer: accountsReducer,
  selectAccountsState,
  selectAccounts,
  selectSelectedAccountId,
  selectIsLoading,
  selectIsFetching,
  selectError,
  selectIsCreating,
  selectCreateError,
  selectIsCreateModalOpen,
  selectIsUpdatingFriendlyName,
  selectUpdateFriendlyNameError,
} = accountsFeature;
