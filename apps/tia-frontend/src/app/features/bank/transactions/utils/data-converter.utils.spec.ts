import { describe, it, expect } from 'vitest';
import { TransactionInterface } from '../models/transactions.models';
import { convertTransactionData } from './data-converter.utils';

describe('convertTransactionData', () => {
  it('maps debit transaction correctly', () => {
    const transaction = {
      id: '1',
      transactionType: 'debit',
      debitAccountNumber: 'DEBIT-ACC',
      creditAccountNumber: 'CREDIT-ACC',
      description: 'Test debit',
      category: 'Food',
      amount: 100,
      currency: 'USD',
      createdAt: '2024-01-01',
    } as TransactionInterface;

    const result = convertTransactionData(transaction);

    expect(result.id).toBe('1');
    expect(result.transactionType).toBe('debit');
    expect(result.info).toBeDefined();
    expect(result.info![0]).toMatchObject({
      value: 'Test debit',
      category: 'Food',
      accountName: 'DEBIT-ACC',
    });
    expect(result.info![1]).toMatchObject({
      value: '100',
      currency: 'USD',
    });
  });

  it('uses credit account and category object', () => {
    const transaction = {
      id: '2',
      transactionType: 'credit',
      creditAccountNumber: 'CREDIT-ACC',
      description: 'Test credit',
      category: { categoryName: 'Salary' },
      amount: 2500,
      currency: 'EUR',
      createdAt: '2024-01-02',
    } as TransactionInterface;

    const result = convertTransactionData(transaction);

    expect(result.transactionType).toBe('credit');
    expect(result.info![0]).toMatchObject({
      category: 'Salary',
      accountName: 'CREDIT-ACC',
    });
  });

  it('falls back to defaults', () => {
    const transaction = {
      id: '3',
      transactionType: 'unknown',
      description: 'Fallback test',
      amount: 10,
      currency: 'GEL',
      createdAt: '2024-01-03',
    } as TransactionInterface;

    const result = convertTransactionData(transaction);

    expect(result.transactionType).toBe('credit');
    expect(result.info![0]).toMatchObject({
      category: 'Uncategorized',
      accountName: 'External',
    });
  });
});
