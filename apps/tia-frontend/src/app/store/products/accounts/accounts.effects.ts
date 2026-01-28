import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AccountsService } from '../../../features/bank/products/components/accounts/services/accounts.service';
import { AccountsActions } from './accounts.actions';

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
}
