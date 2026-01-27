import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { AccountsActions } from './accounts.actions';
import { AccountsService } from '../../features/bank/products/components/accounts/services/accounts.service';

@Injectable()
export class AccountsEffects {
  private readonly actions$ = inject(Actions);
  private readonly accountsService = inject(AccountsService);

  loadAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.loadAccounts),
      switchMap(() =>
        this.accountsService.getAccounts().pipe(
          map((accounts) => {
            return AccountsActions.loadAccountsSuccess({ accounts });
          }),
          catchError((error) =>
            of(
              AccountsActions.loadAccountsFailure({
                error: error.message || 'Failed to load accounts',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  selectAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.selectAccount),
      switchMap(({ accountId }) =>
        this.accountsService.getAccounts().pipe(
          map((accounts) => AccountsActions.loadAccountsSuccess({ accounts })),
          catchError((error) =>
            of(
              AccountsActions.loadAccountsFailure({
                error: error.message || 'Failed to select account',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
