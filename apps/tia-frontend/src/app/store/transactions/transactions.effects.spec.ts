import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, Subject, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TransactionActions } from './transactions.actions';
import {
  assignCategoryEffect,
  createCategoryEffect,
  loadTotalEffect,
  loadTransactionsCategoriesEffect,
  loadTransactionsEffect,
  updateFiltersEffects,
} from './transactions.effects';
import {
  selectFilters,
  selectNextCursor,
  selectTransactionsLoaded,
} from './transactions.selector';
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
      createTransactionCategory: vi.fn(),
      categorizeTransaction: vi.fn(),
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
    store.overrideSelector(selectTransactionsLoaded, false);
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
    expect(result).toEqual(TransactionActions.loadTransactions({}));
  });

  it('loads transactions successfully', () => {
    const response = { items: [], pageInfo: {} };
    const filters = { pageLimit: 20 };
    store.overrideSelector(selectFilters, filters);
    store.overrideSelector(selectNextCursor, null);
    store.overrideSelector(selectTransactionsLoaded, false);
    transactionService.getTransactions.mockReturnValue(of(response));

    actions$ = of(TransactionActions.loadTransactions({}));

    TestBed.runInInjectionContext(() =>
      loadTransactionsEffect(actions$, store, transactionService).subscribe(
        (action) => {
          expect(action).toEqual(
            TransactionActions.loadTransactionsSuccess({ response } as any),
          );
          expect(transactionService.getTransactions).toHaveBeenCalledWith({
            ...filters,
            pageCursor: undefined,
          });
        },
      ),
    );
  });

  it('handles API error', () => {
    const error = 'Network Error';
    store.overrideSelector(selectFilters, {});
    store.overrideSelector(selectNextCursor, null);
    store.overrideSelector(selectTransactionsLoaded, false);
    transactionService.getTransactions.mockReturnValue(throwError(() => error));

    actions$ = of(TransactionActions.loadTransactions({}));

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
      loadTransactionsEffect(actions$, store, transactionService).subscribe(
        () => {},
      ),
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

  it('skips loading when data is already loaded and no forceRefresh', () => {
    store.overrideSelector(selectTransactionsLoaded, true);
    actions$ = of(TransactionActions.loadTransactions({}));

    const spy = vi.fn();
    TestBed.runInInjectionContext(() =>
      loadTransactionsEffect(actions$, store, transactionService).subscribe(
        spy,
      ),
    );

    expect(transactionService.getTransactions).not.toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });

  it('loads transactions when forceRefresh is true despite loaded data', () => {
    const response = { items: [], pageInfo: {} };
    store.overrideSelector(selectTransactionsLoaded, true);
    store.overrideSelector(selectFilters, {});
    store.overrideSelector(selectNextCursor, null);
    transactionService.getTransactions.mockReturnValue(of(response));

    actions$ = of(TransactionActions.loadTransactions({ forceRefresh: true }));

    TestBed.runInInjectionContext(() =>
      loadTransactionsEffect(actions$, store, transactionService).subscribe(
        (action) => {
          expect(action).toEqual(
            TransactionActions.loadTransactionsSuccess({ response } as any),
          );
        },
      ),
    );
    expect(transactionService.getTransactions).toHaveBeenCalled();
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
  it('creates category successfully', () => {
    const categoryName = 'New Cat';
    const response = { id: '123', name: categoryName };

    transactionService.createTransactionCategory.mockReturnValue(of(response));
    actions$ = of(TransactionActions.createCategory({ name: categoryName }));

    TestBed.runInInjectionContext(() =>
      createCategoryEffect(actions$, transactionService).subscribe((action) => {
        expect(action).toEqual(
          TransactionActions.createCategorySuccess({ response } as any),
        );
        expect(
          transactionService.createTransactionCategory,
        ).toHaveBeenCalledWith(categoryName);
      }),
    );
  });

  it('assigns category successfully', () => {
    const payload = { transactionId: 'tx-1', categoryId: 'cat-1' };
    const response = 'success';

    transactionService.categorizeTransaction.mockReturnValue(of(response));
    actions$ = of(TransactionActions.assignCategory(payload));

    TestBed.runInInjectionContext(() =>
      assignCategoryEffect(actions$, transactionService).subscribe((action) => {
        expect(action).toEqual(
          TransactionActions.assignCategorySuccess(payload),
        );
        expect(transactionService.categorizeTransaction).toHaveBeenCalledWith(
          payload.transactionId,
          payload.categoryId,
        );
      }),
    );
  });
});
