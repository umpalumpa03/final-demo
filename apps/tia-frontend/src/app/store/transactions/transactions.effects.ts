import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TransactionActions } from './transactions.actions';
import {
  catchError,
  debounceTime,
  EMPTY,
  map,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';

import { Store } from '@ngrx/store';
import { selectFilters, selectNextCursor } from './transactions.selector';
import { TransactionApiService } from '@tia/shared/services/transactions-service/transactions.api.service';

export const updateFiltersEffects = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(TransactionActions.updateFilters),
      debounceTime(400),
      map(() => TransactionActions.loadTransactions()),
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
      ofType(
        TransactionActions.enter,
        TransactionActions.loadTransactions,
        TransactionActions.loadMore,
      ),
      withLatestFrom(
        store.select(selectFilters),
        store.select(selectNextCursor),
      ),
      switchMap(([action, filters, nextCursor]) => {
        if (action.type === TransactionActions.loadMore.type && !nextCursor) {
          return EMPTY;
        }

        const apiFilters = { ...filters };
        if (action.type === TransactionActions.loadMore.type && nextCursor) {
          apiFilters.pageCursor = nextCursor;
        }

        return transactionService.getTransactions(apiFilters).pipe(
          map((response) => TransactionActions.loadSuccess({ response })),
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
    transactionService = inject(TransactionApiService),
  ) => {
    return actions$.pipe(
      ofType(TransactionActions.enter, TransactionActions.loadTransactions),
      switchMap(() => {
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
    transactionService = inject(TransactionApiService),
  ) => {
    return actions$.pipe(
      ofType(TransactionActions.enter, TransactionActions.loadCategories),
      switchMap(() => {
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
