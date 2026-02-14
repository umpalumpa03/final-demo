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
    cleanupLoansTest(ctx.httpMock);
  });

  it('should request loan successfully', async () => {
    ctx.loansStore.requestLoan(mockLoanRequest);

    expect(ctx.loansStore.actionLoading()).toBe(true);

    const req = ctx.httpMock.expectOne(`${environment.apiUrl}/loans/request`);
    req.flush(mockLoanResponse);

    const reloadReq = ctx.httpMock.expectOne((r) => r.url.endsWith('/loans'));
    reloadReq.flush([]);

    await vi.waitFor(() => {
      expect(ctx.loansStore.actionLoading()).toBe(false);
    });
  });
});
