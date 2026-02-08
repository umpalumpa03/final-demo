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
import { toObservable } from '@angular/core/rxjs-interop';

export const initialState: NotificationsState = {
  items: [],
  selectedItems: [],
  pageInfo: {
    hasNext: false,
    nextCursor: '',
  },
  hasUnread: false,
  unreadCount: 0,
  isLoading: false,
  isFetching: false,
  hasError: false,
  limitPerPage: 10,

  notificationsLoaded: false,
  unreadCountLoaded: false,
  hasUnreadLoaded: false,
};

export const NotificationsStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
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
    const notificationsLoaded$ = toObservable(store.notificationsLoaded);
    const unreadCountLoaded$ = toObservable(store.unreadCountLoaded);
    const hasUnreadLoaded$ = toObservable(store.hasUnreadLoaded);

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

      fetchUnreadCount: rxMethod<void>(
        pipe(
          switchMap(() =>
            notificationsService.getUnreadCount().pipe(
              tap((response) => {
                console.log(response);
              }),
              tap((response) => {
                patchState(store, {
                  unreadCount: response.count,
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
                  const deletedItem = store
                    .items()
                    .find((item) => item.id === id);
                  const wasUnread = deletedItem && !deletedItem.isRead;
                  const updatedItems = store
                    .items()
                    .filter((item) => item.id !== id);
                  patchState(store, {
                    items: updatedItems,
                    isLoading: false,
                    selectedItems: store
                      .selectedItems()
                      .filter((itemId) => itemId !== id),
                    unreadCount: wasUnread
                      ? Math.max(0, store.unreadCount() - 1)
                      : store.unreadCount(),
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
                    unreadCount: 0,
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
            const unreadBeingMarked = store
              .items()
              .filter((item) => ids.includes(item.id) && !item.isRead).length;
            const updatedItems = store
              .items()
              .map((item) =>
                ids.includes(item.id) ? { ...item, isRead: true } : item,
              );
            patchState(store, {
              items: updatedItems,
              hasUnread: updatedItems.some((item) => !item.isRead),
              unreadCount: Math.max(0, store.unreadCount() - unreadBeingMarked),
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
                  const unreadBeingDeleted = store
                    .items()
                    .filter(
                      (item) => ids.includes(item.id) && !item.isRead,
                    ).length;

                  const updatedItems = store
                    .items()
                    .filter((item) => !ids.includes(item.id));
                  patchState(store, {
                    items: updatedItems,
                    isLoading: false,
                    selectedItems: [],
                    hasUnread: updatedItems.some((item) => !item.isRead),
                    unreadCount: Math.max(
                      0,
                      store.unreadCount() - unreadBeingDeleted,
                    ),
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
