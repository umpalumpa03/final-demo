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

  it('should clear error on enter but KEEP items (Smart Cache)', () => {
    const dirtyState = {
      ...transactionInitialState,
      items: [{ id: 'old' }] as any,
      error: 'Some Error',
      nextCursor: 'old-cursor',
      total: 500,
    };
    const action = TransactionActions.enter();
    const state = transactionReducer(dirtyState, action);
    expect(state.error).toBeNull();
    expect(state.items.length).toBe(1);
    expect(state.items).toEqual([{ id: 'old' }]);
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
      loaded: true,
    };

    const action = TransactionActions.updateFilters({
      filters: { pageLimit: 50 },
    });
    const state = transactionReducer(outputState, action);

    expect(state.filters.pageLimit).toBe(50);
    expect(state.items).toEqual([]);
    expect(state.nextCursor).toBeNull();
    expect(state.isLoading).toBe(true);
    expect(state.loaded).toBe(false);
  });

  it('should set loading to true on loadTransactions', () => {
    const action = TransactionActions.loadTransactions({});
    const state = transactionReducer(transactionInitialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should REPLACE items and set loaded to true on loadTransactionsSuccess', () => {
    const existingState = {
      ...transactionInitialState,
      items: [{ id: 'old-garbage' }] as any,
      isLoading: true,
    };

    const response = {
      items: [{ id: 'new-1' }, { id: 'new-2' }] as any,
      pageInfo: { nextCursor: 'next-page' },
    };

    const action = TransactionActions.loadTransactionsSuccess({
      response,
    } as any);
    const state = transactionReducer(existingState, action);

    expect(state.items.length).toBe(2);
    expect(state.items[0].id).toBe('new-1');
    expect(state.isLoading).toBe(false);
    expect(state.loaded).toBe(true);
    expect(state.nextCursor).toBe('next-page');
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

  it('should update categories state on loadCategoriesSuccess', () => {
    const categories = [{ id: '1', name: 'Cat' }] as any;
    const action = TransactionActions.loadCategoriesSuccess({ categories });
    const state = transactionReducer(transactionInitialState, action);

    expect(state.categories).toEqual(categories);
  });

  it('should set error on loadCategoriesFailure', () => {
    const error = 'Cat Error';
    const action = TransactionActions.loadCategoriesFailure({ error });
    const state = transactionReducer(transactionInitialState, action);

    expect(state.error).toBe(error);
  });

  it('should locally update transaction category on assignCategorySuccess', () => {
    const newCategory = { id: 'cat-new', name: 'Food', icon: 'food.svg' };

    const startState = {
      ...transactionInitialState,
      categories: [newCategory] as any,
      items: [
        {
          id: 'tx-1',
          category: { id: 'cat-old', name: 'Other' },
        },
      ] as any,
    };

    const action = TransactionActions.assignCategorySuccess({
      transactionId: 'tx-1',
      categoryId: 'cat-new',
    });

    const state = transactionReducer(startState, action);

    expect((state.items[0].category as any).id).toBe('cat-new');

    expect(state.items[0].category).toEqual(newCategory);
  });
});
