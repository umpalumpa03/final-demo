import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../../environments/environment';
import {
  AccountsTestContext,
  setupAccountsTest,
  cleanupAccountsTest,
  mockAccount,
} from './accounts.test-helpers';

describe('Accounts Integration - Rename Account Flow', () => {
  let ctx: AccountsTestContext;

  beforeEach(async () => {
    ctx = await setupAccountsTest();
  });

  afterEach(() => {
    cleanupAccountsTest(ctx.httpMock);
  });

  it('should update account friendly name successfully', () => {
    const accountId = 'acc-123';
    const newFriendlyName = 'My Updated Account';
    const updatedAccount = { ...mockAccount, friendlyName: newFriendlyName };

    let receivedAccount: any;
    ctx.apiService
      .updateFriendlyName(accountId, newFriendlyName)
      .subscribe((account) => {
        receivedAccount = account;
      });

    const req = ctx.httpMock.expectOne(
      `${environment.apiUrl}/accounts/update-friendly-name/${accountId}`,
    );

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ friendlyName: newFriendlyName });

    req.flush(updatedAccount);

    const settingsReq = ctx.httpMock.expectOne(req => req.url.includes('/settings/accounts'));
    settingsReq.flush({});

    expect(receivedAccount.friendlyName).toBe(newFriendlyName);
  });

  it('should handle rename account error', () => {
    const accountId = 'acc-123';
    const newFriendlyName = 'New Name';

    let receivedError: any;
    ctx.apiService.updateFriendlyName(accountId, newFriendlyName).subscribe({
      next: () => {
        expect.fail('Should not succeed');
      },
      error: (error) => {
        receivedError = error;
      },
    });

    const req = ctx.httpMock.expectOne((httpRequest) =>
      httpRequest.url.includes('/update-friendly-name'),
    );

    req.flush(
      { message: 'Failed to update friendly name' },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(receivedError.status).toBe(400);
  });
});
