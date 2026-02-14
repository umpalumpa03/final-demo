import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../environments/environment';
import {
  TestContext,
  setupMessagingTest,
  cleanupMessagingTest,
  mockMailsResponse,
} from './messaging.test-helpers';

describe('Messaging Integration - Send Draft Flow', () => {
  let ctx: TestContext;

  beforeEach(async () => {
    ctx = await setupMessagingTest();
  });

  afterEach(() => {
    cleanupMessagingTest(ctx.httpMock);
  });

  it('should send draft successfully', async () => {
    const draftData = {
      recipient: 'test@test.com',
      ccRecipients: [],
      subject: 'Draft Subject',
      body: 'Draft Body',
      isImportant: false,
      isDraft: false,
    };

    ctx.store.sendDraft({ mailId: 1, data: draftData });

    const sendReq = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/1`);
    expect(sendReq.request.method).toBe('PUT');
    expect(sendReq.request.body).toEqual(draftData);

    sendReq.flush(null);

    const importantReq1 = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/importants/unread`);
    importantReq1.flush({ count: 0 });

    const draftCountReq1 = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/drafts/total`);
    draftCountReq1.flush({ count: 0 });

    const loadMailsReq = ctx.httpMock.expectOne((req) =>
      req.url === `${environment.apiUrl}/mails` &&
      req.method === 'GET' &&
      req.params.get('type') === 'drafts'
    );
    loadMailsReq.flush(mockMailsResponse);

    const importantReq2 = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/importants/unread`);
    importantReq2.flush({ count: 0 });

    await vi.waitFor(() => {
      expect(ctx.alertService.success).toHaveBeenCalledWith('messaging.storeSuccess.draftSent', { variant: 'dismissible', title: 'Success!' });
    });
  });

  it('should handle send draft error', async () => {
    const draftData = {
      recipient: 'test@test.com',
      ccRecipients: [],
      subject: 'Draft',
      body: 'Body',
      isImportant: false,
      isDraft: false,
    };

    ctx.store.sendDraft({ mailId: 1, data: draftData });

    const req = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/1`);
    req.flush(
      { message: 'Failed' },
      { status: 400, statusText: 'Bad Request' }
    );

    await vi.waitFor(() => {
      expect(ctx.alertService.error).toHaveBeenCalledWith('messaging.storeErrors.sendDraft', { variant: 'dismissible', title: 'Oops!' });
      expect(ctx.store.isLoading()).toBe(false);
    });
  });
});
