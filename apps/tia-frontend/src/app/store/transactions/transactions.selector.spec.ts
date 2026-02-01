import { TransactionState } from './models/transactions-store.models';
import {
  selectItems,
  selectIsLoading,
  selectFilters,
  selectNextCursor,
  selectError,
  selectTransactionViewModel,
} from './transactions.selector';
import { describe, it, expect } from 'vitest';

describe('Transaction Selectors', () => {
  const initialState: TransactionState = {
    items: [{ id: '1', amount: 100 } as any],
    nextCursor: 'abc-123',
    filters: { pageLimit: 20 },
    isLoading: true,
    error: { message: 'Failed' },
    total: 100
  };

  it('should select items', () => {
    const result = selectItems.projector(initialState);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1');
  });

  it('should select isLoading', () => {
    const result = selectIsLoading.projector(initialState);
    expect(result).toBe(true);
  });

  it('should select filters', () => {
    const result = selectFilters.projector(initialState);
    expect(result).toEqual({ pageLimit: 20 });
  });

  it('should select nextCursor', () => {
    const result = selectNextCursor.projector(initialState);
    expect(result).toBe('abc-123');
  });

  it('should select error', () => {
    const result = selectError.projector(initialState);
    expect(result).toEqual({ message: 'Failed' });
  });

  it('should combine state into view model', () => {
    const result = selectTransactionViewModel.projector(
      initialState.items,
      initialState.isLoading,
      initialState.filters,
      initialState.total,
    );

    expect(result).toEqual({
      items: initialState.items,
      isLoading: initialState.isLoading,
      filters: initialState.filters,
      total: initialState.total,
    });
  });
});
