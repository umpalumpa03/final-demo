import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../environments/environment';
import {
  TestContext,
  setupMessagingTest,
  cleanupMessagingTest,
  mockMailsResponse,
} from './messaging.test-helpers';

describe('Messaging Integration - Send Email Flow', () => {
  let ctx: TestContext;

  beforeEach(async () => {
    ctx = await setupMessagingTest();
  });

  afterEach(() => {
    cleanupMessagingTest(ctx.httpMock);
  });

  it('should send email successfully and refresh inbox', async () => {
    const emailData = {
      recipient: 'test@test.com',
      ccRecipients: ['cc@test.com'],
      subject: 'Test Subject',
      body: 'Test Body',
      isImportant: false,
      isDraft: false,
    };

    ctx.store.sendEmail(emailData);

    const sendReq = ctx.httpMock.expectOne(`${environment.apiUrl}/mails`);
    expect(sendReq.request.method).toBe('POST');
    expect(sendReq.request.body).toEqual(emailData);

    sendReq.flush(null);

    const importantReq1 = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/importants/unread`);
    importantReq1.flush({ count: 0 });

    const draftCountReq = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/drafts/total`);
    draftCountReq.flush({ count: 0 });

    const loadMailsReq = ctx.httpMock.expectOne((req) =>
      req.url === `${environment.apiUrl}/mails` &&
      req.method === 'GET' &&
      req.params.get('type') === 'inbox'
    );
    loadMailsReq.flush(mockMailsResponse);

    const importantReq2 = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/importants/unread`);
    importantReq2.flush({ count: 0 });

    const totalCountReq = ctx.httpMock.expectOne((req) =>
      req.url.includes('/mails/total') &&
      req.params.get('type') === 'inbox'
    );
    totalCountReq.flush({ count: 10 });

    await vi.waitFor(() => {
      expect(ctx.store.successMessage?.()).toBe('messaging.storeSuccess.emailSent');
    });
  });

  it('should handle send email error', async () => {
    const emailData = {
      recipient: 'test@test.com',
      ccRecipients: [],
      subject: 'Test',
      body: 'Body',
      isImportant: false,
      isDraft: false,
    };

    ctx.store.sendEmail(emailData);

    const req = ctx.httpMock.expectOne(`${environment.apiUrl}/mails`);
    req.flush(
      { message: 'Failed to send' },
      { status: 400, statusText: 'Bad Request' }
    );

    await vi.waitFor(() => {
      expect(ctx.store.error()).toBe('messaging.storeErrors.sendEmail');
      expect(ctx.store.isLoading()).toBe(false);
    });
  });

  it('should save email as draft', async () => {
    const draftData = {
      recipient: 'test@test.com',
      ccRecipients: [],
      subject: 'Draft Subject',
      body: 'Draft Body',
      isImportant: false,
      isDraft: true,
    };

    ctx.store.sendEmail(draftData);

    const req = ctx.httpMock.expectOne(`${environment.apiUrl}/mails`);
    expect(req.request.body.isDraft).toBe(true);

    req.flush(null);

    const importantReq1 = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/importants/unread`);
    importantReq1.flush({ count: 0 });

    const draftCountReq = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/drafts/total`);
    draftCountReq.flush({ count: 0 });

    const loadMailsReq = ctx.httpMock.expectOne((req) =>
      req.url === `${environment.apiUrl}/mails` &&
      req.method === 'GET' &&
      req.params.get('type') === 'inbox'
    );
    loadMailsReq.flush(mockMailsResponse);

    const importantReq2 = ctx.httpMock.expectOne(`${environment.apiUrl}/mails/importants/unread`);
    importantReq2.flush({ count: 0 });

    const totalCountReq = ctx.httpMock.expectOne((req) =>
      req.url.includes('/mails/total') &&
      req.params.get('type') === 'inbox'
    );
    totalCountReq.flush({ count: 10 });
  });
});
