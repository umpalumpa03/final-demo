import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { PaybillService } from '../services/paybill/paybill-service';
import { PaybillActions } from './paybill.actions';

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
