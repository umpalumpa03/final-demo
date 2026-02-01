import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsContainer } from './notifications-container';
import { NotificationsStore } from '../store/notifications.store';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ElementRef } from '@angular/core';

describe('NotificationsContainer', () => {
  let component: NotificationsContainer;
  let fixture: ComponentFixture<NotificationsContainer>;
  let store: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsContainer],
      providers: [NotificationsStore],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsContainer);
    component = fixture.componentInstance;
    store = fixture.debugElement.injector.get(NotificationsStore);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call store.toggleSelectAll when toggleSelectAll is called', () => {
    const spy = vi.spyOn(store, 'toggleSelectAll');
    component.toggleSelectAll();
    expect(spy).toHaveBeenCalled();
  });

  it('should call store.toggleItemSelection when individualItemSelection is called', () => {
    const spy = vi.spyOn(store, 'toggleItemSelection');
    component.individualItemSelection('notif-1');
    expect(spy).toHaveBeenCalledWith('notif-1');
  });

  it('should call store.deleteNotification when handleDeleteNotification is called', () => {
    const spy = vi.spyOn(store, 'deleteNotification');
    component.handleDeleteNotification('id-123');
    expect(spy).toHaveBeenCalledWith('id-123');
  });

  it('should call store.markAllAsRead when handleMarkAllAsRead is called', () => {
    const spy = vi.spyOn(store, 'markAllAsRead');
    component.handleMarkAllAsRead();
    expect(spy).toHaveBeenCalled();
  });

  it('should call store.deleteAll when handleDeleteAllNotification is called', () => {
    const spy = vi.spyOn(store, 'deleteAll');
    component.handleDeleteAllNotification();
    expect(spy).toHaveBeenCalled();
  });

  it('should fetch next page when scrolling to bottom and hasNext is true', () => {
    const spy = vi.spyOn(store, 'fetchNotifications');
    vi.spyOn(store, 'pageInfo').mockReturnValue({
      hasNext: true,
      nextCursor: 'cursor-123',
    });
    vi.spyOn(store, 'limitPerPage').mockReturnValue(10);

    component.handleScrollToBottom();

    expect(spy).toHaveBeenCalledWith({ cursor: 'cursor-123', limit: 10 });
  });

  it('should calculate position when modal is open and anchor exists', () => {
    const mockElement = {
      nativeElement: {
        getBoundingClientRect: () => ({ bottom: 100, right: 500 }),
      },
    } as ElementRef;

    fixture.componentRef.setInput('notificationEl', mockElement);
    fixture.componentRef.setInput('isModalOpen', true);

    const pos = component.position();
    expect(pos.top).toBeGreaterThan(0);
    expect(pos.left).toBe(500 - 380);
  });

  it('should push values to visibleItem$ when handleItemVisible is called', () => {
    component.handleItemVisible('notif-777');
    expect(component['visibleItem$']).toBeDefined();
  });
});
