import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TransactionActions } from './transactions.actions';
import {
  catchError,
  debounceTime,
  EMPTY,
  map,
  mergeMap,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';

import { Store } from '@ngrx/store';
import {
  selectFilters,
  selectNextCursor,
  selectTransactionsLoaded,
  selectCategoriesRaw,
  selectTotalTransactions,
} from './transactions.selector';
import { TransactionApiService } from '@tia/shared/services/transactions-service/transactions.api.service';

export const updateFiltersEffects = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(TransactionActions.updateFilters),
      debounceTime(400),
      map(() => TransactionActions.loadTransactions({})),
    );
  },
  { functional: true },
);
export const loadTransactionsEffect = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    transactionService = inject(TransactionApiService),
  ) => {
    return actions$.pipe(
      ofType(TransactionActions.loadTransactions, TransactionActions.loadMore),
      withLatestFrom(
        store.select(selectFilters),
        store.select(selectNextCursor),
        store.select(selectTransactionsLoaded),
      ),
      switchMap(([action, filters, nextCursor, loaded]) => {
        const isLoadMore = action.type === TransactionActions.loadMore.type;
        const forceRefresh = (action as { forceRefresh?: boolean })
          .forceRefresh;

        if (isLoadMore && !nextCursor) {
          return of(TransactionActions.loadTransactionsCached());
        }
        if (!isLoadMore && loaded && !forceRefresh) {
          return of(TransactionActions.loadTransactionsCached());
        }

        const apiFilters = { ...filters };
        if (isLoadMore && nextCursor) {
          apiFilters.pageCursor = nextCursor;
        } else {
          apiFilters.pageCursor = undefined;
        }

        return transactionService.getTransactions(apiFilters).pipe(
          map((response) => {
            if (isLoadMore) {
              return TransactionActions.loadSuccess({ response });
            } else {
              return TransactionActions.loadTransactionsSuccess({ response });
            }
          }),
          catchError((error) => of(TransactionActions.loadFailure({ error }))),
        );
      }),
    );
  },
  { functional: true },
);
export const loadTotalEffect = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    transactionService = inject(TransactionApiService),
  ) => {
    return actions$.pipe(
      ofType(TransactionActions.loadTransactions),
      withLatestFrom(store.select(selectTotalTransactions)),
      mergeMap(([action, existingTotal]) => {
        const forceRefresh = action.forceRefresh;

        if (existingTotal > 0 && !forceRefresh) {
          return EMPTY;
        }

        return transactionService.getTransactionsTotal().pipe(
          map((total) => TransactionActions.loadTotalSuccess({ total })),
          catchError(() => EMPTY),
        );
      }),
    );
  },
  { functional: true },
);
export const loadTransactionsCategoriesEffect = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    transactionService = inject(TransactionApiService),
  ) => {
    return actions$.pipe(
      ofType(TransactionActions.enter, TransactionActions.loadCategories),
      withLatestFrom(store.select(selectCategoriesRaw)),
      switchMap(([action, existingCategories]) => {
        if (existingCategories.length > 0) {
          return EMPTY;
        }

        return transactionService.getTransactionsCategories().pipe(
          map((categories) =>
            TransactionActions.loadCategoriesSuccess({ categories }),
          ),
          catchError((error) =>
            of(TransactionActions.loadCategoriesFailure({ error })),
          ),
        );
      }),
    );
  },
  { functional: true },
);
export const createCategoryEffect = createEffect(
  (
    actions$ = inject(Actions),
    transactionService = inject(TransactionApiService),
  ) => {
    return actions$.pipe(
      ofType(TransactionActions.createCategory),
      switchMap(({ name }) =>
        transactionService.createTransactionCategory(name).pipe(
          map((response) =>
            TransactionActions.createCategorySuccess({ response }),
          ),
          catchError((error) =>
            of(TransactionActions.createCategoryFailure({ error })),
          ),
        ),
      ),
    );
  },
  { functional: true },
);

export const assignCategoryEffect = createEffect(
  (
    actions$ = inject(Actions),
    transactionService = inject(TransactionApiService),
  ) => {
    return actions$.pipe(
      ofType(TransactionActions.assignCategory),
      switchMap(({ transactionId, categoryId }) =>
        transactionService
          .categorizeTransaction(transactionId, categoryId)
          .pipe(
            map(() =>
              TransactionActions.assignCategorySuccess({
                transactionId,
                categoryId,
              }),
            ),
            catchError((error) =>
              of(TransactionActions.assignCategoryFailure({ error })),
            ),
          ),
      ),
    );
  },
  { functional: true },
);
