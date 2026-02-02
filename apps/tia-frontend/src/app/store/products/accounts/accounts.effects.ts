import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AccountsApiService } from '../../../shared/services/accounts/accounts.api.service';
import { AccountsActions } from './accounts.actions';

@Injectable()
export class AccountsEffects {
  private readonly actions$ = inject(Actions);
  private readonly accountsService = inject(AccountsApiService);

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

  createAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.createAccount),
      switchMap(({ request }) =>
        this.accountsService.createAccount(request).pipe(
          map((account) => AccountsActions.createAccountSuccess({ account })),
          catchError((error) =>
            of(
              AccountsActions.createAccountFailure({
                error: error.message || 'Failed to create account',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateFriendlyName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.updateFriendlyName),
      switchMap(({ accountId, friendlyName }) => {
        return this.accountsService
          .updateFriendlyName(accountId, friendlyName)
          .pipe(
            map((account) => {
              return AccountsActions.updateFriendlyNameSuccess({ account });
            }),
            catchError((error) => {
              return of(
                AccountsActions.updateFriendlyNameFailure({
                  error: error.message || 'Failed to update friendly name',
                }),
              );
            }),
          );
      }),
    ),
  );
}
