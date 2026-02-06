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

@Component({ selector: 'app-bank-header', standalone: true, template: '' })
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

    await TestBed.configureTestingModule({
      imports: [BankHeaderContainer],
      providers: [
        { provide: Notifications, useValue: {} },
        { provide: InboxService, useValue: mockInbox },
        { provide: Store, useValue: { select: vi.fn(() => of(null)) } },
        { provide: ActivatedRoute, useValue: {} },
      ],
    })
      .overrideComponent(BankHeaderContainer, {
        set: {
          providers: [
            { provide: NotificationsStore, useValue: mockNotificationsStore },
          ],
          imports: [BankHeaderStub, NotificationsContainerStub],
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

  it('should toggle modal and fetch data on notification click', () => {
    const mockEl = {
      nativeElement: document.createElement('div'),
    } as ElementRef;
    component.onNotificationClick(mockEl);
    expect(component.isModalOpen()).toBe(true);

    expect(mockNotificationsStore.fetchNotifications).toHaveBeenCalled();
    component.onNotificationClick(mockEl);
    expect(component.isModalOpen()).toBe(false);
    expect(mockNotificationsStore.resetState).toHaveBeenCalled();
  });
});
