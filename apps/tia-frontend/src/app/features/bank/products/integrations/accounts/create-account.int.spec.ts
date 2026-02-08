import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../../environments/environment';
import {
  AccountsTestContext,
  setupAccountsTest,
  cleanupAccountsTest,
  mockAccount,
} from './accounts.test-helpers';
import {
  AccountType,
  CreateAccountRequest,
} from '@tia/shared/models/accounts/accounts.model';

describe('Accounts Integration - Create Account Flow', () => {
  let ctx: AccountsTestContext;

  beforeEach(async () => {
    ctx = await setupAccountsTest();
  });

  afterEach(() => {
    cleanupAccountsTest(ctx.httpMock);
  });

  it('should create account successfully', () => {
    const createRequest: CreateAccountRequest = {
      friendlyName: 'New Savings Account',
      type: AccountType.saving,
      currency: 'USD',
    };

    let receivedAccount: any;
    ctx.apiService.createAccount(createRequest).subscribe((account) => {
      receivedAccount = account;
    });

    const req = ctx.httpMock.expectOne(
      `${environment.apiUrl}/accounts/create-account-request`,
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createRequest);

    req.flush(mockAccount);

    expect(receivedAccount).toEqual(mockAccount);
  });

  it('should handle create account error', () => {
    const createRequest: CreateAccountRequest = {
      friendlyName: 'New Account',
      type: AccountType.saving,
      currency: 'USD',
    };

    let receivedError: any;
    ctx.apiService.createAccount(createRequest).subscribe({
      next: () => {
        expect.fail('Should not succeed');
      },
      error: (error) => {
        receivedError = error;
      },
    });

    const req = ctx.httpMock.expectOne((httpRequest) =>
      httpRequest.url.includes('/create-account-request'),
    );

    req.flush(
      { message: 'Failed to create account' },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(receivedError.status).toBe(400);
  });
});
