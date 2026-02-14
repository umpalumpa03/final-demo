import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../environments/environment';
import { EmailDetailData } from '../store/messaging.state';
import {
  TestContext,
  setupMessagingTest,
  cleanupMessagingTest,
} from './messaging.test-helpers';

describe('Messaging Integration - View Email Detail Flow', () => {
  let ctx: TestContext;

  beforeEach(async () => {
    ctx = await setupMessagingTest();
  });

  afterEach(() => {
    cleanupMessagingTest(ctx.httpMock);
  });

  it('should load email detail by id', async () => {
    const mockDetail: EmailDetailData = {
      id: 1,
      subject: 'Test Email',
      isFavorite: false,
      body: 'Email body content',
      recipient: 'receiver@test.com',
      mailType: 'inbox',
      senderEmail: 'sender@test.com',
      isRead: false,
      ccRecipients: ['cc@test.com'],
      isDraft: false,
      isImportant: false,
      createdAt: '2024-01-01T10:00:00Z',
    };

    ctx.store.getEmailById(1);

    const req = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockDetail);

    await vi.waitFor(() => {
      expect(ctx.store.emailDetail?.()).toEqual(mockDetail);
      expect(ctx.store.isLoading()).toBe(false);
    });
  });

  it('should handle email detail load error', async () => {
    ctx.store.getEmailById(999);

    const req = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/999`);
    req.flush(
      { message: 'Not found' },
      { status: 404, statusText: 'Not Found' }
    );

    await vi.waitFor(() => {
      expect(ctx.alertService.error).toHaveBeenCalledWith('messaging.storeErrors.loadEmailDetail', { variant: 'dismissible', title: 'Oops!' });
      expect(ctx.store.isLoading()).toBe(false);
    });
  });
});
