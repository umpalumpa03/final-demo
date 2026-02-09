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

  withMethods((store, apiService = inject(ApproveAccountsApiService)) => ({
    loadPermissions: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() =>
          apiService.getAccountPermissions().pipe(
            tap({
              next: (permissions) => {
                patchState(store, {
                  permissions,
                  isLoading: false,
                });
              },
              error: (err: HttpErrorResponse) => {
                const errorMsg = err.message || 'Unknown Error';
                patchState(store, {
                  isLoading: false,
                  error: errorMsg,
                });
              },
            }),
            catchError(() => EMPTY),
          ),
        ),
      ),
    ),

    loadPendingAccounts: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() =>
          apiService.getPendingAccounts().pipe(
            tap({
              next: (accounts) =>
                patchState(store, {
                  isLoading: false,
                  pendingAccounts: accounts,
                }),
              error: (err: HttpErrorResponse) => {
                const errMsg = err.message || 'Unknown Error';
                patchState(store, {
                  isLoading: false,
                  error: errMsg,
                });
              },
            }),
            catchError(() => EMPTY),
          ),
        ),
      ),
    ),

    updateStatus: rxMethod<IUpdateAccountStatus>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((payload) =>
          apiService.updateAccountStatus(payload).pipe(
            tap({
              next: () => {
                const updatedList = store
                  .pendingAccounts()
                  .filter((a) => a.id !== payload.accountId);

                patchState(store, {
                  pendingAccounts: updatedList,
                  isLoading: false,
                });
              },
              error: (err: HttpErrorResponse) => {
                const errMsg = err.message || 'Unknown error';

                patchState(store, {
                  isLoading: false,
                  error: errMsg,
                });
              },
            }),
            catchError(() => EMPTY),
          ),
        ),
      ),
    ),

    savePermissions: rxMethod<IUpdateAccountPermission>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((payload) =>
          apiService.modifyAccountPermissions(payload).pipe(
            tap({
              next: () => {
                patchState(store, { isLoading: false });
              },
              error: (err: HttpErrorResponse) => {
                const errMsg = err.message || 'Unknown error';

                patchState(store, { isLoading: false, error: errMsg });
              },
            }),
            catchError(() => EMPTY),
          ),
        ),
      ),
    ),

    selectAccount(accountId: string | null): void {
      patchState(store, { selectedAccountId: accountId });
    },
  })),
  
);
