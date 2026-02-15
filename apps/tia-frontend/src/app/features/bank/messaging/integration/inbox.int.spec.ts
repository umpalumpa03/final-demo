import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../environments/environment';
import { MailsResponse } from '../store/messaging.state';
import {
  TestContext,
  setupMessagingTest,
  cleanupMessagingTest,
  mockMails,
  mockMailsResponse,
} from './messaging.test-helpers';

describe('Messaging Integration - Load Inbox Flow', () => {
  let ctx: TestContext;

  beforeEach(async () => {
    ctx = await setupMessagingTest();
  });

  afterEach(() => {
    cleanupMessagingTest(ctx.httpMock);
  });

  it('should load inbox messages successfully', async () => {
    ctx.store.loadMails('inbox');

    const req = ctx.httpMock.expectOne(
      (request) =>
        request.url === `${environment.apiUrl}/mails` &&
        request.params.get('type') === 'inbox' &&
        request.params.get('limit') === '20'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockMailsResponse);

    const importantReq = ctx.httpMock.expectOne(
      `${environment.apiUrl}/mails/importants/unread`
    );
    importantReq.flush({ count: 0 });

    await vi.waitFor(() => {
      expect(ctx.store.mails()).toEqual(mockMails);
      expect(ctx.store.pagination()).toEqual(mockMailsResponse.pagination);
      expect(ctx.store.isLoading()).toBe(false);
      expect(ctx.store.currentType()).toBe('inbox');
    });
  });

  it('should handle load mails error', async () => {
    ctx.store.loadMails('inbox');

    const req = ctx.httpMock.expectOne((request) =>
      request.url.includes('/mails')
    );

    req.flush({ message: 'Failed to load' }, { status: 500, statusText: 'Server Error' });

    await vi.waitFor(() => {
      expect(ctx.alertService.error).toHaveBeenCalledWith('messaging.storeErrors.loadMails', { variant: 'dismissible', title: 'Oops!' });
      expect(ctx.store.isLoading()).toBe(false);
    });
  });

  it('should load with pagination cursor', async () => {
    const firstResponse: MailsResponse = {
      items: [mockMails[0]],
      pagination: {
        hasNextPage: true,
        nextCursor: 'cursor_123',
      },
    };

    ctx.store.loadMails('inbox');

    const firstReq = ctx.httpMock.expectOne((request) =>
      request.url.includes('/mails')
    );
    firstReq.flush(firstResponse);

    const importantReq1 = ctx.httpMock.expectOne(
      `${environment.apiUrl}/mails/importants/unread`
    );
    importantReq1.flush({ count: 0 });

    await vi.waitFor(() => {
      expect(ctx.store.pagination().nextCursor).toBe('cursor_123');
    });

    ctx.store.loadMails('inbox');

    const secondReq = ctx.httpMock.expectOne(
      (request) =>
        request.url.includes('/mails') &&
        request.params.get('cursor') === 'cursor_123'
    );

    expect(secondReq.request.method).toBe('GET');
    secondReq.flush({
      items: [mockMails[1]],
      pagination: { hasNextPage: false, nextCursor: null },
    });

    ctx.httpMock.expectNone(`${environment.apiUrl}/mails/importants/unread`);
  });
});
