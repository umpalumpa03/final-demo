import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject, computed } from '@angular/core';
import {
  pipe,
  switchMap,
  tap,
  catchError,
  of,
  map,
  mergeMap,
  finalize,
  filter,
  EMPTY,
} from 'rxjs';
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
    const service = inject(UserManagementService);
    const avatarService = inject(ProfilePhotoApiService);

    return {
      loadUsers: rxMethod<void>(
        pipe(
          filter(() => store.users().length === 0 && !store.loading()),
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(() =>
            service.getAllUsers().pipe(
              tap((users) => {
                patchState(store, { users, loading: false });
              }),
              catchError((err: HttpErrorResponse) => {
                patchState(store, { loading: false, error: err.message });
                return EMPTY;
              }),
            ),
          ),
        ),
      ),

      loadUserDetails: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { actionLoading: true, error: null })),
          switchMap((userId) => {
            const cachedUser = store.userCache()[userId];
            if (cachedUser) {
              patchState(store, {
                selectedUser: cachedUser,
                actionLoading: false,
              });
              return EMPTY;
            }

            return service.getUserById(userId).pipe(
              switchMap((user) => {
                if (!user.avatar) {
                  return of({ ...user, avatarUrl: null });
                }

                return avatarService.getCurrentUserAvatar(user.avatar).pipe(
                  map((blob: Blob) => {
                    const objectUrl = URL.createObjectURL(blob);
                    return { ...user, avatarUrl: objectUrl };
                  }),
                  catchError(() => {
                    return of({ ...user, avatarUrl: null });
                  }),
                );
              }),
              tap((fullUserData) => {
                patchState(store, (state) => ({
                  selectedUser: fullUserData,
                  actionLoading: false,
                  userCache: { ...state.userCache, [userId]: fullUserData },
                }));
              }),
              catchError((err: HttpErrorResponse) => {
                patchState(store, { actionLoading: false, error: err.message });
                return EMPTY;
              }),
            );
          }),
        ),
      ),

      deleteUser: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { actionLoading: true, error: null })),
          switchMap((id) =>
            service.deleteUser(id).pipe(
              tap(() => {
                const currentUsers = store.users();
                patchState(store, (state) => {
                  const { [id]: removed, ...remainingCache } = state.userCache;

                  return {
                    users: currentUsers.filter((u) => u.id !== id),
                    userCache: remainingCache,
                    actionLoading: false,
                  };
                });
              }),
              catchError((err: HttpErrorResponse) => {
                patchState(store, {
                  actionLoading: false,
                  error: err.message,
                });
                return EMPTY;
              }),
            ),
          ),
        ),
      ),

      updateUser: rxMethod<{ id: string; data: IUpdateUserRequest }>(
        pipe(
          tap(() => patchState(store, { actionLoading: true, error: null })),
          switchMap(({ id, data }) =>
            service.updateUser(id, data).pipe(
              tap((updatedUser) => {
                patchState(store, (state) => {
                  const { [updatedUser.id]: removed, ...remainingCache } =
                    state.userCache;

                  return {
                    users: state.users.map((u) =>
                      u.id === updatedUser.id ? updatedUser : u,
                    ),
                    selectedUser: updatedUser,
                    actionLoading: false,
                    userCache: remainingCache,
                  };
                });
              }),
              catchError((err: HttpErrorResponse) => {
                patchState(store, {
                  actionLoading: false,
                  error: err.message,
                });
                return EMPTY;
              }),
            ),
          ),
        ),
      ),

      toggleBlockStatus: rxMethod<{ id: string; isBlocked: boolean }>(
        pipe(
          mergeMap(({ id, isBlocked }) => {
            patchState(store, (state) => ({
              processingIds: [...state.processingIds, id],
            }));

            return service.blockUser(id, isBlocked).pipe(
              tap((updatedUser) => {
                const users = store
                  .users()
                  .map((u) =>
                    u.id === id
                      ? { ...u, isBlocked: updatedUser.isBlocked }
                      : u,
                  );

                patchState(store, (state) => {
                  const { [updatedUser.id]: removed, ...remainingCache } =
                    state.userCache;

                  const currentSelected = state.selectedUser;
                  const updatedSelected =
                    currentSelected && currentSelected.id === id
                      ? {
                          ...currentSelected,
                          isBlocked: updatedUser.isBlocked,
                        }
                      : currentSelected;

                  return {
                    users,
                    userCache: remainingCache,
                    selectedUser: updatedSelected,
                  };
                });
              }),
              catchError((err: HttpErrorResponse) => {
                patchState(store, { error: err.message });
                return EMPTY;
              }),
              finalize(() => {
                patchState(store, (state) => ({
                  processingIds: state.processingIds.filter(
                    (pid) => pid !== id,
                  ),
                }));
              }),
            );
          }),
        ),
      ),

      clearSelectedUser() {
        patchState(store, { selectedUser: null });
      },

      resetSelection() {
        patchState(store, { selectedUser: null, error: null });
      },

      reset() {
        patchState(store, initialState);
      },
    };
  }),
);
