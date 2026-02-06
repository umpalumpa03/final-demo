import { describe, it, expect } from 'vitest';
import { Action } from '@ngrx/store';
import { accountsReducer } from './accounts.reducer';
import { initialAccountsState } from './accounts.state';
import * as AccountsActions from './accounts.actions';
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
  };

  it('should return initial state', () => {
    const action: Action = { type: 'UNKNOWN' };
    const state = accountsReducer(undefined, action);
    expect(state).toEqual(initialAccountsState);
  });

  it('should handle loadAccounts', () => {
    const action = AccountsActions.AccountsActions.loadAccounts({});
    const state = accountsReducer(initialAccountsState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle loadAccountsSuccess', () => {
    const action = AccountsActions.AccountsActions.loadAccountsSuccess({
      accounts: [mockAccount],
    });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.accounts).toEqual([mockAccount]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle loadAccountsFailure', () => {
    const action = AccountsActions.AccountsActions.loadAccountsFailure({
      error: 'Network error',
    });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  it('should handle selectAccount', () => {
    const action = AccountsActions.AccountsActions.selectAccount({
      account: mockAccount,
    });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.selectedAccountId).toEqual(mockAccount);
  });

  it('should handle createAccount', () => {
    const action = AccountsActions.AccountsActions.createAccount({
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
    const action = AccountsActions.AccountsActions.createAccountSuccess({
      account: mockAccount2,
    });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.accounts).toContain(mockAccount2);
    expect(state.isCreating).toBe(false);
    expect(state.createError).toBeNull();
    expect(state.isCreateModalOpen).toBe(false);
  });

  it('should handle createAccountFailure', () => {
    const action = AccountsActions.AccountsActions.createAccountFailure({
      error: 'Create error',
    });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.isCreating).toBe(false);
    expect(state.createError).toBe('Create error');
  });

  it('should handle updateFriendlyName', () => {
    const action = AccountsActions.AccountsActions.updateFriendlyName({
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

  it('should handle updateFriendlyNameSuccess', () => {
    const action = AccountsActions.AccountsActions.updateFriendlyNameSuccess({
      account: { ...mockAccount2, friendlyName: 'Premium Savings' },
    });
    const state = accountsReducer(
      { ...initialAccountsState, accounts: [mockAccount, mockAccount2] },
      action,
    );
    expect(state.isUpdatingFriendlyName).toBe(false);
    expect(state.updateFriendlyNameError).toBeNull();
    expect(state.accounts[1].friendlyName).toBe('Premium Savings');
  });

  it('should handle updateFriendlyNameFailure', () => {
    const action = AccountsActions.AccountsActions.updateFriendlyNameFailure({
      error: 'Update failed',
    });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.isUpdatingFriendlyName).toBe(false);
    expect(state.updateFriendlyNameError).toBe('Update failed');
  });

  it('should handle fetchMoreAccounts', () => {
    const action = AccountsActions.AccountsActions.fetchMoreAccounts();
    const state = accountsReducer(initialAccountsState, action);
    expect(state.isFetching).toBe(true);
  });

  it('should handle fetchMoreAccountsSuccess', () => {
    const action = AccountsActions.AccountsActions.fetchMoreAccountsSuccess({
      accounts: [mockAccount2],
    });
    const state = accountsReducer(
      { ...initialAccountsState, accounts: [mockAccount] },
      action,
    );
    expect(state.accounts).toHaveLength(2);
    expect(state.isFetching).toBe(false);
  });

  it('should handle fetchMoreAccountsFailure', () => {
    const action = AccountsActions.AccountsActions.fetchMoreAccountsFailure({
      error: 'Fetch error',
    });
    const state = accountsReducer(initialAccountsState, action);
    expect(state.isFetching).toBe(false);
    expect(state.error).toBe('Fetch error');
  });

  it('should handle openCreateModal', () => {
    const action = AccountsActions.AccountsActions.openCreateModal();
    const state = accountsReducer(initialAccountsState, action);
    expect(state.isCreateModalOpen).toBe(true);
  });

  it('should handle closeCreateModal', () => {
    const action = AccountsActions.AccountsActions.closeCreateModal();
    const state = accountsReducer(
      { ...initialAccountsState, isCreateModalOpen: true },
      action,
    );
    expect(state.isCreateModalOpen).toBe(false);
  });
});
