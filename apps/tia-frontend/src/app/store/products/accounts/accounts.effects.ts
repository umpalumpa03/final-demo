import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, forkJoin } from 'rxjs';
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
      filter(
        ([action, accounts]) =>
          action.forceRefresh || !accounts || accounts.length === 0,
      ),

      switchMap(() =>
        this.accountsService.getAccounts().pipe(
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
      ofType(AccountsActions.loadActiveAccounts),

      withLatestFrom(this.store.select(selectAccounts)),

      filter(
        ([action, accounts]) =>
          action.forceRefresh || !accounts || accounts.length === 0,
      ),

      switchMap(() =>
        this.accountsService.getActiveAccounts().pipe(
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
      ofType(
        AccountsActions.loadAccountsSuccess,
        AccountsActions.loadActiveAccountsSuccess,
      ),
      switchMap(({ accounts }) => {
        if (!accounts || accounts.length === 0) {
          return of(
            AccountsActions.enrichAccountsSuccess({ lastTransactions: {} }),
          );
        }
        const transactionRequests = accounts.map((account) =>
          this.transactionService
            .getTransactions({
              accountIban: account.iban,
              pageLimit: 1,
            })
            .pipe(
              map((response) => ({
                iban: account.iban,
                transaction: response.items[0] || null,
              })),
              catchError(() => of({ iban: account.iban, transaction: null })),
            ),
        );

        return forkJoin(transactionRequests).pipe(
          map((results) => {
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
