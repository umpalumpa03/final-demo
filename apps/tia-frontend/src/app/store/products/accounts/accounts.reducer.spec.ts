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

  it('should handle loadAccounts', () => {
    const result = accountsReducer(
      initialAccountsState,
      AccountsActions.loadAccounts(),
    );
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should handle loadAccountsSuccess', () => {
    const result = accountsReducer(
      initialAccountsState,
      AccountsActions.loadAccountsSuccess({ accounts: [mockAccount] }),
    );
    expect(result.accounts).toEqual([mockAccount]);
    expect(result.isLoading).toBe(false);
  });

  it('should handle loadAccountsFailure', () => {
    const result = accountsReducer(
      initialAccountsState,
      AccountsActions.loadAccountsFailure({ error: 'Error' }),
    );
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Error');
  });

  it('should handle selectAccount', () => {
    const result = accountsReducer(
      initialAccountsState,
      AccountsActions.selectAccount({ accountId: '1' }),
    );
    expect(result.selectedAccountId).toBe('1');
  });

  it('should handle createAccount', () => {
    const result = accountsReducer(
      initialAccountsState,
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

  it('should handle createAccountSuccess', () => {
    const result = accountsReducer(
      { ...initialAccountsState, isCreating: true, isCreateModalOpen: true },
      AccountsActions.createAccountSuccess({ account: mockAccount }),
    );
    expect(result.accounts).toContain(mockAccount);
    expect(result.isCreating).toBe(false);
    expect(result.isCreateModalOpen).toBe(false);
  });

  it('should handle createAccountFailure', () => {
    const result = accountsReducer(
      { ...initialAccountsState, isCreating: true },
      AccountsActions.createAccountFailure({ error: 'Create error' }),
    );
    expect(result.isCreating).toBe(false);
    expect(result.createError).toBe('Create error');
  });

  it('should handle openCreateModal', () => {
    const result = accountsReducer(
      initialAccountsState,
      AccountsActions.openCreateModal(),
    );
    expect(result.isCreateModalOpen).toBe(true);
  });

  it('should handle closeCreateModal', () => {
    const result = accountsReducer(
      { ...initialAccountsState, isCreateModalOpen: true },
      AccountsActions.closeCreateModal(),
    );
    expect(result.isCreateModalOpen).toBe(false);
  });

  it('should preserve all state properties on selectAccount', () => {
    const stateWithData = {
      ...initialAccountsState,
      accounts: [mockAccount],
      isLoading: false,
      error: null,
      isCreating: false,
      createError: null,
      isCreateModalOpen: false,
    };
    const result = accountsReducer(
      stateWithData,
      AccountsActions.selectAccount({ accountId: '1' }),
    );
    expect(result.selectedAccountId).toBe('1');
    expect(result.accounts).toEqual([mockAccount]);
    expect(result.isLoading).toBe(false);
    expect(result.isCreating).toBe(false);
  });

  it('should add account to empty accounts array on createAccountSuccess', () => {
    const result = accountsReducer(
      { ...initialAccountsState, isCreating: true },
      AccountsActions.createAccountSuccess({ account: mockAccount }),
    );
    expect(result.accounts).toHaveLength(1);
    expect(result.accounts[0]).toEqual(mockAccount);
  });

  it('should clear createError on createAccount', () => {
    const stateWithError = {
      ...initialAccountsState,
      createError: 'Previous error',
    };
    const result = accountsReducer(
      stateWithError,
      AccountsActions.createAccount({
        request: {
          friendlyName: 'New',
          type: AccountType.saving,
          currency: 'USD',
        },
      }),
    );
    expect(result.createError).toBeNull();
  });

  it('should clear error on loadAccounts', () => {
    const stateWithError = {
      ...initialAccountsState,
      error: 'Previous error',
    };
    const result = accountsReducer(
      stateWithError,
      AccountsActions.loadAccounts(),
    );
    expect(result.error).toBeNull();
  });

  it('should preserve other state when handling selectAccount', () => {
    const stateWithAccounts = {
      ...initialAccountsState,
      accounts: [mockAccount],
    };
    const action = AccountsActions.selectAccount({ accountId: '1' });
    const result = accountsReducer(stateWithAccounts, action);
    expect(result.accounts).toEqual(stateWithAccounts.accounts);
    expect(result.selectedAccountId).toBe('1');
  });

  it('should add new account to existing accounts on createAccountSuccess', () => {
    const stateWithAccounts = {
      ...initialAccountsState,
      accounts: [mockAccount],
      isCreating: true,
      isCreateModalOpen: true,
    };
    const action = AccountsActions.createAccountSuccess({
      account: mockAccount2,
    });
    const result = accountsReducer(stateWithAccounts, action);
    expect(result.accounts).toHaveLength(2);
    expect(result.accounts).toContain(mockAccount);
    expect(result.accounts).toContain(mockAccount2);
  });

  it('should preserve accounts when handling loadAccountsFailure', () => {
    const stateWithAccounts = {
      ...initialAccountsState,
      accounts: [mockAccount],
      isLoading: true,
    };
    const error = 'Network error';
    const action = AccountsActions.loadAccountsFailure({ error });
    const result = accountsReducer(stateWithAccounts, action);
    expect(result.accounts).toEqual(stateWithAccounts.accounts);
    expect(result.error).toBe(error);
    expect(result.isLoading).toBe(false);
  });

  it('should preserve selectedAccountId when handling loadAccountsSuccess', () => {
    const stateWithSelected = {
      ...initialAccountsState,
      selectedAccountId: '1',
    };
    const action = AccountsActions.loadAccountsSuccess({
      accounts: [mockAccount],
    });
    const result = accountsReducer(stateWithSelected, action);
    expect(result.selectedAccountId).toBe('1');
    expect(result.accounts).toEqual([mockAccount]);
  });
});
