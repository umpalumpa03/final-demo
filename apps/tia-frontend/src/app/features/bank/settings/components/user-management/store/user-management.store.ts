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
  delay,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { UserManagementService } from '../shared/services/user-management.service';
import {
  initialState,
  UserErrorKeys,
  UserSuccessKeys,
} from './user-management.state';
import { IUpdateUserRequest } from '../shared/models/users.model';
import { ProfilePhotoApiService } from '@tia/shared/services/profile-photo/profile-photo.service';
import { AlertService } from '@tia/core/services/alert/alert.service';

export const UserManagementStore = signalStore(
  withState(initialState),

  withComputed((store) => ({
    userCount: computed(() => store.users().length),
  })),

  withMethods((store) => {
    const service = inject(UserManagementService);
    const avatarService = inject(ProfilePhotoApiService);
    const alertService = inject(AlertService);
    const translate = inject(TranslateService);

    const _triggerAutoHide = rxMethod<void>(
      pipe(
        delay(3000),
        tap(() => patchState(store, { error: null })),
      ),
    );

    const handleError = (
      err: any,
      key: string,
      shouldAutoHide: boolean = true,
    ) => {
      if (err.status === 0) {
        const networkMsg = translate.instant(UserErrorKeys.NETWORK_ERROR);

        patchState(store, {
          error: networkMsg,
          loading: false,
          actionLoading: false,
        });

        alertService.showAlert('error', networkMsg);
        if (shouldAutoHide) {
          _triggerAutoHide();
        }
        return EMPTY;
      }

      const backendMsg = err?.error?.message || err?.message;
      const translatedKey = translate.instant(key);
      const displayMsg = backendMsg || translatedKey;

      patchState(store, {
        error: displayMsg,
        loading: false,
        actionLoading: false,
      });

      alertService.showAlert('error', displayMsg);
      _triggerAutoHide();
      return EMPTY;
    };

    return {
      _triggerAutoHide,

      loadUsers: rxMethod<{ force?: boolean }>(
        pipe(
          tap(({ force }) => {
            if (!force && store.users().length > 0) return;

            patchState(store, { loading: true, error: null });
          }),
          filter(({ force }) => force === true || store.users().length === 0),
          switchMap(() =>
            service.getAllUsers().pipe(
              tap((users) => patchState(store, { users, loading: false })),
              catchError((err) =>
                handleError(err, UserErrorKeys.LOAD_USERS, false),
              ),
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
              catchError((err) => handleError(err, UserErrorKeys.LOAD_DETAILS)),
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

                const msg = translate.instant(UserSuccessKeys.DELETE);
                alertService.showAlert('success', msg);
              }),
              catchError((err) => handleError(err, UserErrorKeys.DELETE)),
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

                const msg = translate.instant(UserSuccessKeys.UPDATE);
                alertService.showAlert('success', msg);
              }),
              catchError((err) => handleError(err, UserErrorKeys.UPDATE)),
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

                const key = updatedUser.isBlocked
                  ? UserSuccessKeys.BLOCK
                  : UserSuccessKeys.UNBLOCK;
                const msg = translate.instant(key);
                alertService.showAlert('success', msg);
              }),
              catchError((err: HttpErrorResponse) => {
                const msg = translate.instant(UserErrorKeys.BLOCK);
                patchState(store, { error: err.message || msg });
                alertService.showAlert('error', err.message || msg);
                _triggerAutoHide();
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
