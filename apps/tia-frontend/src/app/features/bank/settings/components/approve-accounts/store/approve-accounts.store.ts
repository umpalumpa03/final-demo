import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ApproveAccountsApiService } from '../service/approve-accounts.api.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';
import { initialStateAccountPermissions } from './config/aprove-accounts.state';
import { HttpErrorResponse } from '@angular/common/http';
import { IUpdateAccountStatus } from '../../../shared/models/approve-models/accounts-models/pending-accounts.models';
import { IUpdateAccountPermission } from '../../../shared/models/approve-models/accounts-models/account-permissions.models';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';

export const AccountPermissionsStore = signalStore(
  withState(initialStateAccountPermissions),

  withComputed((store) => ({
    pendingAccountsCount: computed(() => store.pendingAccounts().length),
    selectedAccount: computed(() =>
      store
        .pendingAccounts()
        .find((acc) => acc.id === store.selectedAccountId()),
    ),
  })),

  withMethods(
    (
      store,
      apiService = inject(ApproveAccountsApiService),
      alertService = inject(AlertService),
      translate = inject(TranslateService),
    ) => ({
      loadPermissions: rxMethod<void>(
        pipe(
          switchMap(() => {
            if (store.permissions().length > 0) return EMPTY;

            patchState(store, { isLoading: true, error: null });
            return apiService.getAccountPermissions().pipe(
              tap((permissions) =>
                patchState(store, { permissions, isLoading: false }),
              ),
              catchError((err: HttpErrorResponse) => {
                patchState(store, { isLoading: false, error: err.message });
                return EMPTY;
              }),
            );
          }),
        ),
      ),

      loadPendingAccounts: rxMethod<void>(
        pipe(
          switchMap(() => {
            if (store.pendingAccounts().length > 0) return EMPTY;

            patchState(store, { isLoading: true, error: null });
            return apiService.getPendingAccounts().pipe(
              tap((accounts) =>
                patchState(store, {
                  pendingAccounts: [...accounts].reverse(),
                  isLoading: false,
                }),
              ),
              catchError((err: HttpErrorResponse) => {
                patchState(store, { isLoading: false, error: err.message });
                return EMPTY;
              }),
            );
          }),
        ),
      ),

      updateStatus: rxMethod<IUpdateAccountStatus>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((payload) =>
            apiService.updateAccountStatus(payload).pipe(
              tap(() => {
                const updatedList = store
                  .pendingAccounts()
                  .filter((a) => a.id !== payload.accountId);
                patchState(store, {
                  pendingAccounts: updatedList,
                  isLoading: false,
                });

                const messageKey =
                  payload.updatedStatus === 'active'
                    ? 'settings.approve-accounts.alerts.approved_success'
                    : 'settings.approve-accounts.alerts.declined_success';

                alertService.success(translate.instant(messageKey), {
                  variant: 'dismissible',
                  title: translate.instant(
                    payload.updatedStatus === 'active' ? 'Success' : 'Info',
                  ),
                });
              }),
              catchError((err: HttpErrorResponse) => {
                patchState(store, { isLoading: false, error: err.message });
                return EMPTY;
              }),
            ),
          ),
        ),
      ),

      savePermissions: rxMethod<IUpdateAccountPermission>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((payload) =>
            apiService.modifyAccountPermissions(payload).pipe(
              tap(() => {
                patchState(store, { isLoading: false });

                alertService.success(
                  translate.instant(
                    'settings.approve-accounts.alerts.permissions_saved',
                  ),
                  {
                    variant: 'dismissible',
                    title: translate.instant('Success'),
                  },
                );
              }),
              catchError((err: HttpErrorResponse) => {
                patchState(store, { isLoading: false, error: err.message });
                return EMPTY;
              }),
            ),
          ),
        ),
      ),

      selectAccount(accountId: string | null): void {
        patchState(store, { selectedAccountId: accountId });
      },
    }),
  ),
);
