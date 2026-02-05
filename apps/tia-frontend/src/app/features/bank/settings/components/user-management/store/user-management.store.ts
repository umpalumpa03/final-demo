import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject, computed } from '@angular/core';
import { pipe, switchMap, tap, catchError, of, map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UserManagementService } from '../shared/services/user-management.service';
import { initialState } from './user-management.state';
import { IUpdateUserRequest } from '../shared/models/users.model';
import { ProfilePhotoApiService } from '@tia/shared/services/profile-photo/profile-photo.service';

export const UserManagementStore = signalStore(
  withState(initialState),

  withComputed((store) => ({
    userCount: computed(() => store.users().length),
  })),

  withMethods((store) => {
    const userManagementService = inject(UserManagementService);
    const avatarService = inject(ProfilePhotoApiService);

    return {
      loadUsers: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(() =>
            userManagementService.getAllUsers().pipe(
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
            userManagementService.getUserById(userId).pipe(
              switchMap((user) => {
                if (!user.avatar) {
                  return of({ ...user, avatarUrl: null });
                }

                return avatarService.getCurrentUserAvatar(user.avatar).pipe(
                  map((blob: Blob) => {
                    const objectUrl = URL.createObjectURL(blob);

                    return {
                      ...user,
                      avatarUrl: objectUrl,
                    };
                  }),

                  catchError(() => {
                    return of({ ...user, avatarUrl: null });
                  }),
                );
              }),

              tap((fullUserData) => {
                patchState(store, {
                  selectedUser: fullUserData,
                  actionLoading: false,
                });
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
            userManagementService.deleteUser(id).pipe(
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

      updateUser: rxMethod<{ id: string; data: IUpdateUserRequest }>(
        pipe(
          tap(() => patchState(store, { actionLoading: true, error: null })),
          switchMap(({ id, data }) =>
            userManagementService.updateUser(id, data).pipe(
              tap((updatedUser) => {
                patchState(store, (state) => ({
                  users: state.users.map((u) =>
                    u.id === updatedUser.id ? updatedUser : u,
                  ),
                  selectedUser: updatedUser,
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

      toggleBlockStatus: rxMethod<{ id: string; isBlocked: boolean }>(
        pipe(
          tap(() => patchState(store, { actionLoading: true, error: null })),
          switchMap(({ id, isBlocked }) =>
            userManagementService.blockUser(id, isBlocked).pipe(
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
    };
  }),
);
