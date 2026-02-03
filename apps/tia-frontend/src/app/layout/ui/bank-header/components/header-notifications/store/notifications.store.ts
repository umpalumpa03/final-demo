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

export const initialState: NotificationsState = {
  items: [],
  selectedItems: [],
  pageInfo: {
    hasNext: false,
    nextCursor: '',
  },
  hasUnread: false,
  isLoading: false,
  isFetching: false,
  hasError: false,
  limitPerPage: 10,
};

export const NotificationsStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    unreadNotificationsNumber: computed(
      () => store.items().filter((item) => !item.isRead).length,
    ),
    isEmpty: computed(() => !store.isLoading() && store.items().length === 0),
    isAllSelected: computed(() => {
      return (
        store.items().length === store.selectedItems().length &&
        store.items().length > 0
      );
    }),
    isIndeterminate: computed(() => {
      const selectedCount = store.selectedItems().length;
      const totalCount = store.items().length;
      return selectedCount > 0 && selectedCount < totalCount;
    }),
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
                    selectedItems: [],
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
              hasUnread: updatedItems.some((item) => !item.isRead),
            });
          }),
          switchMap((ids) =>
            forkJoin(
              ids.map((id) => notificationsService.markNotificationRead(id)),
            ).pipe(
              tap({
                next: () => {},
                error: () => patchState(store, { hasError: true }),
              }),
            ),
          ),
        ),
      ),

      deleteMultiple: rxMethod<string[]>(
        pipe(
          tap(() => {
            patchState(store, {
              isLoading: true,
            });
          }),
          switchMap((ids) => {
            return notificationsService.deleteMultiple(ids).pipe(
              tap({
                next: () => {
                  const updatedItems = store
                    .items()
                    .filter((item) => !ids.includes(item.id));
                  patchState(store, {
                    items: updatedItems,
                    isLoading: false,
                    selectedItems: [],
                    hasUnread: updatedItems.some((item) => !item.isRead),
                  });

                  const { hasNext, nextCursor } = store.pageInfo();

                  if (updatedItems.length === 0 && hasNext) {
                    patchState(store, { isLoading: true });

                    notificationsService
                      .getNotifications(nextCursor, store.limitPerPage())
                      .subscribe({
                        next: (response) => {
                          patchState(store, {
                            items: response.items,
                            pageInfo: response.pageInfo,
                            isLoading: false,
                          });
                        },
                        error: () =>
                          patchState(store, {
                            hasError: true,
                            isLoading: false,
                          }),
                      });
                  }
                },
                error: () => patchState(store, { hasError: true }),
              }),
            );
          }),
        ),
      ),

      resetState(): void {
        patchState(store, () => initialState);
      },

      toggleSelectAll(): void {
        if (store.isAllSelected()) {
          patchState(store, { selectedItems: [] });
        } else {
          patchState(store, {
            selectedItems: store.items().map((item) => item.id),
          });
        }
      },

      toggleItemSelection(id: string): void {
        const currentSelected = store.selectedItems();
        const exists = currentSelected.includes(id);

        if (exists) {
          patchState(store, {
            selectedItems: currentSelected.filter((itemId) => itemId !== id),
          });
        } else {
          patchState(store, {
            selectedItems: [...currentSelected, id],
          });
        }
      },

      clearSelection(): void {
        patchState(store, { selectedItems: [] });
      },

      isItemSelected(id: string): boolean {
        return store.selectedItems().includes(id);
      },
    };
  }),
);
