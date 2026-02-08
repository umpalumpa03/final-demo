import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';
import { LoanCreateService } from '@tia/shared/services/loans/loan-create.service';
import { LoansCreateActions } from './loans.actions';
import { HttpErrorResponse } from '@angular/common/http';

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

          catchError((error: HttpErrorResponse) => {
            const errorMsg =
              error.error?.message || error.message || 'Error requesting loan';

            return of(
              LoansCreateActions.requestLoanFailure({
                error: errorMsg,
              }),
            );
          }),
        ),
      ),
    ),
  );
}
