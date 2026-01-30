import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { FetchParams, NotificationsState } from '../models/notification.model';
import { computed, inject } from '@angular/core';
import { Notifications } from '../service/notifications';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, forkJoin, pipe, switchMap, tap } from 'rxjs';
import { items } from 'apps/tia-frontend/src/app/features/storybook/components/drag-and-drop/config/draggable-data.config';

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
  withComputed((store) => ({
    unreadNotificationsNumber: computed(
      () => store.items().filter((item) => !item.isRead).length,
    ),
    isEmpty: computed(() => !store.isLoading() && store.items().length === 0),
  })),
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
                    isLoading: false,
                  });
                },
                error: () => patchState(store, { hasError: true }),
              }),
            );
          }),
        ),
      ),

      markItemsRead: rxMethod<string[]>(
        pipe(
          filter((ids) => ids.length > 0),
          tap((ids) => {
            const updatedItems = store
              .items()
              .map((item) =>
                ids.includes(item.id) ? { ...item, isRead: true } : item,
              );

            patchState(store, {
              items: updatedItems,
              unreadNotificationsNumber: updatedItems.filter(
                (item) => !item.isRead,
              ).length,
              hasUnread: updatedItems.some((item) => !item.isRead),
            });
          }),
          switchMap((ids) =>
            // Send API calls in parallel
            forkJoin(
              ids.map((id) => notificationsService.markNotificationRead(id)),
            ).pipe(
              tap({
                next: () => {
                  // Already updated UI, nothing more to do
                },
                error: () => patchState(store, { hasError: true }),
              }),
            ),
          ),
        ),
      ),
    };
  }),
);
