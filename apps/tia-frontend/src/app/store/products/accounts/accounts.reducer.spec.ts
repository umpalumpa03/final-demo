import { describe, it, expect } from 'vitest';
import { accountsReducer } from './accounts.reducer';
import { initialAccountsState } from './accounts.state';
import { AccountsActions } from './accounts.actions';
import { AccountType } from '../../../features/bank/products/models/accounts.model';

describe('AccountsReducer', () => {
  it('should return initial state', () => {
    const action = { type: 'UNKNOWN' } as { type: string };
    const result = accountsReducer(
      initialAccountsState,
      action as unknown as ReturnType<typeof AccountsActions.loadAccounts>,
    );
    expect(result).toEqual(initialAccountsState);
  });

  it('should handle loadAccounts', () => {
    const action = AccountsActions.loadAccounts();
    const result = accountsReducer(initialAccountsState, action);
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should handle loadAccountsSuccess', () => {
    const mockAccounts = [
      {
        id: '1',
        accountNumber: '123',
        accountName: 'Test',
        type: AccountType.current,
        balance: 1000,
        currency: 'USD',
        isActive: true,
        createdAt: '2024-01-01',
      },
    ];
    const action = AccountsActions.loadAccountsSuccess({
      accounts: mockAccounts,
    });
    const result = accountsReducer(initialAccountsState, action);
    expect(result.accounts).toEqual(mockAccounts);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBeNull();
  });

  it('should handle loadAccountsFailure', () => {
    const error = 'Failed to load accounts';
    const action = AccountsActions.loadAccountsFailure({ error });
    const result = accountsReducer(initialAccountsState, action);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe(error);
  });

  it('should handle selectAccount', () => {
    const action = AccountsActions.selectAccount({ accountId: '1' });
    const result = accountsReducer(initialAccountsState, action);
    expect(result.selectedAccountId).toBe('1');
  });

  it('should preserve other state when handling selectAccount', () => {
    const stateWithAccounts = {
      ...initialAccountsState,
      accounts: [
        {
          id: '1',
          accountNumber: '123',
          accountName: 'Test',
          type: AccountType.current,
          balance: 1000,
          currency: 'USD',
          isActive: true,
          createdAt: '2024-01-01',
        },
      ],
    };
    const action = AccountsActions.selectAccount({ accountId: '1' });
    const result = accountsReducer(stateWithAccounts, action);
    expect(result.accounts).toEqual(stateWithAccounts.accounts);
    expect(result.selectedAccountId).toBe('1');
  });
});
