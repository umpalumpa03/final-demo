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
import { AlertService } from '../../../core/services/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { AccountsStore } from '../../../features/bank/settings/components/accounts/store/accounts.store';

@Injectable()
export class AccountsEffects {
  private readonly actions$ = inject(Actions);
  private readonly accountsService = inject(AccountsApiService);
  private readonly store = inject(Store);
  private readonly alertService = inject(AlertService);
  private readonly translate = inject(TranslateService);
  private readonly settingsAccountsStore = inject(AccountsStore);

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
