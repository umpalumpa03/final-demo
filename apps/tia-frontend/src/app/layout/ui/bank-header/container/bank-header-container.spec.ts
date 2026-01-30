import { of } from 'rxjs';
import { BankHeaderContainer } from './bank-header-container';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Notifications } from '../service/notifications';
import { InboxService } from '@tia/shared/services/messages/inbox.service';
import { Store } from '@ngrx/store';
import { NotificationsStore } from '../store/notifications.store';
import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

describe('BankHeaderContainer', () => {
  let component: BankHeaderContainer;
  let fixture: ComponentFixture<BankHeaderContainer>;
  let mockNotifications: any;
  let mockInbox: any;
  let mockStore: any;
  let mockNotificationsStore: any;

  beforeEach(async () => {
    mockNotifications = {
      hasUnreadNotification: vi.fn(() => of({ hasUnread: true })),
      getNotifications: vi.fn(() => of({ items: [] })),
    };

    mockInbox = {
      fetchInboxCount: vi.fn(),
      inboxCount: signal(12),
    };

    mockStore = {
      select: vi.fn(() => of(null)),
    };

    mockNotificationsStore = {
      notifications: signal([]),
      unreadCount: signal(0),
      hasUnread: signal(true),
      hasUnreadNotifications: vi.fn(),
      limitPerPage: signal(10),
      fetchNotifications: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [BankHeaderContainer],
      providers: [
        { provide: Notifications, useValue: mockNotifications },
        { provide: InboxService, useValue: mockInbox },
        { provide: Store, useValue: mockStore },
        { provide: ActivatedRoute, useValue: {} },
      ],
    })
      .overrideComponent(BankHeaderContainer, {
        set: {
          providers: [
            { provide: NotificationsStore, useValue: mockNotificationsStore },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BankHeaderContainer);
    component = fixture.componentInstance;
  });

  it('should update signals on init', () => {
    component.ngOnInit();

    expect(component.hasUnread()).toBe(true);
    expect(component.inboxCount()).toBe(12);
  });

  it('should handle notification click logic', () => {
    const mockEl = { nativeElement: {} } as any;

    component.onNotificationClick(mockEl);

    expect(component.anchorEl()).toBe(mockEl);
    expect(component.isModalOpen()).toBe(true);
    expect(mockNotificationsStore.fetchNotifications).toHaveBeenCalled();

    component.onNotificationClick(mockEl);
    expect(component.isModalOpen()).toBe(false);
  });
});
