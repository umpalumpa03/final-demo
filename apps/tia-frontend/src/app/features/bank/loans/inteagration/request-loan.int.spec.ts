import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { environment } from '../../../../../environments/environment';
import { LoansCreateActions } from 'apps/tia-frontend/src/app/store/loans/loans.actions';
import {
  selectLoading,
  selectError,
} from 'apps/tia-frontend/src/app/store/loans/loans.reducer';
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
    ctx.globalStore.dispatch(
      LoansCreateActions.requestLoan({ request: mockLoanRequest }),
    );

    const req = ctx.httpMock.expectOne(`${environment.apiUrl}/loans/request`);
    expect(req.request.method).toBe('POST');
    req.flush(mockLoanResponse);

    const reloadReq = ctx.httpMock.expectOne(
      (r) => r.url.includes('/loans') && r.method === 'GET',
    );
    reloadReq.flush([]);

    await vi.waitFor(() => {
      const loadingSignal = ctx.globalStore.selectSignal(selectLoading);
      const errorSignal = ctx.globalStore.selectSignal(selectError);

      expect(loadingSignal()).toBe(false);
      expect(errorSignal()).toBeNull();
    });
  });

  it('should handle request loan failure', async () => {
    ctx.globalStore.dispatch(
      LoansCreateActions.requestLoan({ request: mockLoanRequest }),
    );

    const req = ctx.httpMock.expectOne(`${environment.apiUrl}/loans/request`);

    req.flush(
      { message: 'Insufficient funds' },
      { status: 400, statusText: 'Bad Request' },
    );

    await vi.waitFor(() => {
      const loadingSignal = ctx.globalStore.selectSignal(selectLoading);
      const errorSignal = ctx.globalStore.selectSignal(selectError);

      expect(loadingSignal()).toBe(false);
      expect(errorSignal()).toBe('Insufficient funds');
    });
  });
});
