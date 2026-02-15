import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  withLatestFrom,
  filter,
  tap,
} from 'rxjs/operators';
import { AccountsApiService } from '../../../shared/services/accounts/accounts.api.service';
import { AccountsActions } from './accounts.actions';
import { Store } from '@ngrx/store';
import { selectAccounts, selectCurrencies } from './accounts.selectors';
import { TransactionApiService } from '../../../shared/services/transactions-service/transactions.api.service';
import { ITransactions } from '../../../shared/models/transactions/transactions.models';
import { AlertService } from '../../../core/services/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { AccountsStore } from '../../../features/bank/settings/components/accounts/store/accounts.store';

@Injectable()
export class AccountsEffects {
  private readonly actions$ = inject(Actions);
  private readonly accountsService = inject(AccountsApiService);
  private readonly store = inject(Store);
  private readonly transactionService = inject(TransactionApiService);
  private readonly alertService = inject(AlertService);
  private readonly translate = inject(TranslateService);
  private readonly settingsAccountsStore = inject(AccountsStore);

  loadAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.loadAccounts),
      withLatestFrom(this.store.select(selectAccounts)),
      switchMap(([action, cachedAccounts]) => {
        // Skip if accounts are cached and we don't need refresh or enrichment
        if (!action.forceRefresh && !action.enrichWithTransactions && cachedAccounts && cachedAccounts.length > 0) {
          return []; // No action
        }

        // If enrichment requested and accounts are cached, use cached data
        if (action.enrichWithTransactions && cachedAccounts && cachedAccounts.length > 0) {
          return [AccountsActions.loadAccountsSuccess({
            accounts: cachedAccounts,
            enrichWithTransactions: true
          })];
        }

        // Otherwise fetch from API
        return this.accountsService.getAccounts().pipe(
          map((accounts) => AccountsActions.loadAccountsSuccess({
            accounts,
            enrichWithTransactions: action.enrichWithTransactions
          })),
          catchError((error) =>
            of(
              AccountsActions.loadAccountsFailure({
                error: error.message || 'Failed to load accounts',
              }),
            ),
          ),
        );
      }),
    ),
  );

  loadActiveAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.loadActiveAccounts),
      withLatestFrom(this.store.select(selectAccounts)),
      switchMap(([action, cachedAccounts]) => {
        // Skip if accounts are cached and we don't need refresh or enrichment
        if (!action.forceRefresh && !action.enrichWithTransactions && cachedAccounts && cachedAccounts.length > 0) {
          return []; // No action
        }

        // If enrichment requested and accounts are cached, use cached data
        if (action.enrichWithTransactions && cachedAccounts && cachedAccounts.length > 0) {
          return [AccountsActions.loadActiveAccountsSuccess({
            accounts: cachedAccounts,
            enrichWithTransactions: true
          })];
        }

        // Otherwise fetch from API
        return this.accountsService.getActiveAccounts().pipe(
          map((accounts) =>
            AccountsActions.loadActiveAccountsSuccess({
              accounts,
              enrichWithTransactions: action.enrichWithTransactions
            }),
          ),
          catchError((error) =>
            of(
              AccountsActions.loadActiveAccountsFailure({
                error: error.message || 'Failed to load accounts',
              }),
            ),
          ),
        );
      }),
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
      ofType(
        AccountsActions.loadAccountsSuccess,
        AccountsActions.loadActiveAccountsSuccess,
      ),
      filter(({ enrichWithTransactions }) => enrichWithTransactions === true),
      switchMap(({ accounts }) => {
        if (!accounts || accounts.length === 0) {
          return of(
            AccountsActions.enrichAccountsSuccess({ lastTransactions: {} }),
          );
        }

        return this.transactionService
          .getTransactions({
            pageLimit: Math.min(accounts.length * 2, 100),
          })
          .pipe(
            map((response) => {
              const lastTransactions: Record<string, ITransactions | null> = {};

              accounts.forEach((account) => {
                lastTransactions[account.iban] = null;
              });

              response.items.forEach((transaction) => {
                const creditIban = transaction.creditAccountNumber;
                const debitIban = transaction.debitAccountNumber;

                if (creditIban && creditIban in lastTransactions) {
                  const existingTransaction = lastTransactions[creditIban];
                  if (!existingTransaction ||
                      new Date(transaction.createdAt) > new Date(existingTransaction.createdAt)) {
                    lastTransactions[creditIban] = transaction;
                  }
                }

                if (debitIban && debitIban in lastTransactions) {
                  const existingTransaction = lastTransactions[debitIban];
                  if (!existingTransaction ||
                      new Date(transaction.createdAt) > new Date(existingTransaction.createdAt)) {
                    lastTransactions[debitIban] = transaction;
                  }
                }
              });

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

  loadCurrencies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountsActions.loadCurrencies),
      withLatestFrom(this.store.select(selectCurrencies)),
      filter(([, currencies]) => !currencies || currencies.length === 0),
      switchMap(() =>
        this.accountsService.getCurrencies().pipe(
          map((currencies) =>
            AccountsActions.loadCurrenciesSuccess({ currencies }),
          ),
          catchError((error) =>
            of(
              AccountsActions.loadCurrenciesFailure({
                error: error.message || 'Failed to load currencies',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  createAccountSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountsActions.createAccountSuccess),
        tap(() => {
          this.alertService.info(
            this.translate.instant(
              'my-products.accounts.accountCreationRequestSent',
            ),
            {
              variant: 'dismissible',
              title: this.translate.instant('my-products.accounts.information'),
            },
          );
        }),
      ),
    { dispatch: false },
  );

  createAccountFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountsActions.createAccountFailure),
        tap(({ error }) => {
          this.alertService.error(
            error ||
              this.translate.instant(
                'my-products.accounts.failedToCreateAccount',
              ),
            {
              variant: 'dismissible',
              title: this.translate.instant('my-products.accounts.error'),
            },
          );
        }),
      ),
    { dispatch: false },
  );

  updateFriendlyNameSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountsActions.updateFriendlyNameSuccess),
        tap(() => {
          this.alertService.success(
            this.translate.instant(
              'my-products.accounts.accountNameUpdatedSuccessfully',
            ),
            {
              variant: 'dismissible',
              title: this.translate.instant('my-products.accounts.success'),
            },
          );
          this.settingsAccountsStore.resetStore();
        }),
      ),
    { dispatch: false },
  );

  updateFriendlyNameFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AccountsActions.updateFriendlyNameFailure),
        tap(({ error }) => {
          this.alertService.error(
            error ||
              this.translate.instant('my-products.accounts.failedToUpdateName'),
            {
              variant: 'dismissible',
              title: this.translate.instant('my-products.accounts.error'),
            },
          );
        }),
      ),
    { dispatch: false },
  );
}
