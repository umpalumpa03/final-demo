import {
  patchState,
  signalStore,
  withMethods,
  withState,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, EMPTY } from 'rxjs';
import { AccountManagementService } from '../services/acount-management.service';
import { initialState } from './accounts.state';

export const AccountsStore = signalStore(
  withState(initialState),

  withMethods((store, service = inject(AccountManagementService)) => ({
    loadAccounts: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          service.getAllAccounts().pipe(
            tap((accounts) =>
              patchState(store, { accounts, loading: false }),
            ),
            catchError(() => {
              patchState(store, {
                accounts: [],
                loading: false,
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
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ id, isFavorite }) =>
          service.toggleFavorite(id, isFavorite).pipe(
            switchMap(() => service.getAllAccounts()),
            tap((accounts) =>
              patchState(store, { accounts, loading: false }),
            ),
            catchError(() => {
              patchState(store, {
                loading: false,
                error: 'Failed to update favorite status',
              });
              return EMPTY;
            }),
          ),
        ),
      ),
    ),

    toggleVisibility: rxMethod<{ id: string; isHidden: boolean | null }>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(({ id, isHidden }) =>
          service.toggleVisibility(id, isHidden).pipe(
            switchMap(() => service.getAllAccounts()),
            tap((accounts) =>
              patchState(store, { accounts, loading: false }),
            ),
            catchError(() => {
              patchState(store, {
                loading: false,
                error: 'Failed to update visibility',
              });
              return EMPTY;
            }),
          ),
        ),
      ),
    ),
  })),
);
