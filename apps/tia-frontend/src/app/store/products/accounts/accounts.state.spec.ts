import { describe, it, expect } from 'vitest';
import { initialAccountsState } from './accounts.state';

describe('AccountsState', () => {
  it('should have initial state', () => {
    expect(initialAccountsState).toBeDefined();
    expect(initialAccountsState.accounts).toEqual([]);
    expect(initialAccountsState.isLoading).toBe(false);
  });
});
