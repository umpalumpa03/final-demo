import { describe, it, expect } from 'vitest';
import {
  selectCurrentAccounts,
  selectSavingAccounts,
  selectCardAccounts,
  selectAccountsGrouped,
  selectSelectedAccount,
  selectAccountOptions,
  selectGelAccountOptions,
} from './accounts.selectors';
import { AccountType } from '../../../shared/models/accounts/accounts.model';

describe('AccountsSelectors', () => {
  const mockAccounts = [
    {
      id: '1',
      userId: 'user1',
      permission: 1,
      type: AccountType.current,
      iban: '123',
      friendlyName: 'Current',
      name: 'Current Account',
      status: 'active',
      balance: 1000,
      currency: 'USD',
      createdAt: '2026-01-01',
      openedAt: '2026-01-01',
      closedAt: '',
      isFavorite: true,
    },
    {
      id: '2',
      userId: 'user1',
      permission: 1,
      type: AccountType.saving,
      iban: '456',
      friendlyName: 'Saving',
      name: 'Saving Account',
      status: 'active',
      balance: 5000,
      currency: 'USD',
      createdAt: '2026-01-01',
      openedAt: '2026-01-01',
      closedAt: '',
      isFavorite: false,
    },
  ];

  it('should select current accounts', () => {
    const result = selectCurrentAccounts.projector(mockAccounts);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe(AccountType.current);
  });

  it('should select saving accounts', () => {
    const result = selectSavingAccounts.projector(mockAccounts);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe(AccountType.saving);
  });

  it('should select card accounts', () => {
    const result = selectCardAccounts.projector(mockAccounts);
    expect(result.length).toBe(0);
  });

  it('should select grouped accounts', () => {
    const result = selectAccountsGrouped.projector(
      mockAccounts.filter((a) => a.type === AccountType.current),
      mockAccounts.filter((a) => a.type === AccountType.saving),
      [],
    );
    expect(result.current.length).toBe(1);
    expect(result.saving.length).toBe(1);
    expect(result.card.length).toBe(0);
  });

  it('should select account by id', () => {
    const result = selectSelectedAccount.projector(mockAccounts, '1');
    expect(result).toBeDefined();
    expect(result?.id).toBe('1');
    expect(result?.type).toBe(AccountType.current);
  });

  it('should return null when no account is selected', () => {
    const result = selectSelectedAccount.projector(mockAccounts, null);
    expect(result).toBeNull();
  });

  it('should return null when selected account not found', () => {
    const result = selectSelectedAccount.projector(
      mockAccounts,
      'non-existent',
    );
    expect(result).toBeUndefined();
  });

  it('should handle null accounts in selectSelectedAccount', () => {
    const result = selectSelectedAccount.projector(null as any, '1');
    expect(result).toBeUndefined();
  });

  it('should select account options', () => {
    const result = selectAccountOptions.projector(mockAccounts);
    expect(result.length).toBe(2);
    expect(result[0].label).toBe('Current (USD) - 1000 USD');
    expect(result[0].value).toBe('1');
    expect(result[1].label).toBe('Saving (USD) - 5000 USD');
    expect(result[1].value).toBe('2');
  });

  it('should handle null accounts in selectAccountOptions', () => {
    const result = selectAccountOptions.projector(null as any);
    expect(result).toEqual([]);
  });

  it('should select GEL account options', () => {
    const gelAccount = {
      id: '3',
      userId: 'user1',
      permission: 1,
      type: AccountType.current,
      iban: '789',
      friendlyName: 'GEL Account',
      name: 'GEL Account',
      status: 'active',
      balance: 2000,
      currency: 'GEL',
      createdAt: '2026-01-01',
      openedAt: '2026-01-01',
      closedAt: '',
      isFavorite: false,
    };
    const result = selectGelAccountOptions.projector([
      ...mockAccounts,
      gelAccount,
    ]);
    expect(result.length).toBe(1);
    expect(result[0].label).toBe('GEL Account (GEL) - 2000 GEL');
    expect(result[0].value).toBe('3');
  });

  it('should handle null accounts in selectGelAccountOptions', () => {
    const result = selectGelAccountOptions.projector(null as any);
    expect(result).toEqual([]);
  });

  it('should use account name when friendlyName is not set in selectAccountOptions', () => {
    const accountWithoutFriendlyName = {
      ...mockAccounts[0],
      friendlyName: null as any,
    };
    const result = selectAccountOptions.projector([accountWithoutFriendlyName]);
    expect(result[0].label).toContain('Current Account');
  });
});
