import { TestBed } from '@angular/core/testing';
import { MessagingStore } from './messaging.store';
import { MessagingService } from '../services/messaging-api.service';
import { InboxService } from '@tia/shared/services/messages/inbox.service';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('MessagingStore', () => {
  let store: InstanceType<typeof MessagingStore>;
  let mockMessagingService: any;
  let mockInboxService: any;

  beforeEach(() => {
    mockMessagingService = {
      getInbox: vi.fn(),
      markAsRead: vi.fn()
    };

    mockInboxService = {
      fetchInboxCount: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        MessagingStore,
        { provide: MessagingService, useValue: mockMessagingService },
        { provide: InboxService, useValue: mockInboxService }
      ]
    });

    store = TestBed.inject(MessagingStore);
  });

  it('should create store', () => {
    expect(store).toBeTruthy();
  });

  it('should load mails successfully', async () => {
    const mockResponse = {
      items: [{ id: 1, subject: 'Test' }],
      pagination: { hasNextPage: false, nextCursor: null }
    };

    mockMessagingService.getInbox.mockReturnValue(of(mockResponse));

    store.loadMails('inbox');

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(store.mails()).toEqual(mockResponse.items);
    expect(store.isLoading()).toBe(false);
  });

  it('should handle load mails error', async () => {
    mockMessagingService.getInbox.mockReturnValue(
      throwError(() => new Error('API Error'))
    );

    store.loadMails('inbox');

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(store.error()).toBeTruthy();
    expect(store.isLoading()).toBe(false);
  });

  it('should mark mail as read', async () => {
    const initialMails = [{ id: 1, isRead: false }];
    
    mockMessagingService.markAsRead.mockReturnValue(of(null));
    mockMessagingService.getInbox.mockReturnValue(of({
      items: initialMails,
      pagination: { hasNextPage: false, nextCursor: null }
    }));

    store.loadMails('inbox');
    await new Promise(resolve => setTimeout(resolve, 100));

    store.markMailasRead(1);
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(store.mails()[0].isRead).toBe(true);
    expect(mockInboxService.fetchInboxCount).toHaveBeenCalled();
  });
});