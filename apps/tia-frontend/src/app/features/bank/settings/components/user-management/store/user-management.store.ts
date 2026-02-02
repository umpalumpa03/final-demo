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
import { IUpdateUserRequest } from '../shared/models/users.model';

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

    loadUserDetails: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { actionLoading: true, error: null })),
        switchMap((userId) =>
          service.getUserById(userId).pipe(
            tap((user) => {
              patchState(store, { selectedUser: user, actionLoading: false });
            }),

            catchError((err: HttpErrorResponse) => {
              patchState(store, { actionLoading: false, error: err.message });
              return of(null);
            }),
          ),
        ),
      ),
    ),

    deleteUser: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { actionLoading: true, error: null })),

        switchMap((id) =>
          service.deleteUser(id).pipe(
            tap(() => {
              const currentUsers = store.users();
              const updatedUsers = currentUsers.filter((u) => u.id !== id);

              patchState(store, {
                users: updatedUsers,
                actionLoading: false,
              });
            }),

            catchError((err: HttpErrorResponse) => {
              patchState(store, {
                actionLoading: false,
                error: err.message,
              });
              return of(null);
            }),
          ),
        ),
      ),
    ),

    updateUser: rxMethod<{ id: string; data: IUpdateUserRequest }>(pipe()),

    toggleBlockStatus: rxMethod<{ id: string; isBlocked: boolean }>(
      pipe(
        tap(() => patchState(store, { actionLoading: true, error: null })),
        switchMap(({ id, isBlocked }) =>
          service.blockUser(id, isBlocked).pipe(
            tap((updatedUser) => {
              patchState(store, (state) => ({
                users: state.users.map((u) =>
                  u.id === updatedUser.id ? updatedUser : u,
                ),
                actionLoading: false,
              }));
            }),
            catchError((err: HttpErrorResponse) => {
              patchState(store, {
                actionLoading: false,
                error: err.message,
              });
              return of(null);
            }),
          ),
        ),
      ),
    ),

    clearSelectedUser() {
      patchState(store, { selectedUser: null });
    },

    resetSelection() {
      patchState(store, { selectedUser: null, error: null });
    },
  })),
);
