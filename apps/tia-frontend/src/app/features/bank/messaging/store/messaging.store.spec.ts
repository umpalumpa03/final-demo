import { TestBed } from '@angular/core/testing';
import { MessagingStore } from './messaging.store';
import { MessagingService } from '../services/messaging-api.service';
import { InboxService } from '@tia/shared/services/messages/inbox.service';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { User } from './messaging.state';

describe('MessagingStore', () => {
  let store: InstanceType<typeof MessagingStore>;
  let mockMessagingService: any;
  let mockInboxService: any;

  const mockUsers: User[] = [
    { id: '1', email: 'user1@test.com', username: 'user1', firstName: 'User', lastName: 'One' },
    { id: '2', email: 'user2@test.com', username: 'user2', firstName: 'User', lastName: 'Two' },
  ];

  beforeEach(() => {
    mockMessagingService = {
      getInbox: vi.fn(),
      markAsRead: vi.fn(),
      deleteMail: vi.fn(),
      searchByEmail: vi.fn(),
      sendEmail: vi.fn(),
      getEmailById: vi.fn()
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

    await vi.waitFor(() => {
      expect(store.mails()).toEqual(mockResponse.items);
      expect(store.isLoading()).toBe(false);
      expect(store.pagination()).toEqual(mockResponse.pagination);
    });
  });

  it('should handle load mails error', async () => {
    mockMessagingService.getInbox.mockReturnValue(
      throwError(() => new Error('API Error'))
    );

    store.loadMails('inbox');

    await vi.waitFor(() => {
      expect(store.error()).toBe('Failed to load mails');
      expect(store.isLoading()).toBe(false);
    });
  });

  it('should set loading state when loading mails', () => {
    mockMessagingService.getInbox.mockReturnValue(of({
      items: [],
      pagination: { hasNextPage: false, nextCursor: null }
    }));

    store.loadMails('inbox');

    expect(store.currentType()).toBe('inbox');
  });

  it('should mark mail as read', async () => {
    const initialMails = [{ id: 1, isRead: false }];

    mockMessagingService.markAsRead.mockReturnValue(of(null));
    mockMessagingService.getInbox.mockReturnValue(of({
      items: initialMails,
      pagination: { hasNextPage: false, nextCursor: null }
    }));

    store.loadMails('inbox');

    await vi.waitFor(() => {
      expect(store.mails().length).toBe(1);
    });

    store.markMailasRead(1);

    await vi.waitFor(() => {
      expect(store.mails()[0].isRead).toBe(true);
      expect(mockInboxService.fetchInboxCount).toHaveBeenCalled();
    });
  });

  it('should delete single mail', async () => {
    const initialMails = [{ id: 1, subject: 'Test 1' }, { id: 2, subject: 'Test 2' }];

    mockMessagingService.deleteMail.mockReturnValue(of(null));
    mockMessagingService.getInbox.mockReturnValue(of({
      items: initialMails,
      pagination: { hasNextPage: false, nextCursor: null }
    }));

    store.loadMails('inbox');

    await vi.waitFor(() => {
      expect(store.mails().length).toBe(2);
    });

    store.deleteMail(1);

    await vi.waitFor(() => {
      expect(store.mails().length).toBe(1);
      expect(store.mails()[0].id).toBe(2);
      expect(mockInboxService.fetchInboxCount).toHaveBeenCalled();
    });
  });

  it('should delete multiple mails', async () => {
    const initialMails = [
      { id: 1, subject: 'Test 1' },
      { id: 2, subject: 'Test 2' },
      { id: 3, subject: 'Test 3' }
    ];

    mockMessagingService.deleteMail.mockReturnValue(of(null));
    mockMessagingService.getInbox.mockReturnValue(of({
      items: initialMails,
      pagination: { hasNextPage: false, nextCursor: null }
    }));

    store.loadMails('inbox');

    await vi.waitFor(() => {
      expect(store.mails().length).toBe(3);
    });

    store.deleteAllMails([1, 2]);

    await vi.waitFor(() => {
      expect(store.mails().length).toBe(1);
      expect(store.mails()[0].id).toBe(3);
      expect(mockInboxService.fetchInboxCount).toHaveBeenCalled();
    });
  });

  it('should mark multiple mails as read', async () => {
    const initialMails = [
      { id: 1, isRead: false },
      { id: 2, isRead: false },
      { id: 3, isRead: true }
    ];

    mockMessagingService.markAsRead.mockReturnValue(of(null));
    mockMessagingService.getInbox.mockReturnValue(of({
      items: initialMails,
      pagination: { hasNextPage: false, nextCursor: null }
    }));

    store.loadMails('inbox');

    await vi.waitFor(() => {
      expect(store.mails().length).toBe(3);
    });

    store.markAllAsRead([1, 2]);

    await vi.waitFor(() => {
      expect(store.mails()[0].isRead).toBe(true);
      expect(store.mails()[1].isRead).toBe(true);
      expect(store.mails()[2].isRead).toBe(true);
      expect(mockInboxService.fetchInboxCount).toHaveBeenCalled();
    });
  });

  it('should search mails successfully', async () => {
    mockMessagingService.searchByEmail.mockReturnValue(of(mockUsers));

    store.searchMails('user');

    await vi.waitFor(() => {
      expect(store.searchResults()).toEqual(mockUsers);
      expect(store.isSearching()).toBe(false);
    });
  });

  it('should send email successfully', async () => {
    const emailData = {
      recipient: 'test@test.com',
      ccRecipients: [],
      subject: 'Test',
      body: 'Test body',
      isImportant: false,
      isDraft: false
    };

    mockMessagingService.sendEmail.mockReturnValue(of(null));
    mockMessagingService.getInbox.mockReturnValue(of({
      items: [],
      pagination: { hasNextPage: false, nextCursor: null }
    }));

    store.sendEmail(emailData);
  });

  it('should set searching state when searching', () => {
    mockMessagingService.searchByEmail.mockReturnValue(of(mockUsers));

    store.searchMails('user');

    expect(store.isSearching()).toBe(true);
  });

  it('should get email by id successfully', async () => {
    const mockEmailDetail = {
      id: 1,
      subject: 'Test Email',
      body: 'Test Body',
      senderEmail: 'sender@test.com',
      recipient: 'receiver@test.com',
      createdAt: '2024-01-01T00:00:00.000Z'
    };

    mockMessagingService.getEmailById = vi.fn().mockReturnValue(of(mockEmailDetail));

    store.getEmailById(1);
  });

  it('should handle get email by id error', async () => {
    mockMessagingService.getEmailById = vi.fn().mockReturnValue(
      throwError(() => new Error('Failed to load email'))
    );

    store.getEmailById(1);

    await vi.waitFor(() => {
      expect(store.error()).toBe('Failed to load email detail');
    });
  });
  it('should get draft total count successfully', async () => {
    const mockResponse = { count: 5 };

    mockMessagingService.getDraftTotalCount = vi.fn().mockReturnValue(of(mockResponse));

    store.getDraftTotalCount(0);

    await vi.waitFor(() => {
      expect(store.draftsTotal?.()).toBe(5);
    });
  });

  it('should get unread important count successfully', async () => {
    const mockResponse = { count: 3 };

    mockMessagingService.getImportantUnreadCount = vi.fn().mockReturnValue(of(mockResponse));

    store.getUnreadImportantCount();

    await vi.waitFor(() => {
      expect(store.importantCount?.()).toBe(3);
    });
  });

  it('should send draft successfully', async () => {
    const draftData = {
      mailId: 1,
      data: {
        recipient: 'test@test.com',
        ccRecipients: [],
        subject: 'Test Draft',
        body: 'Draft body',
        isImportant: false,
        isDraft: false
      }
    };

    mockMessagingService.sendDraft = vi.fn().mockReturnValue(of(null));
    mockMessagingService.getInbox = vi.fn().mockReturnValue(of({
      items: [],
      pagination: { hasNextPage: false, nextCursor: null }
    }));
    mockMessagingService.getDraftTotalCount = vi.fn().mockReturnValue(of({ count: 0 }));
    mockMessagingService.getImportantUnreadCount = vi.fn().mockReturnValue(of({ count: 0 }));

    store.sendDraft(draftData);
  });

  it('should get total count successfully', async () => {
    const mockResponse = { count: 10 };

    mockMessagingService.getTotalCount = vi.fn().mockReturnValue(of(mockResponse));

    store.getTotalCount('inbox');

    await vi.waitFor(() => {
      expect(store.total()['inbox']).toBe(10);
    });
  });

  it('should toggle favorite successfully', async () => {
    const initialMails = [{ id: 1, isFavorite: false }];

    mockMessagingService.togleFavorite = vi.fn().mockReturnValue(of(null));
    mockMessagingService.getInbox = vi.fn().mockReturnValue(of({
      items: initialMails,
      pagination: { hasNextPage: false, nextCursor: null }
    }));

    store.loadMails('inbox');

    await vi.waitFor(() => {
      expect(store.mails().length).toBe(1);
    });

    store.togleFavorite({ mailId: 1, isFavorite: true });

    await vi.waitFor(() => {
      expect(store.mails()[0].isFavorite).toBe(true);
      expect(store.isLoading()).toBe(false);
    });
  });
  it('should clear success message', () => {
    store.clearSuccessMessage();
    expect(store.successMessage?.()).toBe('');
  });

  it('should clear error', () => {
    store.clearError();
    expect(store.error()).toBeUndefined();
  });

  it('should handle send draft error', async () => {
    const draftData = {
      mailId: 1,
      data: {
        recipient: 'test@test.com',
        ccRecipients: [],
        subject: 'Test',
        body: 'Body',
        isImportant: false,
        isDraft: false
      }
    };

    mockMessagingService.sendDraft = vi.fn().mockReturnValue(
      throwError(() => new Error('Failed to send'))
    );

    store.sendDraft(draftData);

    await vi.waitFor(() => {
      expect(store.error()).toBe('Failed to send draft');
      expect(store.isLoading()).toBe(false);
    });
  });

  it('should handle get unread important count error', async () => {
    mockMessagingService.getImportantUnreadCount = vi.fn().mockReturnValue(
      throwError(() => new Error('Failed to load important count'))
    );

    store.getUnreadImportantCount();

    await vi.waitFor(() => {
      expect(store.error()).toBe('Failed to load important unread count');
    });
  });

  it('should handle empty search query', async () => {
    store.searchMails('');

    await vi.waitFor(() => {
      expect(store.searchResults()).toEqual([]);
      expect(store.isSearching()).toBe(false);
    });
  });

  it('should handle search error', async () => {
    mockMessagingService.searchByEmail.mockReturnValue(
      throwError(() => new Error('Search failed'))
    );

    store.searchMails('test');

    await vi.waitFor(() => {
      expect(store.error()).toBe('Search failed');
      expect(store.searchResults()).toEqual([]);
      expect(store.isSearching()).toBe(false);
    });
  });
});