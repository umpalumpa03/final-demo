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
    if (ctx?.httpMock) {
      cleanupLoansTest(ctx.httpMock);
    }
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

    const req = ctx.httpMock.expectOne(`${environment.apiUrl}/loans`);
    req.flush(mockLoansList);

    await vi.waitFor(() => {
      const visibleLoans = ctx.loansStore.filteredLoans();
      expect(visibleLoans.length).toBe(1);
      expect(visibleLoans[0].status).toBe(2);
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

  it('should use cached details on second visit', async () => {
    const loanId = 'loan-1';

    ctx.loansStore.loadLoanDetails(loanId);
    const req = ctx.httpMock.expectOne(`${environment.apiUrl}/loans/${loanId}`);
    req.flush({ ...mockLoanResponse, id: loanId });

    ctx.loansStore.clearLoanDetails();

    ctx.loansStore.loadLoanDetails(loanId);

    ctx.httpMock.expectNone(`${environment.apiUrl}/loans/${loanId}`);

    await vi.waitFor(() => {
      expect(ctx.loansStore.selectedLoanDetails()).toBeTruthy();
      expect(ctx.loansStore.selectedLoanDetails()?.id).toBe(loanId);
    });
  });

  it('should handle load loans error and set error state', async () => {
    ctx.loansStore.loadLoans({ status: null, forceChange: true });

    const req = ctx.httpMock.expectOne(`${environment.apiUrl}/loans`);
    req.flush('Server error', { status: 500, statusText: 'Server Error' });

    await vi.waitFor(() => {
      expect(ctx.loansStore.loading()).toBe(false);
      expect(ctx.loansStore.error()).toBeTruthy();
    });
  });

  it('should navigate to next loan details', async () => {
    ctx.loansStore.loadLoans({ status: null, forceChange: true });
    const listReq = ctx.httpMock.expectOne(`${environment.apiUrl}/loans`);
    listReq.flush([
      { ...mockLoanResponse, id: 'loan-1' },
      { ...mockLoanResponse, id: 'loan-2' },
    ]);

    ctx.loansStore.loadLoanDetails('loan-1');
    const req1 = ctx.httpMock.expectOne(`${environment.apiUrl}/loans/loan-1`);
    req1.flush({ ...mockLoanResponse, id: 'loan-1' });

    ctx.loansStore.navigateDetails(1);

    const req2 = ctx.httpMock.expectOne(`${environment.apiUrl}/loans/loan-2`);
    expect(req2.request.method).toBe('GET');
    req2.flush({ ...mockLoanResponse, id: 'loan-2' });

    await vi.waitFor(() => {
      expect(ctx.loansStore.selectedLoanDetails()?.id).toBe('loan-2');
    });
  });
});
