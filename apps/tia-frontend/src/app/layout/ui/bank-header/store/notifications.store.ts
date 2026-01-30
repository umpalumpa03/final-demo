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
  hasError: false,
  limitPerPage: 10,
  unreadNotificationsNumber: 0,
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
          tap(() => {
            patchState(store, {
              isLoading: true,
            });
          }),
          switchMap(({ cursor, limit = 10 }) => {
            return notificationsService.getNotifications(cursor, limit).pipe(
              tap({
                next: (response) => {
                  patchState(store, {
                    items: cursor
                      ? [...store.items(), ...response.items]
                      : response.items,
                    pageInfo: response.pageInfo,
                    isLoading: false,
                    unreadNotificationsNumber: response.items.filter(
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
          switchMap((id) => {
            return notificationsService.removeNotification(id).pipe(
              tap({
                next: () => {
                  patchState(store, {
                    items: store.items().filter((item) => item.id !== id),
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
          switchMap(() => {
            return notificationsService.markAllAsRead().pipe(
              tap({
                next: () => {
                  patchState(store, {
                    items: store
                      .items()
                      .map((item) => ({ ...item, isRead: true })),
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
