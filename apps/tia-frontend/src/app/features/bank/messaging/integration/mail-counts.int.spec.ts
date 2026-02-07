import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../environments/environment';
import {
  TestContext,
  setupMessagingTest,
  cleanupMessagingTest,
} from './messaging.test-helpers';

describe('Messaging Integration - Get Mail Counts Flow', () => {
  let ctx: TestContext;

  beforeEach(async () => {
    ctx = await setupMessagingTest();
  });

  afterEach(() => {
    cleanupMessagingTest(ctx.httpMock);
  });

  it('should get total count for mail type', async () => {
    ctx.store.getTotalCount('inbox');

    const req = ctx.httpMock.expectOne(
      (request) =>
        request.url.includes('/mails/total') &&
        request.params.get('type') === 'inbox'
    );

    expect(req.request.method).toBe('GET');
    req.flush({ count: 15 });

    await vi.waitFor(() => {
      expect(ctx.store.total()['inbox']).toBe(15);
    });
  });

  it('should get draft total count', async () => {
    ctx.store.getDraftTotalCount(0);

    const req = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/drafts/total`);
    expect(req.request.method).toBe('GET');

    req.flush({ count: 3 });

    await vi.waitFor(() => {
      expect(ctx.store.draftsTotal?.()).toBe(3);
    });
  });

  it('should get unread important count', async () => {
    ctx.store.getUnreadImportantCount();

    const req = ctx.httpMock.expectOne(
      `${environment.apiUrl}/mails/importants/unread`
    );
    expect(req.request.method).toBe('GET');

    req.flush({ count: 5 });

    await vi.waitFor(() => {
      expect(ctx.store.importantCount?.()).toBe(5);
    });
  });
});
