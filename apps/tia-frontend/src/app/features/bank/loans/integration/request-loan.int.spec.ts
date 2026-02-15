import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { environment } from '../../../../../environments/environment';

import {
  TestContext,
  setupLoansTest,
  cleanupLoansTest,
  mockLoanRequest,
  mockLoanResponse,
} from './loans.test-helpers';

describe('Loans Integration - Request Loan Flow', () => {
  let ctx: TestContext;

  beforeEach(async () => {
    ctx = await setupLoansTest();
  });

  afterEach(() => {
    if (ctx?.httpMock) {
      cleanupLoansTest(ctx.httpMock);
    }
  });

  it('should request loan successfully', async () => {
    ctx.loansStore.requestLoan(mockLoanRequest);

    expect(ctx.loansStore.actionLoading()).toBe(true);

    const req = ctx.httpMock.expectOne(`${environment.apiUrl}/loans/request`);
    req.flush(mockLoanResponse);

    const reloadReq = ctx.httpMock.expectOne((r: { url: string }) =>
      r.url.endsWith('/loans'),
    );
    reloadReq.flush([]);

    await vi.waitFor(() => {
      expect(ctx.loansStore.actionLoading()).toBe(false);
    });
  });

  it('should handle request loan error and stop loading', async () => {
    ctx.loansStore.requestLoan(mockLoanRequest);

    const req = ctx.httpMock.expectOne(`${environment.apiUrl}/loans/request`);
    req.flush(
      { message: 'Invalid request' },
      { status: 400, statusText: 'Bad Request' },
    );

    await vi.waitFor(() => {
      expect(ctx.loansStore.actionLoading()).toBe(false);
      expect(ctx.loansStore.error()).toBeNull();
    });
  });
});
