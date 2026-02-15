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
  selectTotalTransactions,
  selectCategoriesRaw,
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
        provideMockStore({
          initialState: { transactions: { total: 0, categories: [], items: [], loaded: false } }
        }),
        { provide: TransactionApiService, useValue: transactionService },
      ],
    });

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectTransactionsLoaded, false);
    store.overrideSelector(selectTotalTransactions, 0);
    store.overrideSelector(selectCategoriesRaw, []);
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

  describe('loadTransactionsEffect', () => {
    it('loads transactions successfully', () => {
      const response = { items: [], pageInfo: {} };
      const filters = { pageLimit: 20 };
      store.overrideSelector(selectFilters, filters);
      store.overrideSelector(selectNextCursor, null);
      transactionService.getTransactions.mockReturnValue(of(response));
      actions$ = of(TransactionActions.loadTransactions({}));

      TestBed.runInInjectionContext(() =>
        loadTransactionsEffect(actions$, store, transactionService).subscribe((action) => {
          expect(action).toEqual(TransactionActions.loadTransactionsSuccess({ response } as any));
        }),
      );
    });

    it('returns cached action if already loaded', () => {
      store.overrideSelector(selectTransactionsLoaded, true);
      store.overrideSelector(selectFilters, {});
      store.overrideSelector(selectNextCursor, null);
      actions$ = of(TransactionActions.loadTransactions({}));

      TestBed.runInInjectionContext(() =>
        loadTransactionsEffect(actions$, store, transactionService).subscribe((action) => {
          expect(action).toEqual(TransactionActions.loadTransactionsCached());
        }),
      );
      expect(transactionService.getTransactions).not.toHaveBeenCalled();
    });

    it('handles API error', () => {
      const error = 'Error';
      transactionService.getTransactions.mockReturnValue(throwError(() => error));
      actions$ = of(TransactionActions.loadTransactions({}));

      TestBed.runInInjectionContext(() =>
        loadTransactionsEffect(actions$, store, transactionService).subscribe((action) => {
          expect(action).toEqual(TransactionActions.loadFailure({ error }));
        }),
      );
    });
  });

  describe('loadTotalEffect', () => {
    it('loads total successfully when 0', () => {
      const total = 100;
      transactionService.getTransactionsTotal.mockReturnValue(of(total));
      actions$ = of(TransactionActions.loadTransactions({}));

      TestBed.runInInjectionContext(() =>
        loadTotalEffect(actions$, store, transactionService).subscribe((action) => {
          expect(action).toEqual(TransactionActions.loadTotalSuccess({ total }));
        }),
      );
    });

    it('skips loading if total exists', () => {
      store.overrideSelector(selectTotalTransactions, 100);
      actions$ = of(TransactionActions.loadTransactions({}));
      const spy = vi.fn();

      TestBed.runInInjectionContext(() =>
        loadTotalEffect(actions$, store, transactionService).subscribe(spy),
      );
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('loadTransactionsCategoriesEffect', () => {
    it('loads categories on enter', () => {
      const categories = [{ id: '1' }] as any;
      transactionService.getTransactionsCategories.mockReturnValue(of(categories));
      actions$ = of(TransactionActions.enter());

      TestBed.runInInjectionContext(() =>
        loadTransactionsCategoriesEffect(actions$, store, transactionService).subscribe((action) => {
          expect(action).toEqual(TransactionActions.loadCategoriesSuccess({ categories }));
        }),
      );
    });

    it('skips loading categories if cached', () => {
      store.overrideSelector(selectCategoriesRaw, [{ id: '1' }] as any);
      actions$ = of(TransactionActions.enter());
      const spy = vi.fn();

      TestBed.runInInjectionContext(() =>
        loadTransactionsCategoriesEffect(actions$, store, transactionService).subscribe(spy),
      );
      expect(spy).not.toHaveBeenCalled();
    });

    it('forces reload on createCategorySuccess', () => {
      const categories = [{ id: '2' }] as any;
      store.overrideSelector(selectCategoriesRaw, [{ id: '1' }] as any);
      transactionService.getTransactionsCategories.mockReturnValue(of(categories));
      actions$ = of(TransactionActions.createCategorySuccess({ response: {} as any }));

      TestBed.runInInjectionContext(() =>
        loadTransactionsCategoriesEffect(actions$, store, transactionService).subscribe((action) => {
          expect(action).toEqual(TransactionActions.loadCategoriesSuccess({ categories }));
        }),
      );
    });
  });

  it('creates category successfully', () => {
    const response = { id: '1' } as any;
    transactionService.createTransactionCategory.mockReturnValue(of(response));
    actions$ = of(TransactionActions.createCategory({ name: 'test' }));

    TestBed.runInInjectionContext(() =>
      createCategoryEffect(actions$, transactionService).subscribe((action) => {
        expect(action).toEqual(TransactionActions.createCategorySuccess({ response }));
      }),
    );
  });

  it('assigns category successfully', () => {
    const payload = { transactionId: '1', categoryId: '2' };
    transactionService.categorizeTransaction.mockReturnValue(of({}));
    actions$ = of(TransactionActions.assignCategory(payload));

    TestBed.runInInjectionContext(() =>
      assignCategoryEffect(actions$, transactionService).subscribe((action) => {
        expect(action).toEqual(TransactionActions.assignCategorySuccess(payload));
      }),
    );
  });
});