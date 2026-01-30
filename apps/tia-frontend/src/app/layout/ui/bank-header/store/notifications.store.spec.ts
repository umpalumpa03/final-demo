import { TestBed } from '@angular/core/testing';
import { NotificationsStore } from './notifications.store';
import { Notifications } from '../service/notifications';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('NotificationsStore', () => {
  let store: InstanceType<typeof NotificationsStore>;
  let mockNotificationsService: any;

  const mockItems = [
    { id: '1', title: 'Notification 1', isRead: false },
    { id: '2', title: 'Notification 2', isRead: true },
    { id: '3', title: 'Notification 3', isRead: false },
  ];

  beforeEach(() => {
    mockNotificationsService = {
      hasUnreadNotification: vi.fn(),
      getNotifications: vi.fn(),
      removeNotification: vi.fn(),
      markAllAsRead: vi.fn(),
      markNotificationRead: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        NotificationsStore,
        { provide: Notifications, useValue: mockNotificationsService },
      ],
    });

    store = TestBed.inject(NotificationsStore);
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(store.items()).toEqual([]);
      expect(store.pageInfo.hasNext()).toBe(false);
      expect(store.pageInfo.nextCursor()).toBe('');
      expect(store.hasUnread()).toBe(false);
      expect(store.isLoading()).toBe(false);
      expect(store.hasError()).toBe(false);
      expect(store.limitPerPage()).toBe(10);
      expect(store.unreadNotificationsNumber()).toBe(0);
    });
  });

  describe('hasUnreadNotifications', () => {
    it('should update hasUnread to true', () => {
      mockNotificationsService.hasUnreadNotification.mockReturnValue(
        of({ hasUnread: true }),
      );

      store.hasUnreadNotifications();

      expect(store.hasUnread()).toBe(true);
    });

    it('should update hasUnread to false', () => {
      mockNotificationsService.hasUnreadNotification.mockReturnValue(
        of({ hasUnread: false }),
      );

      store.hasUnreadNotifications();

      expect(store.hasUnread()).toBe(false);
    });
  });

  describe('fetchNotifications', () => {
    it('should update items on successful fetch', () => {
      mockNotificationsService.getNotifications.mockReturnValue(
        of({
          items: mockItems,
          pageInfo: { hasNext: true, nextCursor: 'cursor-123' },
        }),
      );

      store.fetchNotifications({ limit: 10 });

      expect(store.items()).toEqual(mockItems);
      expect(store.pageInfo.hasNext()).toBe(true);
      expect(store.pageInfo.nextCursor()).toBe('cursor-123');
      expect(store.isLoading()).toBe(false);
    });

    it('should append items when cursor is provided', () => {
      mockNotificationsService.getNotifications.mockReturnValue(
        of({
          items: mockItems.slice(0, 2),
          pageInfo: { hasNext: true, nextCursor: 'cursor-1' },
        }),
      );

      store.fetchNotifications({ limit: 10 });

      const newItems = [{ id: '4', title: 'New', isRead: false }];
      mockNotificationsService.getNotifications.mockReturnValue(
        of({
          items: newItems,
          pageInfo: { hasNext: false, nextCursor: '' },
        }),
      );

      store.fetchNotifications({ cursor: 'cursor-1', limit: 10 });

      expect(store.items()).toHaveLength(3);
    });

    it('should replace items when no cursor is provided', () => {
      mockNotificationsService.getNotifications.mockReturnValue(
        of({
          items: mockItems,
          pageInfo: { hasNext: false, nextCursor: '' },
        }),
      );

      store.fetchNotifications({ limit: 10 });

      const newItems = [{ id: '4', title: 'New', isRead: false }];
      mockNotificationsService.getNotifications.mockReturnValue(
        of({
          items: newItems,
          pageInfo: { hasNext: false, nextCursor: '' },
        }),
      );

      store.fetchNotifications({ limit: 10 });

      expect(store.items()).toEqual(newItems);
      expect(store.items()).toHaveLength(1);
    });

    it('should calculate unreadNotificationsNumber', () => {
      mockNotificationsService.getNotifications.mockReturnValue(
        of({
          items: mockItems,
          pageInfo: { hasNext: false, nextCursor: '' },
        }),
      );

      store.fetchNotifications({ limit: 10 });

      expect(store.unreadNotificationsNumber()).toBe(2);
    });

    it('should call service with correct parameters', () => {
      mockNotificationsService.getNotifications.mockReturnValue(
        of({
          items: [],
          pageInfo: { hasNext: false, nextCursor: '' },
        }),
      );

      store.fetchNotifications({ cursor: 'test-cursor', limit: 25 });

      expect(mockNotificationsService.getNotifications).toHaveBeenCalledWith(
        'test-cursor',
        25,
      );
    });
  });

  describe('deleteNotification', () => {
    beforeEach(() => {
      mockNotificationsService.getNotifications.mockReturnValue(
        of({
          items: mockItems,
          pageInfo: { hasNext: false, nextCursor: '' },
        }),
      );
      store.fetchNotifications({ limit: 10 });
    });

    it('should remove item from state on success', () => {
      mockNotificationsService.removeNotification.mockReturnValue(of({}));

      store.deleteNotification('1');

      expect(store.items().find((item) => item.id === '1')).toBeUndefined();
      expect(store.items()).toHaveLength(2);
    });

    it('should call service with correct id', () => {
      mockNotificationsService.removeNotification.mockReturnValue(of({}));

      store.deleteNotification('test-id');

      expect(mockNotificationsService.removeNotification).toHaveBeenCalledWith(
        'test-id',
      );
    });
  });

  describe('markAllAsRead', () => {
    beforeEach(() => {
      mockNotificationsService.getNotifications.mockReturnValue(
        of({
          items: mockItems,
          pageInfo: { hasNext: false, nextCursor: '' },
        }),
      );
      store.fetchNotifications({ limit: 10 });
    });

    it('should mark all items as read', () => {
      mockNotificationsService.markAllAsRead.mockReturnValue(of({}));

      store.markAllAsRead();

      expect(store.items().every((item) => item.isRead)).toBe(true);
    });

    it('should set hasUnread to false', () => {
      mockNotificationsService.markAllAsRead.mockReturnValue(of({}));

      store.markAllAsRead();

      expect(store.hasUnread()).toBe(false);
    });

    it('should set unreadNotificationsNumber to 0', () => {
      mockNotificationsService.markAllAsRead.mockReturnValue(of({}));

      store.markAllAsRead();

      expect(store.unreadNotificationsNumber()).toBe(0);
    });
  });

  describe('markItemRead', () => {
    beforeEach(() => {
      mockNotificationsService.getNotifications.mockReturnValue(
        of({
          items: mockItems,
          pageInfo: { hasNext: false, nextCursor: '' },
        }),
      );
      store.fetchNotifications({ limit: 10 });
    });

    it('should mark specific item as read', () => {
      mockNotificationsService.markNotificationRead.mockReturnValue(of({}));

      store.markItemRead('1');

      const item = store.items().find((i) => i.id === '1');
      expect(item?.isRead).toBe(true);
    });

    it('should not modify other items', () => {
      mockNotificationsService.markNotificationRead.mockReturnValue(of({}));

      store.markItemRead('1');

      const item2 = store.items().find((i) => i.id === '2');
      const item3 = store.items().find((i) => i.id === '3');
      expect(item2?.isRead).toBe(true);
      expect(item3?.isRead).toBe(false);
    });

    it('should update unreadNotificationsNumber', () => {
      mockNotificationsService.markNotificationRead.mockReturnValue(of({}));

      expect(store.unreadNotificationsNumber()).toBe(2);

      store.markItemRead('1');

      expect(store.unreadNotificationsNumber()).toBe(1);
    });

    it('should update hasUnread when items remain unread', () => {
      mockNotificationsService.markNotificationRead.mockReturnValue(of({}));

      store.markItemRead('1');

      expect(store.hasUnread()).toBe(true);
    });

    it('should set hasUnread to false when all items read', () => {
      mockNotificationsService.markNotificationRead.mockReturnValue(of({}));

      store.markItemRead('1');
      store.markItemRead('3');

      expect(store.hasUnread()).toBe(false);
    });

    it('should call service with correct id', () => {
      mockNotificationsService.markNotificationRead.mockReturnValue(of({}));

      store.markItemRead('test-id');

      expect(
        mockNotificationsService.markNotificationRead,
      ).toHaveBeenCalledWith('test-id');
    });
  });
});
