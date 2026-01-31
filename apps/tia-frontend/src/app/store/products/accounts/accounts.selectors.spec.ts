import { describe, it, expect } from 'vitest';
import {
  selectCurrentAccounts,
  selectSavingAccounts,
  selectCardAccounts,
  selectAccountsGrouped,
  selectSelectedAccount,
  selectAccountOptions,
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

  it('should handle null accounts in selectors', () => {
    const currentResult = selectCurrentAccounts.projector(null as any);
    expect(currentResult).toEqual([]);

    const savingResult = selectSavingAccounts.projector(null as any);
    expect(savingResult).toEqual([]);

    const cardResult = selectCardAccounts.projector(null as any);
    expect(cardResult).toEqual([]);
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
});
