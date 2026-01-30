import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { FetchParams, NotificationsState } from '../models/notification.model';
import { inject } from '@angular/core';
import { Notifications } from '../service/notifications';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

export const initialState: NotificationsState = {
  items: [],
  pageInfo: {
    hasNext: false,
    nextCursor: '',
  },
  hasUnread: false,
  isLoading: false,
  isFetching: false,
  hasError: false,
  limitPerPage: 10,
  unreadNotificationsNumber: 0,
  isEmpty: true,
};

export const NotificationsStore = signalStore(
  withState(initialState),
  withMethods((store) => {
    const notificationsService = inject(Notifications);
    return {
      hasUnreadNotifications: rxMethod<void>(
        pipe(
          switchMap(() =>
            notificationsService.hasUnreadNotification().pipe(
              tap((response) => {
                patchState(store, {
                  hasUnread: response.hasUnread,
                });
              }),
            ),
          ),
        ),
      ),

      fetchNotifications: rxMethod<FetchParams>(
        pipe(
          tap(({ cursor }) => {
            cursor
              ? patchState(store, {
                  isFetching: true,
                })
              : patchState(store, {
                  isLoading: true,
                });
          }),
          switchMap(({ cursor, limit = 10 }) => {
            return notificationsService.getNotifications(cursor, limit).pipe(
              tap({
                next: (response) => {
                  const updatedItems = cursor
                    ? [...store.items(), ...response.items]
                    : response.items;
                  patchState(store, {
                    items: updatedItems,
                    pageInfo: response.pageInfo,
                    isLoading: false,
                    isFetching: false,
                    isEmpty: false,
                    unreadNotificationsNumber: updatedItems.filter(
                      (item) => !item.isRead,
                    ).length,
                  });
                },
                error: () =>
                  patchState(store, { hasError: true, isLoading: false }),
              }),
            );
          }),
        ),
      ),

      deleteNotification: rxMethod<string>(
        pipe(
          tap(() => {
            patchState(store, {
              isLoading: true,
            });
          }),
          switchMap((id) => {
            return notificationsService.removeNotification(id).pipe(
              tap({
                next: () => {
                  const updatedItems = store
                    .items()
                    .filter((item) => item.id !== id);
                  patchState(store, {
                    items: updatedItems,
                    unreadNotificationsNumber: updatedItems.filter(
                      (item) => !item.isRead,
                    ).length,
                    isLoading: false,
                  });
                },
                error: () => patchState(store, { hasError: true }),
              }),
            );
          }),
        ),
      ),

      markAllAsRead: rxMethod<void>(
        pipe(
          tap(() => {
            patchState(store, {
              isLoading: true,
            });
          }),
          switchMap(() => {
            return notificationsService.markAllAsRead().pipe(
              tap({
                next: () => {
                  patchState(store, {
                    items: store
                      .items()
                      .map((item) => ({ ...item, isRead: true })),
                    isLoading: false,
                    hasUnread: false,
                    unreadNotificationsNumber: 0,
                  });
                },
                error: () => patchState(store, { hasError: true }),
              }),
            );
          }),
        ),
      ),

      deleteAll: rxMethod<void>(
        pipe(
          tap(() => {
            patchState(store, {
              isLoading: true,
            });
          }),
          switchMap(() => {
            return notificationsService.deleteAll().pipe(
              tap({
                next: () => {
                  patchState(store, {
                    items: [],
                    hasUnread: false,
                    unreadNotificationsNumber: 0,
                    isEmpty: true,
                    isLoading: false,
                  });
                },
                error: () => patchState(store, { hasError: true }),
              }),
            );
          }),
        ),
      ),

      markItemRead: rxMethod<string>(
        pipe(
          switchMap((id) => {
            return notificationsService.markNotificationRead(id).pipe(
              tap({
                next: () => {
                  const updatedItems = store
                    .items()
                    .map((item) =>
                      item.id === id ? { ...item, isRead: true } : item,
                    );
                  patchState(store, {
                    items: updatedItems,
                    hasUnread: updatedItems.some((item) => !item.isRead),
                    unreadNotificationsNumber: updatedItems.filter(
                      (item) => !item.isRead,
                    ).length,
                  });
                },
                error: () => patchState(store, { hasError: true }),
              }),
            );
          }),
        ),
      ),
    };
  }),
);
