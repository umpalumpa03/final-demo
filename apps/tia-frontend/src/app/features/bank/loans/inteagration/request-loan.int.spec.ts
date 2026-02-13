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

    expect(ctx.loansStore.loading()).toBe(true);

    const req = ctx.httpMock.expectOne(`${environment.apiUrl}/loans/request`);
    expect(req.request.method).toBe('POST');
    req.flush(mockLoanResponse);

    await vi.waitFor(() => {
      expect(ctx.loansStore.loading()).toBe(false);
      expect(ctx.loansStore.error()).toBeNull();

      const loans = ctx.loansStore.loans();
      expect(loans.length).toBeGreaterThan(0);
      expect(loans[0].id).toBe(mockLoanResponse.id);

      const alert = ctx.loansStore.alert();
      expect(alert?.type).toBe('success');
      expect(alert?.message).toBeTruthy();
    });
  });

  it('should handle request loan failure', async () => {
    ctx.loansStore.requestLoan(mockLoanRequest);

    const req = ctx.httpMock.expectOne(`${environment.apiUrl}/loans/request`);

    req.flush(
      { message: 'Insufficient funds' },
      { status: 400, statusText: 'Bad Request' },
    );

    await vi.waitFor(() => {
      expect(ctx.loansStore.loading()).toBe(false);

      expect(ctx.loansStore.error()).toBe('Insufficient funds');

      const alert = ctx.loansStore.alert();
      expect(alert?.type).toBe('error');
      expect(alert?.message).toBe('Insufficient funds');
    });
  });
});
