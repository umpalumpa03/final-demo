import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject, computed } from '@angular/core';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UserManagementService } from '../shared/services/user-management.service';
import { initialState } from './user-management.state';

export const UserManagementStore = signalStore(
  withState(initialState),

  withComputed((store) => ({
    userCount: computed(() => store.users().length),
  })),

  withMethods((store, service = inject(UserManagementService)) => ({
    loadUsers: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          service.getAllUsers().pipe(
            tap((users) => {
              patchState(store, { users, loading: false });
            }),
            catchError((err: HttpErrorResponse) => {
              patchState(store, { loading: false, error: err.message });
              return of(null);
            }),
          ),
        ),
      ),
    ),

    loadUserDetails: rxMethod<string>(pipe()),

    updateUser: rxMethod<{ id: string; data: any }>(pipe()),

    deleteUser: rxMethod<string>(pipe()),

    toggleBlockStatus: rxMethod<{ id: string; isBlocked: boolean }>(pipe()),

    resetSelection() {
      patchState(store, { selectedUser: null, error: null });
    },
  })),
);
