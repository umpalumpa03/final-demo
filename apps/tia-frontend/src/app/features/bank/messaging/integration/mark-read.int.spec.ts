import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../environments/environment';
import {
  TestContext,
  setupMessagingTest,
  cleanupMessagingTest,
  mockMailsResponse,
} from './messaging.test-setup';

describe('Messaging Integration - Mark as Read Flow', () => {
  let ctx: TestContext;

  beforeEach(async () => {
    ctx = await setupMessagingTest();
  });

  afterEach(() => {
    cleanupMessagingTest(ctx.httpMock);
  });

  it('should mark single mail as read', async () => {
    ctx.store.loadMails('inbox');

    const loadReq = ctx.httpMock.expectOne((request) =>
      request.url.includes('/mails')
    );
    loadReq.flush(mockMailsResponse);

    const importantReq1 = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/importants/unread`);
    importantReq1.flush({ count: 0 });

    await vi.waitFor(() => {
      expect(ctx.store.mails()[0].isRead).toBe(false);
    });

    ctx.store.markMailasRead(1);

    const markReq = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/1/read`);
    expect(markReq.request.method).toBe('PUT');

    markReq.flush(null);

    const importantReq2 = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/importants/unread`);
    importantReq2.flush({ count: 0 });

    await vi.waitFor(() => {
      expect(ctx.store.mails()[0].isRead).toBe(true);
    });
  });

  it('should mark multiple mails as read', async () => {
    ctx.store.loadMails('inbox');

    const loadReq = ctx.httpMock.expectOne((request) =>
      request.url.includes('/mails')
    );
    loadReq.flush(mockMailsResponse);

    const importantReq1 = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/importants/unread`);
    importantReq1.flush({ count: 0 });

    await vi.waitFor(() => {
      expect(ctx.store.mails().length).toBe(2);
    });

    ctx.store.markAllAsRead([1, 2]);

    const req1 = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/1/read`);
    req1.flush(null);

    const importantReq2 = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/importants/unread`);
    importantReq2.flush({ count: 0 });

    await vi.waitFor(() => {
      expect(ctx.store.mails()[0].isRead).toBe(true);
    });
  });

  it('should handle mark as read error', async () => {
    ctx.store.loadMails('inbox');

    const loadReq = ctx.httpMock.expectOne((request) =>
      request.url.includes('/mails')
    );
    loadReq.flush(mockMailsResponse);

    const importantReq1 = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/importants/unread`);
    importantReq1.flush({ count: 0 });

    await vi.waitFor(() => {
      expect(ctx.store.mails().length).toBe(2);
    });

    ctx.store.markMailasRead(1);

    const markReq = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/1/read`);
    markReq.flush(
      { message: 'Failed' },
      { status: 500, statusText: 'Server Error' }
    );

    await vi.waitFor(() => {
      expect(ctx.store.error()).toBe('messaging.storeErrors.markMailAsRead');
    });
  });
});
