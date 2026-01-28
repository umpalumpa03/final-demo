import { describe, it, expect } from 'vitest';
import {
  selectCurrentAccounts,
  selectSavingAccounts,
  selectCardAccounts,
  selectAccountsGrouped,
} from './accounts.selectors';
import { AccountType } from '../../../features/bank/products/models/accounts.model';

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
});
