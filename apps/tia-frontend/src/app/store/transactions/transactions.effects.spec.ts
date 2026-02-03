import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, Subject, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TransactionActions } from './transactions.actions';
import {
  loadTotalEffect,
  loadTransactionsCategoriesEffect,
  loadTransactionsEffect,
  updateFiltersEffects,
} from './transactions.effects';
import { selectFilters, selectNextCursor } from './transactions.selector';
import { TransactionApiService } from '@tia/shared/services/transactions-service/transactions.api.service';

describe('Transaction Effects', () => {
  let actions$: Observable<Action>;
  let store: MockStore;
  let transactionService: any;

  beforeEach(() => {
    transactionService = {
      getTransactions: vi.fn(),
      getTransactionsTotal: vi.fn(),
      getTransactionsCategories: vi.fn(),
    };
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: TransactionApiService, useValue: transactionService },
      ],
    });

    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debounces updateFilters', () => {
    const subject = new Subject<Action>();
    actions$ = subject.asObservable();
    let result: Action | undefined;

    TestBed.runInInjectionContext(() =>
      updateFiltersEffects(actions$).subscribe((a) => (result = a)),
    );

    subject.next(TransactionActions.updateFilters({ filters: {} }));
    vi.advanceTimersByTime(399);
    expect(result).toBeUndefined();
    vi.advanceTimersByTime(1);
    expect(result).toEqual(TransactionActions.loadTransactions());
  });

  it('loads transactions successfully', () => {
    const response = { items: [], pageInfo: {} };
    const filters = { pageLimit: 20 };
    store.overrideSelector(selectFilters, filters);
    store.overrideSelector(selectNextCursor, null);
    transactionService.getTransactions.mockReturnValue(of(response));

    actions$ = of(TransactionActions.loadTransactions());

    TestBed.runInInjectionContext(() =>
      loadTransactionsEffect(actions$, store, transactionService).subscribe(
        (action) => {
          expect(action).toEqual(
            TransactionActions.loadSuccess({ response } as any),
          );
          expect(transactionService.getTransactions).toHaveBeenCalledWith(
            filters,
          );
        },
      ),
    );
  });

  it('handles API error', () => {
    const error = 'Network Error';
    store.overrideSelector(selectFilters, {});
    store.overrideSelector(selectNextCursor, null);
    transactionService.getTransactions.mockReturnValue(throwError(() => error));

    actions$ = of(TransactionActions.loadTransactions());

    TestBed.runInInjectionContext(() =>
      loadTransactionsEffect(actions$, store, transactionService).subscribe(
        (action) =>
          expect(action).toEqual(TransactionActions.loadFailure({ error })),
      ),
    );
  });

  it('passes cursor on loadMore', () => {
    const cursor = 'cursor';
    const filters = { pageLimit: 10 };
    store.overrideSelector(selectFilters, filters);
    store.overrideSelector(selectNextCursor, cursor);
    transactionService.getTransactions.mockReturnValue(
      of({ items: [], pageInfo: {} }),
    );

    actions$ = of(TransactionActions.loadMore());

    TestBed.runInInjectionContext(() =>
      loadTransactionsEffect(actions$, store, transactionService).subscribe(),
    );

    expect(transactionService.getTransactions).toHaveBeenCalledWith({
      ...filters,
      pageCursor: cursor,
    });
  });

  it('ignores loadMore without cursor', () => {
    store.overrideSelector(selectFilters, {});
    store.overrideSelector(selectNextCursor, null);
    actions$ = of(TransactionActions.loadMore());

    const spy = vi.fn();
    TestBed.runInInjectionContext(() =>
      loadTransactionsEffect(actions$, store, transactionService).subscribe(
        spy,
      ),
    );

    expect(transactionService.getTransactions).not.toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });

  it('loads total successfully', () => {
    const total = 100;
    transactionService.getTransactionsTotal.mockReturnValue(of(total));
    actions$ = of(TransactionActions.enter());

    TestBed.runInInjectionContext(() =>
      loadTotalEffect(actions$, transactionService).subscribe((action) => {
        expect(action).toEqual(TransactionActions.loadTotalSuccess({ total }));
      }),
    );
  });

  it('loads categories successfully', () => {
    const categories = [{ id: '1', name: 'Food' }];
    transactionService.getTransactionsCategories.mockReturnValue(
      of(categories),
    );
    actions$ = of(TransactionActions.loadCategories());

    TestBed.runInInjectionContext(() =>
      loadTransactionsCategoriesEffect(actions$, transactionService).subscribe(
        (action) => {
          expect(action).toEqual(
            TransactionActions.loadCategoriesSuccess({ categories } as any),
          );
        },
      ),
    );
  });

  it('handles categories loading error', () => {
    const error = 'Failed';
    transactionService.getTransactionsCategories.mockReturnValue(
      throwError(() => error),
    );
    actions$ = of(TransactionActions.loadCategories());

    TestBed.runInInjectionContext(() =>
      loadTransactionsCategoriesEffect(actions$, transactionService).subscribe(
        (action) => {
          expect(action).toEqual(
            TransactionActions.loadCategoriesFailure({ error }),
          );
        },
      ),
    );
  });
});
