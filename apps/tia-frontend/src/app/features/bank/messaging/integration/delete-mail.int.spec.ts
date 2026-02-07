import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../environments/environment';
import {
  TestContext,
  setupMessagingTest,
  cleanupMessagingTest,
  mockMailsResponse,
} from './messaging.test-setup';

describe('Messaging Integration - Delete Mail Flow', () => {
  let ctx: TestContext;

  beforeEach(async () => {
    ctx = await setupMessagingTest();
  });

  afterEach(() => {
    cleanupMessagingTest(ctx.httpMock);
  });

  it('should delete single mail', async () => {
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

    ctx.store.deleteMail(1);

    const deleteReq = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/1`);
    expect(deleteReq.request.method).toBe('DELETE');

    deleteReq.flush(null);

    const importantReq2 = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/importants/unread`);
    importantReq2.flush({ count: 0 });

    const totalCountReq = ctx.httpMock.expectOne((req) => req.url.includes('/mails/total'));
    totalCountReq.flush({ count: 1 });

    await vi.waitFor(() => {
      expect(ctx.store.mails().length).toBe(1);
      expect(ctx.store.mails()[0].id).toBe(2);
    });
  });

  it('should delete multiple mails', async () => {
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

    ctx.store.deleteAllMails([1, 2]);

    const req1 = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/1`);
    const req2 = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/2`);

    req1.flush(null);
    req2.flush(null);

    const importantReq2 = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/importants/unread`);
    importantReq2.flush({ count: 0 });

    const totalCountReq = ctx.httpMock.expectOne((req) => req.url.includes('/mails/total'));
    totalCountReq.flush({ count: 0 });

    await vi.waitFor(() => {
      expect(ctx.store.mails().length).toBe(0);
    });
  });

  it('should handle delete mail error', async () => {
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

    ctx.store.deleteMail(1);

    const deleteReq = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/1`);
    deleteReq.flush(
      { message: 'Failed' },
      { status: 500, statusText: 'Server Error' }
    );

    await vi.waitFor(() => {
      expect(ctx.store.error()).toBe('messaging.storeErrors.deleteMail');
    });
  });
});
