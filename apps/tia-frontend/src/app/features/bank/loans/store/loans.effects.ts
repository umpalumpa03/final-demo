import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';
import { LoansService } from '../shared/services/loans.service';
import { LoansActions } from './loans.actions';

@Injectable()
export class LoansEffects {
  private actions$ = inject(Actions);
  private loansService = inject(LoansService);

  public loadLoans$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoansActions.loadLoans),
      switchMap(() =>
        this.loansService.getAllLoans().pipe(
          map((loans) => LoansActions.loadLoansSuccess({ loans })),
          catchError((error) =>
            of(LoansActions.loadLoansFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  public renameLoan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoansActions.renameLoan),
      switchMap(({ id, name }) =>
        this.loansService.updateFriendlyName(id, name).pipe(
          map(() => LoansActions.renameLoanSuccess({ id, name })),
          catchError((error) =>
            of(LoansActions.renameLoanFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );
}
