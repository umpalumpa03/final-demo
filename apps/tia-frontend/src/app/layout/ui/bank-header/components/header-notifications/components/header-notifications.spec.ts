import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderNotifications } from './header-notifications';
import { NotificationsStore } from '../store/notifications.store';
import { ElementRef, signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('HeaderNotifications', () => {
  let component: HeaderNotifications;
  let fixture: ComponentFixture<HeaderNotifications>;
  let mockStore: any;

  const mockNotifications = [
    { id: '1', title: 'Notification 1', read: false },
    { id: '2', title: 'Notification 2', read: true },
    { id: '3', title: 'Notification 3', read: false },
  ];

  beforeEach(async () => {
    mockStore = {
      items: signal(mockNotifications),
      isLoading: signal(false),
      hasError: signal(false),
      unreadNotificationsNumber: signal(2),
      limitPerPage: signal(10),
      pageInfo: {
        hasNext: signal(true),
        nextCursor: signal('cursor-123'),
      },
      fetchNotifications: vi.fn(),
      deleteNotification: vi.fn(),
      markItemRead: vi.fn(),
      markAllAsRead: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HeaderNotifications],
      providers: [{ provide: NotificationsStore, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderNotifications);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have top initialized to 0', () => {
      expect(component.top()).toBe(0);
    });

    it('should have left initialized to 0', () => {
      expect(component.left()).toBe(0);
    });

    it('should have selectedItems initialized as empty array', () => {
      expect(component.selectedItems()).toEqual([]);
    });

    it('should have isOpen undefined initially', () => {
      expect(component.isOpen()).toBeUndefined();
    });

    it('should have anchor undefined initially', () => {
      expect(component.anchor()).toBeUndefined();
    });

    it('should have messages undefined initially', () => {
      expect(component.messages()).toBeUndefined();
    });
  });

  describe('store bindings', () => {
    it('should bind notificationsItems from store', () => {
      expect(component.notificationsItems()).toEqual(mockNotifications);
      expect(component.notificationsItems()).toHaveLength(3);
    });

    it('should bind isLoading from store', () => {
      expect(component.isLoading()).toBe(false);

      mockStore.isLoading.set(true);
      expect(component.isLoading()).toBe(true);
    });

    it('should bind hasError from store', () => {
      expect(component.hasError()).toBe(false);

      mockStore.hasError.set(true);
      expect(component.hasError()).toBe(true);
    });

    it('should bind unreadLeft from store', () => {
      expect(component.unreadLeft()).toBe(2);

      mockStore.unreadNotificationsNumber.set(5);
      expect(component.unreadLeft()).toBe(5);
    });
  });

  describe('isAllSelected computed', () => {
    it('should return false when no items are selected', () => {
      expect(component.isAllSelected()).toBe(false);
    });

    it('should return false when some items are selected', () => {
      component.selectedItems.set(['1', '2']);
      expect(component.isAllSelected()).toBe(false);
    });

    it('should return true when all items are selected', () => {
      component.selectedItems.set(['1', '2', '3']);
      expect(component.isAllSelected()).toBe(true);
    });

    it('should return true when store has empty items and no selection', () => {
      mockStore.items.set([]);
      component.selectedItems.set([]);
      expect(component.isAllSelected()).toBe(true);
    });

    it('should update when store items change', () => {
      component.selectedItems.set(['1', '2']);
      expect(component.isAllSelected()).toBe(false);

      mockStore.items.set([{ id: '1' }, { id: '2' }]);
      expect(component.isAllSelected()).toBe(true);
    });
  });

  describe('toggleSelectAll', () => {
    it('should select all items when none are selected', () => {
      component.toggleSelectAll(mockNotifications as any);
      expect(component.selectedItems()).toEqual(['1', '2', '3']);
    });

    it('should deselect all items when all are selected', () => {
      component.selectedItems.set(['1', '2', '3']);
      component.toggleSelectAll(mockNotifications as any);
      expect(component.selectedItems()).toEqual([]);
    });

    it('should select all when partial selection exists', () => {
      component.selectedItems.set(['1']);
      component.toggleSelectAll(mockNotifications as any);
      expect(component.selectedItems()).toEqual(['1', '2', '3']);
    });

    it('should handle empty messages array', () => {
      component.toggleSelectAll([]);
      expect(component.selectedItems()).toEqual([]);
    });

    it('should handle single item array', () => {
      component.toggleSelectAll([{ id: 'single' }] as any);
      expect(component.selectedItems()).toEqual(['single']);
    });
  });

  describe('individualItemSelection', () => {
    it('should add item when not selected', () => {
      component.individualItemSelection('1');
      expect(component.selectedItems()).toContain('1');
    });

    it('should remove item when already selected', () => {
      component.selectedItems.set(['1', '2', '3']);
      component.individualItemSelection('2');
      expect(component.selectedItems()).toEqual(['1', '3']);
    });

    it('should add multiple items sequentially', () => {
      component.individualItemSelection('1');
      component.individualItemSelection('2');
      component.individualItemSelection('3');
      expect(component.selectedItems()).toEqual(['1', '2', '3']);
    });

    it('should remove last selected item', () => {
      component.selectedItems.set(['1']);
      component.individualItemSelection('1');
      expect(component.selectedItems()).toEqual([]);
    });

    it('should toggle item on repeated calls', () => {
      component.individualItemSelection('1');
      expect(component.selectedItems()).toContain('1');

      component.individualItemSelection('1');
      expect(component.selectedItems()).not.toContain('1');

      component.individualItemSelection('1');
      expect(component.selectedItems()).toContain('1');
    });
  });

  describe('isItemSelected', () => {
    it('should return false when no items selected', () => {
      expect(component.isItemSelected('1')).toBe(false);
    });

    it('should return true when item is selected', () => {
      component.selectedItems.set(['1', '2']);
      expect(component.isItemSelected('1')).toBe(true);
      expect(component.isItemSelected('2')).toBe(true);
    });

    it('should return false when item is not in selection', () => {
      component.selectedItems.set(['1', '2']);
      expect(component.isItemSelected('3')).toBe(false);
    });

    it('should return false for non-existent id', () => {
      component.selectedItems.set(['1']);
      expect(component.isItemSelected('non-existent')).toBe(false);
    });
  });

  describe('onTrashIconClick', () => {
    it('should call store.deleteNotification with correct id', () => {
      component.onTrashIconClick('1');
      expect(mockStore.deleteNotification).toHaveBeenCalledWith('1');
    });

    it('should call deleteNotification once per call', () => {
      component.onTrashIconClick('1');
      component.onTrashIconClick('2');
      expect(mockStore.deleteNotification).toHaveBeenCalledTimes(2);
    });

    it('should pass any string id to store', () => {
      component.onTrashIconClick('complex-id-123-abc');
      expect(mockStore.deleteNotification).toHaveBeenCalledWith(
        'complex-id-123-abc',
      );
    });
  });
  //   beforeEach(() => {
  //     mockStore.fetchNotifications.mockClear();
  //   });

  //   it('should fetch notifications when hasNext is true', () => {
  //     component.onScrollBottom();

  //     expect(mockStore.fetchNotifications).toHaveBeenCalledWith({
  //       cursor: 'cursor-123',
  //       limit: 10,
  //     });
  //   });

  //   it('should not fetch when hasNext is false', () => {
  //     mockStore.pageInfo.hasNext.set(false);

  //     component.onScrollBottom();

  //     expect(mockStore.fetchNotifications).not.toHaveBeenCalled();
  //   });

  //   it('should use current cursor from store', () => {
  //     mockStore.pageInfo.nextCursor.set('updated-cursor');

  //     component.onScrollBottom();

  //     expect(mockStore.fetchNotifications).toHaveBeenCalledWith({
  //       cursor: 'updated-cursor',
  //       limit: 10,
  //     });
  //   });

  //   it('should use current limitPerPage from store', () => {
  //     mockStore.limitPerPage.set(25);

  //     component.onScrollBottom();

  //     expect(mockStore.fetchNotifications).toHaveBeenCalledWith({
  //       cursor: 'cursor-123',
  //       limit: 25,
  //     });
  //   });

  //   it('should call fetch only once per invocation', () => {
  //     component.onScrollBottom();
  //     expect(mockStore.fetchNotifications).toHaveBeenCalledTimes(1);
  //   });
  // });
});
