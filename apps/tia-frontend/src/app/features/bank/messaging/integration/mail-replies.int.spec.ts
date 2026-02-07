import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../environments/environment';
import {
  TestContext,
  setupMessagingTest,
  cleanupMessagingTest,
} from './messaging.test-setup';

describe('Messaging Integration - Mail Replies Flow', () => {
  let ctx: TestContext;

  beforeEach(async () => {
    ctx = await setupMessagingTest();
  });

  afterEach(() => {
    cleanupMessagingTest(ctx.httpMock);
  });

  it('should get mail replies', async () => {
    const mockReplies = [
      {
        id: 1,
        authorEmail: 'reply1@test.com',
        body: 'First reply',
        createdAt: '2024-01-01T11:00:00Z',
      },
      {
        id: 2,
        authorEmail: 'reply2@test.com',
        body: 'Second reply',
        createdAt: '2024-01-01T12:00:00Z',
      },
    ];

    ctx.store.getMailReplies(1);

    const req = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/1/replies`);
    expect(req.request.method).toBe('GET');

    req.flush(mockReplies);

    await vi.waitFor(() => {
      expect(ctx.store.mailReplies?.()).toEqual(mockReplies);
      expect(ctx.store.isLoading()).toBe(false);
    });
  });

  it('should send mail reply', async () => {
    const replyBody = 'This is my reply';

    ctx.store.sendMailReply({ mailId: 1, body: replyBody });

    const sendReq = ctx.httpMock.expectOne(
      `${environment.apiUrl}/mails/1/reply`
    );
    expect(sendReq.request.method).toBe('POST');
    expect(sendReq.request.body).toEqual({ body: replyBody });

    sendReq.flush(null);

    const getRepliesReq = ctx.httpMock.expectOne(
      `${environment.apiUrl}/mails/1/replies`
    );
    getRepliesReq.flush([]);

    await vi.waitFor(() => {
      expect(ctx.store.successMessage?.()).toBe('messaging.storeSuccess.replySent');
    });
  });
});
