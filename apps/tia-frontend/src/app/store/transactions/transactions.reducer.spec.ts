import { transactionReducer } from './transactions.reducer';
import { TransactionActions } from './transactions.actions';
import { describe, it, expect } from 'vitest';
import { transactionInitialState } from './config/transaction-state-config';

describe('Transaction Reducer', () => {
  it('should return the default state for unknown action', () => {
    const action = { type: 'Unknown' } as any;
    const state = transactionReducer(transactionInitialState, action);
    expect(state).toBe(transactionInitialState);
  });

  it('should reset state (items, total, cursor) and start loading on enter', () => {
    const dirtyState = {
      ...transactionInitialState,
      items: [{ id: 'old' }] as any,
      nextCursor: 'old',
      total: 500,
      isLoading: false,
    };

    const action = TransactionActions.enter();
    const state = transactionReducer(dirtyState, action);

    expect(state.items).toEqual([]);
    expect(state.nextCursor).toBeNull();
    expect(state.total).toBe(0);
    expect(state.isLoading).toBe(true);
  });

  it('should set isLoading to true on loadMore', () => {
    const errorState = { ...transactionInitialState, error: 'Old Error' };
    const action = TransactionActions.loadMore();
    const state = transactionReducer(errorState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should update filters and reset items/cursor on updateFilters', () => {
    const outputState = {
      ...transactionInitialState,
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
    const state = transactionReducer(transactionInitialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should append items and update cursor on loadSuccess', () => {
    const existingState = {
      ...transactionInitialState,
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

  it('should set nextCursor to null if missing in response on loadSuccess', () => {
    const action = TransactionActions.loadSuccess({
      response: { items: [], pageInfo: {} } as any,
    });
    const state = transactionReducer(transactionInitialState, action);
    expect(state.nextCursor).toBeNull();
  });

  it('should set error on loadFailure', () => {
    const error = 'Some Error';
    const action = TransactionActions.loadFailure({ error });
    const state = transactionReducer(transactionInitialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(error);
  });

  it('should update total on loadTotalSuccess', () => {
    const action = TransactionActions.loadTotalSuccess({ total: 150 });
    const state = transactionReducer(transactionInitialState, action);

    expect(state.total).toBe(150);
  });
});
