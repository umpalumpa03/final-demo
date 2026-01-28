import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { MessagingStore } from './messaging.store';
import { MessagingService } from '../services/messaging-api-service';
import { initialState, MailsResponse } from './messaging.state';
import { of, throwError } from 'rxjs';

describe('MessagingStore', () => {
  let store: any;
  let messagingService: { getInbox: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    messagingService = {
      getInbox: vi.fn()
    };
    TestBed.configureTestingModule({
      providers: [
        MessagingStore,
        { provide: MessagingService, useValue: messagingService }
      ]
    });
    store = TestBed.inject(MessagingStore);
  });

  it('should initialize with initial state', () => {
    expect(store.mails()).toEqual(initialState.mails);
    expect(store.isLoading()).toBe(initialState.isLoading);
    expect(store.error()).toBe(initialState.error);
  });

  it('should update state with response on success', async () => {
    const response: MailsResponse = {
      items: [{ id: 1, subject: 'Test', senderEmail: '', receiverEmail: '', body: '', isRead: false, isImportant: false, isFavorite: false, createdAt: '', permission: 0 }],
      pagination: { hasNextPage: false, nextCursor: null }
    };
    messagingService.getInbox.mockReturnValue(of(response));
    store.loadMails('inbox');
    await Promise.resolve(); 
    expect(store.mails()).toEqual(response.items);
    expect(store.pagination()).toEqual(response.pagination);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should set error on failure', async () => {
    messagingService.getInbox.mockReturnValue(throwError(() => new Error('fail')));
    store.loadMails('inbox');
    await Promise.resolve(); 
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe('fail');
  });
});