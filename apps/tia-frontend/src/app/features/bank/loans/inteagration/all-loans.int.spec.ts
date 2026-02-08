import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { environment } from '../../../../../environments/environment';
import {
  TestContext,
  setupLoansTest,
  cleanupLoansTest,
  mockLoansList,
  mockLoanResponse,
} from './loans.test-helpers';

describe('Loans Integration - View Loans Flow', () => {
  let ctx: TestContext;

  beforeEach(async () => {
    ctx = await setupLoansTest();
  });

  afterEach(() => {
    cleanupLoansTest(ctx.httpMock);
  });

  it('should load all loans', async () => {
    ctx.loansStore.loadLoans({ status: null, forceChange: true });

    expect(ctx.loansStore.loading()).toBe(true);

    const req = ctx.httpMock.expectOne(`${environment.apiUrl}/loans`);
    expect(req.request.method).toBe('GET');

    req.flush(mockLoansList);

    await vi.waitFor(() => {
      expect(ctx.loansStore.loans().length).toBe(2);
      expect(ctx.loansStore.loans()[0].id).toBe('loan-1');
      expect(ctx.loansStore.loading()).toBe(false);
    });
  });

  it('should filter loans by status (Approved)', async () => {
    ctx.loansStore.loadLoans({ status: 2, forceChange: true });

    const req = ctx.httpMock.expectOne(
      (req) => req.url.includes('/loans') && req.params.get('status') === '2',
    );
    expect(req.request.method).toBe('GET');

    const approvedLoans = mockLoansList.filter((l) => l.status === 2);
    req.flush(approvedLoans);

    await vi.waitFor(() => {
      expect(ctx.loansStore.loans().length).toBe(1);
      expect(ctx.loansStore.loans()[0].status).toBe(2);
    });
  });

  it('should load loan details by ID', async () => {
    const loanId = 'loan-1';

    ctx.loansStore.loadLoanDetails(loanId);
    expect(ctx.loansStore.detailsLoading()).toBe(true);

    const req = ctx.httpMock.expectOne(`${environment.apiUrl}/loans/${loanId}`);
    expect(req.request.method).toBe('GET');

    const mockDetails = {
      ...mockLoanResponse,
      id: loanId,
      address: {},
      contactPerson: {},
    };
    req.flush(mockDetails);

    await vi.waitFor(() => {
      expect(ctx.loansStore.selectedLoanDetails()).toEqual(mockDetails);
      expect(ctx.loansStore.detailsLoading()).toBe(false);
    });
  });

  it('should handle load error', async () => {
    ctx.loansStore.loadLoans({ status: null, forceChange: true });

    const req = ctx.httpMock.expectOne(`${environment.apiUrl}/loans`);

    req.flush(
      { message: 'Server Error' },
      { status: 500, statusText: 'Server Error' },
    );

    await vi.waitFor(() => {
      expect(ctx.loansStore.loading()).toBe(false);
      expect(ctx.loansStore.error()).toBe('Server Error');
    });
  });
});
