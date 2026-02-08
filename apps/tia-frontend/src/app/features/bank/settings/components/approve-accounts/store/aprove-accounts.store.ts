import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ApproveAccountsApiService } from '../service/approve-accounts.api.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';
import { initialStateAccountPermissions } from './config/aprove-accounts.state';
import { HttpErrorResponse } from '@angular/common/http';

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
  })),
  
);
