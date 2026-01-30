import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of, tap } from 'rxjs';
import { LoanCreateService } from '@tia/shared/services/loans/loan-create.service';
import { LoansCreateActions } from './loans.actions';

@Injectable()
export class LoanCreateEffects {
  private readonly actions$ = inject(Actions);
  private readonly loanCreate = inject(LoanCreateService);

  requestLoan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoansCreateActions.requestLoan),
      switchMap(({ request }) =>
        this.loanCreate.requestLoan(request).pipe(
          map((loan) => LoansCreateActions.requestLoanSuccess({ loan })),

          catchError((error) =>
            of(
              LoansCreateActions.requestLoanFailure({
                error: error.message || 'Error requesting loan',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
