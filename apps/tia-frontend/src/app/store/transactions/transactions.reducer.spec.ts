import { transactionReducer, initialState } from './transactions.reducer';
import { TransactionActions } from './transactions.actions';
import { describe, it, expect } from 'vitest';

describe('Transaction Reducer', () => {
  it('should return the default state for unknown action', () => {
    const action = { type: 'Unknown' } as any;
    const state = transactionReducer(initialState, action);
    expect(state).toBe(initialState);
  });

  it('should update filters and reset items/cursor on updateFilters', () => {
    const outputState = {
      ...initialState,
      items: [{ id: 'old' }] as any,
      nextCursor: 'old-cursor',
    };

    const action = TransactionActions.updateFilters({
      filters: { pageLimit: 50 },
    });
    const state = transactionReducer(outputState, action);

    expect(state.filters.pageLimit).toBe(50);
    expect(state.items).toEqual([]);
    expect(state.nextCursor).toBeNull();
    expect(state.isLoading).toBe(true);
  });

  it('should set loading to true on loadTransactions', () => {
    const action = TransactionActions.loadTransactions();
    const state = transactionReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should append items and update cursor on loadSuccess', () => {
    const existingState = {
      ...initialState,
      items: [{ id: '1' }] as any,
    };

    const response = {
      items: [{ id: '2' }] as any,
      pageInfo: { nextCursor: 'new-cursor' },
    };

    const action = TransactionActions.loadSuccess({ response } as any);
    const state = transactionReducer(existingState, action);

    expect(state.isLoading).toBe(false);
    expect(state.items.length).toBe(2);
    expect(state.items[0].id).toBe('1');
    expect(state.items[1].id).toBe('2');
    expect(state.nextCursor).toBe('new-cursor');
  });

  it('should set error on loadFailure', () => {
    const error = 'Some Error';
    const action = TransactionActions.loadFailure({ error });
    const state = transactionReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(error);
  });
});
