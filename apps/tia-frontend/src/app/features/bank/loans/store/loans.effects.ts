import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';
import { LoansService } from '../shared/services/loans.service';
import { LoansActions } from './loans.actions';
import { LoansCreateActions } from 'apps/tia-frontend/src/app/store/loans/loans.actions';

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

  public loadMonths$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoansActions.loadMonths),
      switchMap(() =>
        this.loansService.getLoanMonths().pipe(
          map((months) => LoansActions.loadMonthsSuccess({ months })),
          catchError((error) =>
            of(LoansActions.loadMonthsFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  public refreshListOnCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoansCreateActions.requestLoanSuccess),
      map(() => LoansActions.loadLoans()),
    ),
  );

  loadPurposes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoansActions.loadPurposes),
      switchMap(() =>
        this.loansService.getPurposes().pipe(
          map((purposes) => LoansActions.loadPurposesSuccess({ purposes })),
          catchError((error) =>
            of(LoansActions.loadPurposesFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  loadPrepaymentOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoansActions.loadPrepaymentOptions),
      switchMap(() =>
        this.loansService.getPrepaymentOptions().pipe(
          map((options) =>
            LoansActions.loadPrepaymentOptionsSuccess({ options }),
          ),
          catchError((error) =>
            of(
              LoansActions.loadPrepaymentOptionsFailure({
                error: error.message,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  public calculatePrepayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoansActions.calculatePrepayment),
      switchMap(({ payload }) =>
        this.loansService
          .calculatePartialPrepayment(
            payload.loanId,
            payload.amount!,
            payload.loanPartialPaymentType!,
          )
          .pipe(
            map((result) =>
              LoansActions.calculatePrepaymentSuccess({ result }),
            ),
            catchError((error) =>
              of(
                LoansActions.calculatePrepaymentFailure({
                  error: error.message,
                }),
              ),
            ),
          ),
      ),
    ),
  );
}
