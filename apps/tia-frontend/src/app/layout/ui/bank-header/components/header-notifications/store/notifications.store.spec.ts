import { TestBed } from '@angular/core/testing';
import { NotificationsStore } from './notifications.store';
import { Notifications } from '../service/notifications';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('NotificationsStore', () => {
  let store: any;
  let notificationsServiceMock: any;

  beforeEach(() => {
    notificationsServiceMock = {
      hasUnreadNotification: vi.fn(() => of({ hasUnread: true })),
      getNotifications: vi.fn(() =>
        of({
          items: [{ id: '1', isRead: false }],
          pageInfo: { hasNext: false },
        }),
      ),
      removeNotification: vi.fn(() => of(null)),
      markAllAsRead: vi.fn(() => of(null)),
      deleteAll: vi.fn(() => of(null)),
      markNotificationRead: vi.fn(() => of(null)),
      deleteMultiple: vi.fn(() => of(null)),
    };

    TestBed.configureTestingModule({
      providers: [
        NotificationsStore,
        { provide: Notifications, useValue: notificationsServiceMock },
      ],
    });

    store = TestBed.inject(NotificationsStore);
  });

  it('should have initial state', () => {
    expect(store.items()).toEqual([]);
    expect(store.isLoading()).toBe(false);
    expect(store.isEmpty()).toBe(true);
  });

  it('should fetch notifications and update state', () => {
    store.fetchNotifications({ cursor: '', limit: 10 });

    expect(store.items().length).toBe(1);
    expect(store.isLoading()).toBe(false);
    expect(store.isEmpty()).toBe(false);
  });

  it('should compute unreadNotificationsNumber correctly', () => {
    store.fetchNotifications({ cursor: '', limit: 10 });
    expect(store.unreadNotificationsNumber()).toBe(1);
  });

  it('should toggle item selection', () => {
    store.toggleItemSelection('1');
    expect(store.selectedItems()).toContain('1');
    expect(store.isItemSelected('1')).toBe(true);

    store.toggleItemSelection('1');
    expect(store.selectedItems()).not.toContain('1');
  });

  it('should toggle select all', () => {
    store.fetchNotifications({ cursor: '', limit: 10 });
    store.toggleSelectAll();
    expect(store.isAllSelected()).toBe(true);

    store.toggleSelectAll();
    expect(store.selectedItems().length).toBe(0);
  });

  it('should delete a notification', () => {
    store.fetchNotifications({ cursor: '', limit: 10 });
    store.deleteNotification('1');

    expect(notificationsServiceMock.removeNotification).toHaveBeenCalledWith(
      '1',
    );
    expect(store.items().length).toBe(0);
  });

  it('should mark items as read', () => {
    store.fetchNotifications({ cursor: '', limit: 10 });
    store.markItemsRead(['1']);

    expect(notificationsServiceMock.markNotificationRead).toHaveBeenCalledWith(
      '1',
    );
    expect(store.unreadNotificationsNumber()).toBe(0);
  });

  it('should append items when fetching with a cursor', () => {
    store.fetchNotifications({ cursor: '', limit: 10 });

    notificationsServiceMock.getNotifications.mockReturnValue(
      of({ items: [{ id: '2', isRead: false }], pageInfo: { hasNext: false } }),
    );

    store.fetchNotifications({ cursor: 'next-page-token', limit: 10 });

    expect(store.items().length).toBe(2);
    expect(store.items()[1].id).toBe('2');
  });

  it('should clear all items and selection when deleteAll is called', () => {
    store.fetchNotifications({ cursor: '', limit: 10 });
    store.toggleItemSelection('1');

    store.deleteAll();

    expect(notificationsServiceMock.deleteAll).toHaveBeenCalled();
    expect(store.items().length).toBe(0);
    expect(store.selectedItems().length).toBe(0);
  });
  it('should delete multiple selected items', () => {
    notificationsServiceMock.getNotifications.mockReturnValue(
      of({ items: [{ id: '1' }, { id: '2' }], pageInfo: { hasNext: false } }),
    );
    store.fetchNotifications({ cursor: '', limit: 10 });

    store.deleteMultiple(['1', '2']);

    expect(notificationsServiceMock.deleteMultiple).toHaveBeenCalledWith([
      '1',
      '2',
    ]);
    expect(store.items().length).toBe(0);
  });

  it('should not call the service if markItemsRead is called with empty array', () => {
    store.markItemsRead([]);
    expect(
      notificationsServiceMock.markNotificationRead,
    ).not.toHaveBeenCalled();
  });
  it('should clear selection when clearSelection is called', () => {
    store.toggleItemSelection('1');
    store.clearSelection();
    expect(store.selectedItems().length).toBe(0);
  });

  it('should fetch and update hasUnread state', () => {
    store.hasUnreadNotifications();
    expect(notificationsServiceMock.hasUnreadNotification).toHaveBeenCalled();
    expect(store.hasUnread()).toBe(true);
  });

  it('should set hasUnread to false when no unread notifications', () => {
    notificationsServiceMock.hasUnreadNotification.mockReturnValue(
      of({ hasUnread: false }),
    );
    store.hasUnreadNotifications();
    expect(store.hasUnread()).toBe(false);
  });

  it('should set hasUnread to false after deleteAll', () => {
    store.fetchNotifications({ cursor: '', limit: 10 });
    store.deleteAll();

    expect(store.hasUnread()).toBe(false);
  });
});
