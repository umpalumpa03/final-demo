import { describe, it, expect } from 'vitest';
import { accountsReducer } from './accounts.reducer';
import { initialAccountsState } from './accounts.state';
import { AccountsActions } from './accounts.actions';
import { AccountType } from '../../../shared/models/accounts/accounts.model';

describe('AccountsReducer', () => {
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
    const action = { type: 'UNKNOWN' } as { type: string };
    const result = accountsReducer(
      initialAccountsState,
      action as unknown as ReturnType<typeof AccountsActions.loadAccounts>,
    );
    expect(result).toEqual(initialAccountsState);
  });

  it('should handle loadAccounts action', () => {
    const result = accountsReducer(
      { ...initialAccountsState, error: 'Previous error' },
      AccountsActions.loadAccounts(),
    );
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should handle loadAccountsSuccess action', () => {
    const result = accountsReducer(
      { ...initialAccountsState, selectedAccountId: '1' },
      AccountsActions.loadAccountsSuccess({ accounts: [mockAccount] }),
    );
    expect(result.accounts).toEqual([mockAccount]);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBeNull();
  });

  it('should handle loadAccountsFailure action', () => {
    const result = accountsReducer(
      { ...initialAccountsState, isLoading: true },
      AccountsActions.loadAccountsFailure({ error: 'Network error' }),
    );
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Network error');
  });

  it('should handle selectAccount', () => {
    const result = accountsReducer(
      { ...initialAccountsState, accounts: [mockAccount] },
      AccountsActions.selectAccount({ accountId: '1' }),
    );
    expect(result.selectedAccountId).toBe('1');
  });

  it('should handle createAccount action', () => {
    const result = accountsReducer(
      { ...initialAccountsState, createError: 'Previous error' },
      AccountsActions.createAccount({
        request: {
          friendlyName: 'New',
          type: AccountType.saving,
          currency: 'USD',
        },
      }),
    );
    expect(result.isCreating).toBe(true);
    expect(result.createError).toBeNull();
  });

  it('should handle createAccountSuccess action', () => {
    const result = accountsReducer(
      {
        ...initialAccountsState,
        accounts: [mockAccount],
        isCreating: true,
        isCreateModalOpen: true,
      },
      AccountsActions.createAccountSuccess({ account: mockAccount2 }),
    );
    expect(result.accounts).toHaveLength(2);
    expect(result.accounts).toContain(mockAccount2);
    expect(result.isCreating).toBe(false);
    expect(result.createError).toBeNull();
    expect(result.isCreateModalOpen).toBe(false);
  });

  it('should handle createAccountFailure action', () => {
    const result = accountsReducer(
      { ...initialAccountsState, isCreating: true },
      AccountsActions.createAccountFailure({ error: 'Create error' }),
    );
    expect(result.isCreating).toBe(false);
    expect(result.createError).toBe('Create error');
  });

  it('should handle updateFriendlyName', () => {
    const result = accountsReducer(
      { ...initialAccountsState, accounts: [mockAccount, mockAccount2] },
      AccountsActions.updateFriendlyName({
        accountId: '2',
        friendlyName: 'Updated Savings',
      }),
    );
    expect(result.isUpdatingFriendlyName).toBe(true);
    expect(result.updateFriendlyNameError).toBeNull();
    expect(result.accounts[1].friendlyName).toBe('Updated Savings');
  });

  it('should handle updateFriendlyNameSuccess action', () => {
    const result = accountsReducer(
      {
        ...initialAccountsState,
        accounts: [mockAccount, mockAccount2],
        isUpdatingFriendlyName: true,
      },
      AccountsActions.updateFriendlyNameSuccess({
        account: { ...mockAccount2, friendlyName: 'Premium Savings' },
      }),
    );
    expect(result.isUpdatingFriendlyName).toBe(false);
    expect(result.updateFriendlyNameError).toBeNull();
    expect(result.accounts[1].friendlyName).toBe('Premium Savings');
  });

  it('should handle updateFriendlyNameFailure action', () => {
    const result = accountsReducer(
      { ...initialAccountsState, isUpdatingFriendlyName: true },
      AccountsActions.updateFriendlyNameFailure({ error: 'Update failed' }),
    );
    expect(result.isUpdatingFriendlyName).toBe(false);
    expect(result.updateFriendlyNameError).toBe('Update failed');
  });

  it('should handle fetchMoreAccounts action', () => {
    const result = accountsReducer(
      initialAccountsState,
      AccountsActions.fetchMoreAccounts(),
    );
    expect(result.isFetching).toBe(true);
  });

  it('should handle fetchMoreAccountsSuccess action', () => {
    const result = accountsReducer(
      { ...initialAccountsState, accounts: [mockAccount], isFetching: true },
      AccountsActions.fetchMoreAccountsSuccess({ accounts: [mockAccount2] }),
    );
    expect(result.accounts).toHaveLength(2);
    expect(result.isFetching).toBe(false);
  });

  it('should handle fetchMoreAccountsFailure action', () => {
    const result = accountsReducer(
      { ...initialAccountsState, isFetching: true },
      AccountsActions.fetchMoreAccountsFailure({ error: 'Fetch error' }),
    );
    expect(result.isFetching).toBe(false);
    expect(result.error).toBe('Fetch error');
  });

  it('should handle openCreateModal action', () => {
    const result = accountsReducer(
      initialAccountsState,
      AccountsActions.openCreateModal(),
    );
    expect(result.isCreateModalOpen).toBe(true);
  });

  it('should handle closeCreateModal action', () => {
    const result = accountsReducer(
      { ...initialAccountsState, isCreateModalOpen: true },
      AccountsActions.closeCreateModal(),
    );
    expect(result.isCreateModalOpen).toBe(false);
  });
});
