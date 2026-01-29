import { of } from 'rxjs';
import { BankHeaderContainer } from './bank-header-container';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Notifications } from '../service/notifications';
import { InboxService } from '@tia/shared/services/messages/inbox.service';
import { Store } from '@ngrx/store';

describe('BankHeaderContainer', () => {
  let component: BankHeaderContainer;
  let mockNotifications: any;
  let mockInbox: any;
  let mockStore: any;

  beforeEach(() => {
    mockNotifications = {
      hasUnreadNotification: vi.fn(() => of({ hasUnread: true })),
      getNotifications: vi.fn(() => of({ items: [] })),
    };

    mockInbox = {
      fetchInboxCount: vi.fn(), 
      inboxCount: vi.fn(() => 12), 
      getInboxCount: vi.fn(() => of({ count: 12 })), 
    };

    mockStore = {
      select: vi.fn(() => of(null)),
    };

    TestBed.configureTestingModule({
      providers: [
        BankHeaderContainer,
        { provide: Notifications, useValue: mockNotifications },
        { provide: InboxService, useValue: mockInbox },
        { provide: Store, useValue: mockStore },
      ],
    });

    component = TestBed.inject(BankHeaderContainer);
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
    expect(mockNotifications.getNotifications).toHaveBeenCalled();

    component.onNotificationClick(mockEl);
    expect(component.isModalOpen()).toBe(false);
  });
});
