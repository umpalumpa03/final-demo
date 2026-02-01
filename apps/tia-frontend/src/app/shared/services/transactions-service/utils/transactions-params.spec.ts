import { TransactionFilter } from '@tia/shared/models/transactions/transactions.models';
import { describe, it, expect } from 'vitest';
import { createTransactionHttpParams } from './transactions-params';

describe('createTransactionHttpParams', () => {
  it('should return empty params when filter is empty', () => {
    const params = createTransactionHttpParams({} as TransactionFilter);
    expect(params.keys().length).toBe(0);
  });

  it('should map pagination params correctly', () => {
    const filters: TransactionFilter = {
      pageCursor: 'next-page',
      pageLimit: 20,
    } as any;

    const params = createTransactionHttpParams(filters);

    expect(params.get('page[cursor]')).toBe('next-page');
    expect(params.get('page[limit]')).toBe('20');
  });

  it('should map standard keys correctly', () => {
    const filters: TransactionFilter = {
      searchCriteria: 'coffee',
      amountFrom: 50,
      currency: 'GEL',
    } as any;

    const params = createTransactionHttpParams(filters);

    expect(params.get('searchCriteria')).toBe('coffee');
    expect(params.get('amountFrom')).toBe('50');
    expect(params.get('currency')).toBe('GEL');
  });

  it('should ignore null, undefined, or empty string values', () => {
    const filters: TransactionFilter = {
      searchCriteria: '',
      category: null,
      iban: undefined,
      amountTo: 100,
    } as any;

    const params = createTransactionHttpParams(filters);

    expect(params.has('searchCriteria')).toBe(false);
    expect(params.has('category')).toBe(false);
    expect(params.has('iban')).toBe(false);
    expect(params.get('amountTo')).toBe('100');
  });
});
