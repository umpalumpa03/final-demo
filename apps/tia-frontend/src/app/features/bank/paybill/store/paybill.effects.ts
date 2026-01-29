import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { PaybillService } from '../services/paybill/paybill-service';
import { PaybillActions } from './paybill.actions';
import { selectSelectedProviderId } from './paybill.selectors';

export const loadCategories = createEffect(
  (actions$ = inject(Actions), paybillService = inject(PaybillService)) => {
    return actions$.pipe(
      ofType(PaybillActions.loadCategories),
      mergeMap(() =>
        paybillService.getCategories().pipe(
          map((categories) =>
            PaybillActions.loadCategoriesSuccess({ categories }),
          ),
          catchError((error) =>
            of(PaybillActions.loadCategoriesFailure({ error: error.message })),
          ),
        ),
      ),
    );
  },
  { functional: true },
);

export const loadProviders = createEffect(
  (actions$ = inject(Actions), paybillService = inject(PaybillService)) => {
    return actions$.pipe(
      ofType(PaybillActions.selectCategory),
      mergeMap(({ categoryId }) =>
        paybillService.getProviders(categoryId).pipe(
          map((providers) =>
            PaybillActions.loadProvidersSuccess({ providers }),
          ),
          catchError((error) =>
            of(PaybillActions.loadProvidersFailure({ error: error.message })),
          ),
        ),
      ),
    );
  },
  { functional: true },
);

export const autoSelectProviderAfterLoad = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(PaybillActions.loadProvidersSuccess),
      withLatestFrom(store.select(selectSelectedProviderId)),
      mergeMap(([action, selectedProviderId]) => {
        if (selectedProviderId && action.providers.length > 0) {
          return of(
            PaybillActions.selectProvider({ providerId: selectedProviderId }),
          );
        }
        return of();
      }),
    );
  },
  { functional: true },
);

export const checkBill = createEffect(
  (actions$ = inject(Actions), paybillService = inject(PaybillService)) => {
    return actions$.pipe(
      ofType(PaybillActions.checkBill),
      mergeMap(({ serviceId, accountNumber }) =>
        paybillService.checkBill(serviceId, accountNumber).pipe(
          map((details) => PaybillActions.checkBillSuccess({ details })),
          catchError((err) => of(PaybillActions.checkBillFailure({ error: err.message })))
        )
      )
    );
  },
  { functional: true }
);
