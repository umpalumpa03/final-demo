import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ApproveAccountsApiService } from '../service/approve-accounts.api.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { initialStateAccountPermissions } from './config/aprove-accounts.state';

export const AccountPermissionsStore = signalStore(
  withState(initialStateAccountPermissions),

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
              error: (err: string) => {
                console.log(err);
                patchState(store, {
                  isLoading: false,
                  error: err,
                });
              },
            }),
          ),
        ),
      ),
    ),
  })),
);
