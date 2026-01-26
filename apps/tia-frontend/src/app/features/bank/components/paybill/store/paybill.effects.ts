import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { PaybillService } from '../services/paybill/paybill-service';
import { PaybillActions } from './paybill.actions';

@Injectable()
export class PaybillEffects {
  private readonly actions$ = inject(Actions);
  private readonly paybillService = inject(PaybillService);

  public readonly loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaybillActions.loadCategories),
      mergeMap(() =>
        this.paybillService.getCategories().pipe(
          map((categories) =>
            PaybillActions.loadCategoriesSuccess({ categories }),
          ),
          catchError((error) =>
            of(PaybillActions.loadCategoriesFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );
}
