import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, forkJoin } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  withLatestFrom,
  filter,
} from 'rxjs/operators';
import { AccountsApiService } from '../../../shared/services/accounts/accounts.api.service';
import { AccountsActions } from './accounts.actions';
import { Store } from '@ngrx/store';
import { selectAccounts } from './accounts.selectors';
import { TransactionApiService } from '../../../shared/services/transactions-service/transactions.api.service';
import { ITransactions } from '../../../shared/models/transactions/transactions.models';

@Injectable()
export class AccountsEffects {
  private readonly actions$ = inject(Actions);
  private readonly accountsService = inject(AccountsApiService);
  private readonly store = inject(Store);
  private readonly transactionService = inject(TransactionApiService);

  loadAccounts$ = createEffect(() =>
    this.actions$.pipe(
      // liisten specifically for the 'loadAccounts' action
      ofType(AccountsActions.loadAccounts),
      // peek at the current accounts in the Store for comparison
      withLatestFrom(this.store.select(selectAccounts)),
      // only proceed to the API call if:
      //  a manual refresh is requested or
      //    store is empty / null
      filter(
        ([action, accounts]) =>
          action.forceRefresh || !accounts || accounts.length === 0,
      ),

      // than fetch
      switchMap(() =>
        this.accountsService.getAccounts().pipe(
          // success-> the store with fresh data
          map((accounts) => AccountsActions.loadAccountsSuccess({ accounts })),
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

  loadActiveAccounts$ = createEffect(() =>
    this.actions$.pipe(
      // liisten specifically for the 'loadAccounts' action
      ofType(AccountsActions.loadActiveAccounts),
      // peek at the current accounts in the Store for comparison
      withLatestFrom(this.store.select(selectAccounts)),
      // only proceed to the API call if:
      //  a manual refresh is requested or
      //    store is empty / null
      filter(
        ([action, accounts]) =>
          action.forceRefresh || !accounts || accounts.length === 0,
      ),

      // than fetch
      switchMap(() =>
        this.accountsService.getActiveAccounts().pipe(
          // success-> the store with fresh data
          map((accounts) =>
            AccountsActions.loadActiveAccountsSuccess({ accounts }),
          ),
          catchError((error) =>
            of(
              AccountsActions.loadActiveAccountsFailure({
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

  enrichAccountsWithLastTransactions$ = createEffect(() =>
    this.actions$.pipe(
      // Listen for successful account loading
      ofType(
        AccountsActions.loadAccountsSuccess,
        AccountsActions.loadActiveAccountsSuccess,
      ),
      // Extract accounts from the action payload
      switchMap(({ accounts }) => {
        // Guard: If no accounts, skip
        if (!accounts || accounts.length === 0) {
          return of(
            AccountsActions.enrichAccountsSuccess({ lastTransactions: {} }),
          );
        }

        // Create one API request per account
        const transactionRequests = accounts.map((account) =>
          this.transactionService
            .getTransactions({
              accountIban: account.iban,
              pageLimit: 1, // Only get the most recent transaction
            })
            .pipe(
              map((response) => ({
                iban: account.iban,
                transaction: response.items[0] || null, // First item or null
              })),
              catchError(() =>
                // If this account's request fails, return null for this account
                of({ iban: account.iban, transaction: null }),
              ),
            ),
        );

        // Execute all requests in parallel
        return forkJoin(transactionRequests).pipe(
          map((results) => {
            // Convert array to Record<iban, transaction>
            const lastTransactions = results.reduce(
              (acc, { iban, transaction }) => {
                acc[iban] = transaction;
                return acc;
              },
              {} as Record<string, ITransactions | null>,
            );

            return AccountsActions.enrichAccountsSuccess({ lastTransactions });
          }),
          catchError((error) =>
            of(
              AccountsActions.enrichAccountsFailure({
                error: error.message || 'Failed to load last transactions',
              }),
            ),
          ),
        );
      }),
    ),
  );
}
