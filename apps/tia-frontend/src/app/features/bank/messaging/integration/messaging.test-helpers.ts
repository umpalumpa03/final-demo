import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MessagingStore } from '../store/messaging.store';
import { MessagingService } from '../services/messaging-api.service';
import { InboxService } from '@tia/shared/services/messages/inbox.service';
import { Mail, MailsResponse, User } from '../store/messaging.state';
import { vi } from 'vitest';

export const mockMails: Mail[] = [
  {
    id: 1,
    subject: 'Test Email 1',
    senderEmail: 'sender1@test.com',
    receiverEmail: 'receiver@test.com',
    body: 'Test body 1',
    isRead: false,
    isImportant: false,
    isFavorite: false,
    createdAt: '2024-01-01T10:00:00Z',
    permission: 1,
  },
  {
    id: 2,
    subject: 'Test Email 2',
    senderEmail: 'sender2@test.com',
    receiverEmail: 'receiver@test.com',
    body: 'Test body 2',
    isRead: true,
    isImportant: true,
    isFavorite: false,
    createdAt: '2024-01-02T10:00:00Z',
    permission: 1,
  },
];

export const mockMailsResponse: MailsResponse = {
  items: mockMails,
  pagination: {
    hasNextPage: false,
    nextCursor: null,
  },
};

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'user1@test.com',
    username: 'user1',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    id: '2',
    email: 'user2@test.com',
    username: 'user2',
    firstName: 'Jane',
    lastName: 'Smith',
  },
];

export interface TestContext {
  httpMock: HttpTestingController;
  store: InstanceType<typeof MessagingStore>;
  inboxService: any;
}

export async function setupMessagingTest(): Promise<TestContext> {
  const inboxService = {
    fetchInboxCount: vi.fn(),
    inboxCount: () => 0,
  };

  await TestBed.configureTestingModule({
    providers: [
      provideTranslateService(),
      provideHttpClient(),
      provideHttpClientTesting(),
      MessagingStore,
      MessagingService,
      {
        provide: InboxService,
        useValue: inboxService,
      },
    ],
  }).compileComponents();

  const httpMock = TestBed.inject(HttpTestingController);
  const store = TestBed.inject(MessagingStore);

  return { httpMock, store, inboxService };
}

export function cleanupMessagingTest(httpMock: HttpTestingController): void {
  try {
    httpMock.verify();
  } finally {
    TestBed.resetTestingModule();
  }
}
