import { of } from 'rxjs';
import { BankHeaderContainer } from './bank-header-container';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Notifications } from '../components/header-notifications/service/notifications';
import { InboxService } from '@tia/shared/services/messages/inbox.service';
import { Store } from '@ngrx/store';
import { NotificationsStore } from '../components/header-notifications/store/notifications.store';
import { signal, ElementRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BankHeader } from '../components/bank-header/bank-header';
import { NotificationsContainer } from '../components/header-notifications/container/notifications-container';

@Component({
  selector: 'app-bank-header',
  standalone: true,
  template: '',
})
class BankHeaderStub {}

@Component({
  selector: 'app-notifications-container',
  standalone: true,
  template: '',
})
class NotificationsContainerStub {}

describe('BankHeaderContainer', () => {
  let component: BankHeaderContainer;
  let fixture: ComponentFixture<BankHeaderContainer>;
  let mockNotificationsStore: any;
  let mockInbox: any;
  let mockStore: any;

  beforeEach(async () => {
    mockInbox = {
      fetchInboxCount: vi.fn(),
      inboxCount: signal(12),
    };

    mockNotificationsStore = {
      notificationItems: signal([]),
      notifications: signal([]),
      unreadCount: signal(0),
      hasUnread: signal(true),
      hasUnreadNotifications: vi.fn(),
      limitPerPage: signal(10),
      fetchNotifications: vi.fn(),
      resetState: vi.fn(),
    };

    mockStore = {
      select: vi.fn(() => of(null)),
      selectSignal: vi.fn(() => signal(false)),
    };

    await TestBed.configureTestingModule({
      imports: [BankHeaderContainer],
      providers: [
        { provide: Notifications, useValue: {} },
        { provide: InboxService, useValue: mockInbox },
        { provide: Store, useValue: mockStore },
        { provide: ActivatedRoute, useValue: {} },
      ],
    })
      .overrideComponent(BankHeaderContainer, {
        remove: { imports: [BankHeader, NotificationsContainer] },
        add: {
          imports: [BankHeaderStub, NotificationsContainerStub],
          providers: [
            { provide: NotificationsStore, useValue: mockNotificationsStore },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BankHeaderContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call fetch methods on init', () => {
    component.ngOnInit();
    expect(mockNotificationsStore.hasUnreadNotifications).toHaveBeenCalled();
    expect(mockInbox.fetchInboxCount).toHaveBeenCalled();
  });

  it('should open modal and fetch notifications if closed', () => {
    const mockEl = {
      nativeElement: document.createElement('div'),
    } as ElementRef;
    component.isModalOpen.set(false);

    component.onNotificationClick(mockEl);

    expect(component.isModalOpen()).toBe(true);
    expect(component.anchorEl()).toBe(mockEl);
    expect(mockNotificationsStore.fetchNotifications).toHaveBeenCalledWith({
      limit: 10,
    });
  });

  it('should close modal if already open', () => {
    const mockEl = {
      nativeElement: document.createElement('div'),
    } as ElementRef;
    component.isModalOpen.set(true);

    component.onNotificationClick(mockEl);

    expect(component.isModalOpen()).toBe(false);
  });

  it('should update modal state via closeAndReset', () => {
    component.isModalOpen.set(true);

    component.closeAndReset();

    expect(component.isModalOpen()).toBe(false);
  });

  it('should compute inboxCount correctly from service', () => {
    expect(component.inboxCount()).toBe(12);
  });

  it('should expose hasUnread from notificationsStore', () => {
    expect(component.hasUnread()).toBe(true);
  });
});
