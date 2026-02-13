import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, filter, EMPTY } from 'rxjs';
import { AccountManagementService } from '../services/acount-management.service';
import { initialState } from './accounts.state';
import { Store } from '@ngrx/store';
import { AccountsActions } from '../../../../../../store/products/accounts/accounts.actions';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@tia/core/services/alert/alert.service';

export const AccountsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store, service = inject(AccountManagementService)) => {
    const globalStore = inject(Store);
    const translate = inject(TranslateService);
    const alertService = inject(AlertService);

    return {
      clearError(): void {
        patchState(store, { error: null });
      },

      clearSuccessMessage(): void {
        patchState(store, { successMessage: null });
      },

      invalidate(): void {
        patchState(store, { loaded: false });
      },

      loadAccounts: rxMethod<void>(
        pipe(
          filter(() => !store.loaded() && !store.loading()),
          tap(() =>
            patchState(store, {
              loading: true,
              error: null,
              successMessage: null,
            }),
          ),
          switchMap(() =>
            service.getAllAccounts().pipe(
              tap((accounts) =>
                patchState(store, { accounts, loading: false, loaded: true }),
              ),
              catchError(() => {
                patchState(store, {
                  accounts: [],
                  loading: false,
                  loaded: false,
                  error: 'Failed to load accounts',
                });
                return EMPTY;
              }),
            ),
          ),
        ),
      ),

      toggleFavorite: rxMethod<{ id: string; isFavorite: boolean | null }>(
        pipe(
          tap(({ id }) => {
            const currentIds = new Set(store.favoriteLoadingIds());
            currentIds.add(id);
            patchState(store, {
              favoriteLoadingIds: currentIds,
              error: null,
              successMessage: null,
            });
          }),
          switchMap(({ id, isFavorite }) =>
            service
              .markAccountFavoriteStatus({
                accountId: id,
                isFavorite: !isFavorite,
              })
              .pipe(
                tap(() => {
                  const currentIds = new Set(store.favoriteLoadingIds());
                  currentIds.delete(id);
                  const newFavorite = !isFavorite;
                  const accounts =
                    store
                      .accounts()
                      ?.map((account) =>
                        account.id === id
                          ? { ...account, isFavorite: newFavorite }
                          : newFavorite
                            ? { ...account, isFavorite: false }
                            : account,
                      ) ?? null;
                  patchState(store, {
                    accounts,
                    favoriteLoadingIds: currentIds,
                  });
                  alertService.success(
                    translate.instant(
                      'settings.accounts.storeAlerts.favSuccess',
                    ),
                    { variant: 'dismissible', title: 'Success!' },
                  );
                  globalStore.dispatch(
                    AccountsActions.loadAccounts({ forceRefresh: true }),
                  );
                }),
                catchError(() => {
                  const currentIds = new Set(store.favoriteLoadingIds());
                  currentIds.delete(id);
                  patchState(store, {
                    favoriteLoadingIds: currentIds,
                  });
                  alertService.error(
                    translate.instant(
                      'settings.accounts.storeAlerts.favFailed',
                    ),
                    { variant: 'dismissible', title: 'Oops!' },
                  );
                  return EMPTY;
                }),
              ),
          ),
        ),
      ),

      toggleVisibility: rxMethod<{ id: string; isHidden: boolean | null }>(
        pipe(
          tap(({ id }) => {
            const currentIds = new Set(store.visibilityLoadingIds());
            currentIds.add(id);
            patchState(store, {
              visibilityLoadingIds: currentIds,
              error: null,
              successMessage: null,
            });
          }),
          switchMap(({ id, isHidden }) =>
            service
              .updateAccountVisibility({ accountId: id, isHidden: !isHidden })
              .pipe(
                tap(() => {
                  const currentIds = new Set(store.visibilityLoadingIds());
                  currentIds.delete(id);
                  const nextHidden = !(isHidden ?? false);
                  const accounts =
                    store.accounts()?.map((account) =>
                      account.id === id
                        ? {
                            ...account,
                            isHidden: nextHidden,
                            ...(nextHidden ? { isFavorite: false } : {}),
                          }
                        : account,
                    ) ?? null;
                  patchState(store, {
                    accounts,
                    visibilityLoadingIds: currentIds,
                  });
                  alertService.success(
                    translate.instant(
                      'settings.accounts.storeAlerts.visibilitySuccess',
                    ),
                    { variant: 'dismissible', title: 'Success!' },
                  );
                  globalStore.dispatch(
                    AccountsActions.loadAccounts({ forceRefresh: true }),
                  );
                }),
                catchError(() => {
                  const currentIds = new Set(store.visibilityLoadingIds());
                  currentIds.delete(id);
                  patchState(store, {
                    visibilityLoadingIds: currentIds,
                  });
                  alertService.error(
                    translate.instant(
                      'settings.accounts.storeAlerts.visibilityFailed',
                    ),
                    { variant: 'dismissible', title: 'Oops!' },
                  );
                  return EMPTY;
                }),
              ),
          ),
        ),
      ),

      changeFriendlyName: rxMethod<{ id: string; friendlyName: string }>(
        pipe(
          tap(({ id }) => {
            const currentIds = new Set(store.changeNameLoadingIds());
            currentIds.add(id);
            patchState(store, {
              changeNameLoadingIds: currentIds,
              error: null,
              successMessage: null,
            });
          }),
          switchMap(({ id, friendlyName }) =>
            service
              .updateAccountFriendlyName({
                accountId: id,
                friendlyName: friendlyName,
              })
              .pipe(
                tap(() => {
                  const currentIds = new Set(store.changeNameLoadingIds());
                  currentIds.delete(id);
                  const accounts =
                    store
                      .accounts()
                      ?.map((account) =>
                        account.id === id
                          ? { ...account, friendlyName }
                          : account,
                      ) ?? null;
                  patchState(store, {
                    accounts,
                    changeNameLoadingIds: currentIds,
                  });
                  alertService.success(
                    translate.instant(
                      'settings.accounts.storeAlerts.nameSuccess',
                    ),
                    { variant: 'dismissible', title: 'Oops!' },
                  );
                  globalStore.dispatch(
                    AccountsActions.loadAccounts({ forceRefresh: true }),
                  );
                }),
                catchError(() => {
                  const currentIds = new Set(store.changeNameLoadingIds());
                  currentIds.delete(id);
                  patchState(store, {
                    changeNameLoadingIds: currentIds,
                  });
                  alertService.error(
                    translate.instant(
                      'settings.accounts.storeAlerts.nameFailed',
                    ),
                    { variant: 'dismissible', title: 'Oops!' },
                  );
                  return EMPTY;
                }),
              ),
          ),
        ),
      ),
    };
  }),
);
