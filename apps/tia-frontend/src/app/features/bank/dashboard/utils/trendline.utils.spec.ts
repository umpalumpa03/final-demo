import { describe, it, expect } from 'vitest';
import {
  calculateTrendline,
  sortAccountsByRecentActivity,
} from './trendline.utils';
import { AccountType } from '../../../../shared/models/accounts/accounts.model';
import { AccountWithTrendline } from '../models/account-trendline.models';

describe('trendline.utils', () => {
  const mockAccount = {
    id: '1',
    userId: 'u1',
    permission: 1,
    type: AccountType.current,
    iban: 'GE00XX0000000000000001',
    friendlyName: 'Acc',
    name: 'Account',
    status: 'active',
    balance: 100,
    currency: 'GEL',
    createdAt: '2026-01-01',
    openedAt: '2026-01-01',
    closedAt: '',
    isFavorite: false,
    isHidden: false,
  };

  describe('calculateTrendline', () => {
    it('should return null when transaction is null', () => {
      expect(calculateTrendline(mockAccount, null)).toBeNull();
    });

    it('should return null when transaction is older than 24 hours', () => {
      const oldDate = new Date();
      oldDate.setHours(oldDate.getHours() - 25);
      const tx = {
        id: 'tx1',
        userId: 'u1',
        amount: 50,
        transactionType: 'credit' as const,
        creditAccountNumber: mockAccount.iban,
        debitAccountNumber: 'OTHER',
        createdAt: oldDate.toISOString(),
      } as any;

      expect(calculateTrendline(mockAccount, tx)).toBeNull();
    });

    it('should return "up" trendline when money comes into account (credit)', () => {
      const recent = new Date();
      recent.setHours(recent.getHours() - 1);
      const tx = {
        id: 'tx1',
        userId: 'u1',
        amount: 50,
        transactionType: 'credit' as const,
        creditAccountNumber: mockAccount.iban,
        debitAccountNumber: 'OTHER',
        createdAt: recent.toISOString(),
      } as any;

      const result = calculateTrendline(mockAccount, tx);
      expect(result).toEqual({ direction: 'up', amount: 50, type: 'credit' });
    });

    it('should return "down" trendline when money leaves account (debit)', () => {
      const recent = new Date();
      recent.setHours(recent.getHours() - 1);
      const tx = {
        id: 'tx1',
        userId: 'u1',
        amount: 30,
        transactionType: 'debit' as const,
        creditAccountNumber: null,
        debitAccountNumber: mockAccount.iban,
        createdAt: recent.toISOString(),
      } as any;

      const result = calculateTrendline(mockAccount, tx);
      expect(result).toEqual({ direction: 'down', amount: 30, type: 'debit' });
    });
  });

  describe('sortAccountsByRecentActivity', () => {
    it('should put accounts with trendline first', () => {
      const withTrend: AccountWithTrendline = {
        ...mockAccount,
        id: 'with',
        lastTransaction: {} as any,
        trendline: { direction: 'up', amount: 1, type: 'credit' },
      };
      const withoutTrend: AccountWithTrendline = {
        ...mockAccount,
        id: 'without',
        lastTransaction: null,
        trendline: null,
      };

      const result = sortAccountsByRecentActivity([withoutTrend, withTrend]);
      expect(result[0].id).toBe('with');
      expect(result[1].id).toBe('without');
    });

    it('should sort by transaction date when both have trendlines', () => {
      const older = new Date();
      older.setHours(older.getHours() - 5);
      const newer = new Date();
      newer.setHours(newer.getHours() - 1);
      const a: AccountWithTrendline = {
        ...mockAccount,
        id: 'a',
        lastTransaction: { createdAt: older.toISOString() } as any,
        trendline: { direction: 'up', amount: 1, type: 'credit' },
      };
      const b: AccountWithTrendline = {
        ...mockAccount,
        id: 'b',
        lastTransaction: { createdAt: newer.toISOString() } as any,
        trendline: { direction: 'down', amount: 2, type: 'debit' },
      };

      const result = sortAccountsByRecentActivity([a, b]);
      expect(result[0].id).toBe('b');
      expect(result[1].id).toBe('a');
    });

    it('should not mutate original array', () => {
      const list: AccountWithTrendline[] = [
        { ...mockAccount, lastTransaction: null, trendline: null },
      ];
      const copy = [...list];
      sortAccountsByRecentActivity(list);
      expect(list).toEqual(copy);
    });
  });
});
