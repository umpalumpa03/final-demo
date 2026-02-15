import { describe, it, expect } from 'vitest';
import { Action } from '@ngrx/store';
import { accountsReducer } from './accounts.reducer';
import { initialAccountsState } from './model/accounts-state.model';
import { AccountsActions } from './accounts.actions';
import { UserInfoActions } from '../../user-info/user-info.actions';
import { AccountType } from '../../../shared/models/accounts/accounts.model';

describe('Accounts Reducer', () => {
  const mockAccount = {
    id: '1',
    userId: 'user-1',
    permission: 1,
    friendlyName: 'Test',
    type: AccountType.current,
    balance: 1000,
    currency: 'USD',
    status: 'active',
    createdAt: '2026-01-01',
    iban: 'GE89NB0000000123456789',
    name: 'Test',
    openedAt: '2026-01-01',
    closedAt: '',
    isFavorite: false,
    isHidden: false,
  };

  const mockAccount2 = {
    id: '2',
    userId: 'user-1',
    permission: 1,
    friendlyName: 'Savings',
    type: AccountType.saving,
    balance: 5000,
    currency: 'USD',
    status: 'active',
    createdAt: '2026-01-02',
    iban: 'GE89NB0000000123456790',
    name: 'Savings',
    openedAt: '2026-01-02',
    closedAt: '',
    isFavorite: true,
    isHidden: false,
  };

  it('should return initial state', () => {
    const action: Action = { type: 'UNKNOWN' };
    const state = accountsReducer(undefined, action);
    expect(state).toEqual(initialAccountsState);
  });

  it('should handle loadAccounts and set isLoading when store is empty with empty store', () => {
    const action = AccountsActions.loadAccounts({ forceRefresh: false });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.isLoading).toBe(true);
  });

  it('should handle loadAccounts with existing data and no refresh', () => {
    const stateWithData = { ...initialAccountsState, accounts: [mockAccount] };
    const action = AccountsActions.loadAccounts({ forceRefresh: false });
    const state = accountsReducer(stateWithData, action);
    expect(state.isLoading).toBe(false);
  });

  it('should handle loadAccounts and keep isLoading false when store has cached accounts', () => {
    const stateWithAccounts = {
      ...initialAccountsState,
      accounts: [mockAccount],
    };
    const action = AccountsActions.loadAccounts({});
    const state = accountsReducer(stateWithAccounts, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle loadAccounts and keep isLoading false when store has cached accounts', () => {
    const stateWithAccounts = {
      ...initialAccountsState,
      accounts: [mockAccount],
    };
    const action = AccountsActions.loadAccounts({});
    const state = accountsReducer(stateWithAccounts, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle loadAccountsSuccess', () => {
    const action = AccountsActions.loadAccountsSuccess({
      accounts: [mockAccount],
    });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.accounts).toEqual([mockAccount]);
    expect(state.isLoading).toBe(false);
  });

  it('should handle loadAccountsFailure', () => {
    const action = AccountsActions.loadAccountsFailure({
      error: 'Network error',
    });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.error).toBe('Network error');
  });

  it('should handle loadActiveAccounts and set isLoading when store is empty', () => {
    const action = AccountsActions.loadActiveAccounts({});
    const state = accountsReducer(initialAccountsState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle loadActiveAccounts and keep isLoading false when store has cached accounts', () => {
    const stateWithAccounts = {
      ...initialAccountsState,
      accounts: [mockAccount],
    };
    const action = AccountsActions.loadActiveAccounts({});
    const state = accountsReducer(stateWithAccounts, action);
    expect(state.isLoading).toBe(false);
  });

  it('should handle loadActiveAccountsSuccess', () => {
    const action = AccountsActions.loadActiveAccountsSuccess({
      accounts: [mockAccount],
    });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.accounts).toEqual([mockAccount]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle loadActiveAccountsFailure', () => {
    const action = AccountsActions.loadActiveAccountsFailure({
      error: 'Active load failed',
    });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Active load failed');
  });

  it('should handle selectAccount', () => {
    const action = AccountsActions.selectAccount({
      account: mockAccount,
    });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.selectedAccountId).toEqual(mockAccount);
  });

  it('should handle createAccount', () => {
    const action = AccountsActions.createAccount({
      request: {
        friendlyName: 'New',
        type: AccountType.saving,
        currency: 'USD',
      },
    });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.isCreating).toBe(true);
    expect(state.createError).toBeNull();
  });

  it('should handle createAccountSuccess', () => {
    const action = AccountsActions.createAccountSuccess({
      account: mockAccount2,
    });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.accounts).toContain(mockAccount2);
    expect(state.isCreating).toBe(false);
    expect(state.isCreateModalOpen).toBe(false);
  });

  it('should handle createAccountFailure', () => {
    const action = AccountsActions.createAccountFailure({
      error: 'Create error',
    });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.createError).toBe('Create error');
  });

  it('should handle updateFriendlyName', () => {
    const action = AccountsActions.updateFriendlyName({
      accountId: '2',
      friendlyName: 'Updated Savings',
    });
    const state = accountsReducer(
      { ...initialAccountsState, accounts: [mockAccount, mockAccount2] },
      action,
    );
    expect(state.isUpdatingFriendlyName).toBe(true);
    expect(state.updateFriendlyNameError).toBeNull();
  });

  it('should handle updateFriendlyName', () => {
    const action = AccountsActions.updateFriendlyName({
      accountId: '2',
      friendlyName: 'Updated Savings',
    });
    const state = accountsReducer(
      { ...initialAccountsState, accounts: [mockAccount, mockAccount2] },
      action,
    );
    expect(state.isUpdatingFriendlyName).toBe(true);
    expect(state.accounts[1].friendlyName).toBe('Updated Savings');
  });

  it('should handle updateFriendlyNameSuccess and update matching account', () => {
    const action = AccountsActions.updateFriendlyNameSuccess({
      account: { ...mockAccount2, friendlyName: 'Premium Savings' },
    });
    const state = accountsReducer(
      { ...initialAccountsState, accounts: [mockAccount, mockAccount2] },
      action,
    );
    expect(state.accounts[1].friendlyName).toBe('Premium Savings');
  });

  it('should handle updateFriendlyNameSuccess with null account id and leave accounts unchanged', () => {
    const action = AccountsActions.updateFriendlyNameSuccess({
      account: { ...mockAccount2, id: '', friendlyName: 'No Id' },
    });
    const initialState = {
      ...initialAccountsState,
      accounts: [mockAccount, mockAccount2],
    };
    const state = accountsReducer(initialState, action);
    expect(state.accounts).toEqual(initialState.accounts);
    expect(state.isUpdatingFriendlyName).toBe(false);
  });

  it('should handle updateFriendlyNameFailure', () => {
    const action = AccountsActions.updateFriendlyNameFailure({
      error: 'Update failed',
    });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.updateFriendlyNameError).toBe('Update failed');
  });

  it('should handle fetchMoreAccounts', () => {
    const action = AccountsActions.fetchMoreAccounts();
    const state = accountsReducer(initialAccountsState, action);
    expect(state.isFetching).toBe(true);
  });

  it('should handle fetchMoreAccountsSuccess', () => {
    const action = AccountsActions.fetchMoreAccountsSuccess({
      accounts: [mockAccount2],
    });
    const state = accountsReducer(
      { ...initialAccountsState, accounts: [mockAccount] },
      action,
    );
    expect(state.accounts).toHaveLength(2);
  });

  it('should handle fetchMoreAccountsFailure', () => {
    const action = AccountsActions.fetchMoreAccountsFailure({
      error: 'Fetch error',
    });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.error).toBe('Fetch error');
  });

  it('should handle openCreateModal', () => {
    const action = AccountsActions.openCreateModal();
    const state = accountsReducer(initialAccountsState, action);
    expect(state.isCreateModalOpen).toBe(true);
  });

  it('should handle closeCreateModal', () => {
    const action = AccountsActions.closeCreateModal();
    const state = accountsReducer(
      { ...initialAccountsState, isCreateModalOpen: true },
      action,
    );
    expect(state.isCreateModalOpen).toBe(false);
  });
  it('should handle loadActiveAccounts with existing data and no refresh', () => {
    const stateWithData = { ...initialAccountsState, accounts: [mockAccount] };
    const action = AccountsActions.loadActiveAccounts({ forceRefresh: false });
    const state = accountsReducer(stateWithData, action);
    expect(state.isLoading).toBe(false);
  });

  it('updateFriendlyNameSuccess with missing id leaves accounts unchanged', () => {
    const action = AccountsActions.updateFriendlyNameSuccess({
      account: {} as unknown as typeof mockAccount,
    });
    const state = accountsReducer(
      { ...initialAccountsState, accounts: [mockAccount] },
      action,
    );
    expect(state.accounts).toHaveLength(1);
    expect(state.isUpdatingFriendlyName).toBe(false);
  });

  it('should reset to initial state on UserInfoActions.loadUser', () => {
    const stateWithData = {
      ...initialAccountsState,
      accounts: [mockAccount],
      isLoading: true,
      error: 'old',
    };
    const state = accountsReducer(stateWithData, UserInfoActions.loadUser());
    expect(state).toEqual(initialAccountsState);
  });

  it('should handle enrichAccountsWithLastTransactions', () => {
    const action = AccountsActions.enrichAccountsWithLastTransactions();
    const state = accountsReducer(initialAccountsState, action);
    expect(state.isLoadingLastTransactions).toBe(true);
    expect(state.lastTransactionsError).toBeNull();
  });

  it('should handle enrichAccountsSuccess', () => {
    const lastTransactions = { GE89NB: mockAccount as any };
    const action = AccountsActions.enrichAccountsSuccess({
      lastTransactions,
    });
    const state = accountsReducer(
      { ...initialAccountsState, isLoadingLastTransactions: true },
      action,
    );
    expect(state.lastTransactions).toEqual(lastTransactions);
    expect(state.isLoadingLastTransactions).toBe(false);
    expect(state.lastTransactionsError).toBeNull();
  });

  it('should handle enrichAccountsFailure', () => {
    const action = AccountsActions.enrichAccountsFailure({
      error: 'Enrich failed',
    });
    const state = accountsReducer(
      { ...initialAccountsState, isLoadingLastTransactions: true },
      action,
    );
    expect(state.isLoadingLastTransactions).toBe(false);
    expect(state.lastTransactionsError).toBe('Enrich failed');
  });

  it('should handle loadCurrencies', () => {
    const action = AccountsActions.loadCurrencies();
    const state = accountsReducer(initialAccountsState, action);
    expect(state.isLoadingCurrencies).toBe(true);
  });

  it('should handle loadCurrenciesSuccess', () => {
    const currencies = ['USD', 'EUR', 'GBP'];
    const action = AccountsActions.loadCurrenciesSuccess({ currencies });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.currencies).toEqual(currencies);
  });

  it('should handle loadCurrenciesFailure', () => {
    const action = AccountsActions.loadCurrenciesFailure({
      error: 'Currency load error',
    });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.error).toBe('Currency load error');
  });

  it('should handle addNotification', () => {
    const action = AccountsActions.addNotification({
      notificationType: 'success',
      message: 'Test notification',
    });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.notifications).toHaveLength(1);
  });

  it('should handle dismissNotification', () => {
    const notificationId = '123';
    const stateWithNotification = {
      ...initialAccountsState,
      notifications: [
        {
          id: notificationId,
          notificationType: 'success' as const,
          message: 'Test',
        },
      ],
    };
    const action = AccountsActions.dismissNotification({ id: notificationId });
    const state = accountsReducer(stateWithNotification, action);
    expect(state.notifications).toHaveLength(0);
  });
  it('should handle clearAccountsStore', () => {
    const stateWithData = {
      ...initialAccountsState,
      accounts: [mockAccount],
      isLoading: true,
      error: 'Some error',
    };
    const action = AccountsActions.clearAccountsStore();
    const state = accountsReducer(stateWithData, action);
    expect(state).toEqual(initialAccountsState);
  });
});
