import { describe, it, expect } from 'vitest';
import { selectDashboardAccountsWithTrendline } from './dashboard-accounts.selectors';
import { AccountType } from '../../../../shared/models/accounts/accounts.model';
import { AccountWithTrendline } from '../models/account-trendline.models';

describe('Dashboard Accounts Selectors', () => {
  const mockAccount = {
    id: '1',
    userId: 'user1',
    permission: 1,
    type: AccountType.current,
    iban: 'GE00XX0000000000000001',
    friendlyName: 'Current',
    name: 'Current Account',
    status: 'active',
    balance: 1000,
    currency: 'GEL',
    createdAt: '2026-01-01',
    openedAt: '2026-01-01',
    closedAt: '',
    isFavorite: false,
    isHidden: false,
  };

  it('should return accounts with trendline and lastTransaction', () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const lastTransactions: Record<string, any> = {
      [mockAccount.iban]: {
        id: 'tx1',
        amount: 50,
        transactionType: 'credit' as const,
        creditAccountNumber: mockAccount.iban,
        debitAccountNumber: 'OTHER',
        createdAt: oneHourAgo,
      },
    };

    const result = selectDashboardAccountsWithTrendline.projector(
      [mockAccount],
      lastTransactions
    );

    expect(result).toHaveLength(1);
    expect(result[0].lastTransaction).toEqual(lastTransactions[mockAccount.iban]);
    expect(result[0].trendline).toEqual({
      direction: 'up',
      amount: 50,
      type: 'credit',
    });
  });

  it('should return accounts without trendline when no last transaction', () => {
    const result = selectDashboardAccountsWithTrendline.projector(
      [mockAccount],
      {}
    );

    expect(result).toHaveLength(1);
    expect(result[0].lastTransaction).toBeNull();
    expect(result[0].trendline).toBeNull();
  });

  it('should sort accounts by recent activity (with trendline first)', () => {
    const account2 = { ...mockAccount, id: '2', iban: 'GE00XX0000000000000002' };
    const now = new Date();
    const recent = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const lastTransactions: Record<string, any> = {
      [mockAccount.iban]: {
        id: 'tx1',
        amount: 10,
        transactionType: 'debit',
        creditAccountNumber: null,
        debitAccountNumber: mockAccount.iban,
        createdAt: recent,
      },
    };

    const result = selectDashboardAccountsWithTrendline.projector(
      [account2, mockAccount],
      lastTransactions
    );

    expect(result[0].id).toBe('1');
    expect(result[0].trendline).not.toBeNull();
    expect(result[1].id).toBe('2');
    expect(result[1].trendline).toBeNull();
  });
});
