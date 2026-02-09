import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../../environments/environment';
import {
  AccountsTestContext,
  setupAccountsTest,
  cleanupAccountsTest,
  mockAccounts,
} from './accounts.test-helpers';

describe('Accounts Integration - Load Accounts Flow', () => {
  let ctx: AccountsTestContext;

  beforeEach(async () => {
    ctx = await setupAccountsTest();
  });

  afterEach(() => {
    cleanupAccountsTest(ctx.httpMock);
  });

  it('should load accounts successfully', () => {
    let receivedAccounts: any;
    ctx.apiService.getAccounts().subscribe((accounts) => {
      receivedAccounts = accounts;
    });

    const req = ctx.httpMock.expectOne(
      (httpRequest) =>
        httpRequest.url === `${environment.apiUrl}/accounts` &&
        httpRequest.params.get('ignoreHiddens') === 'true' &&
        httpRequest.params.get('status') === 'active',
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockAccounts);

    expect(receivedAccounts).toEqual(mockAccounts);
  });

  it('should handle load accounts error', () => {
    let receivedError: any;
    ctx.apiService.getAccounts().subscribe({
      next: () => {
        expect.fail('Should not succeed');
      },
      error: (error) => {
        receivedError = error;
      },
    });

    const req = ctx.httpMock.expectOne((httpRequest) =>
      httpRequest.url.includes('/accounts'),
    );

    req.flush(
      { message: 'Failed to load accounts' },
      { status: 500, statusText: 'Server Error' },
    );

    expect(receivedError.status).toBe(500);
  });
});
