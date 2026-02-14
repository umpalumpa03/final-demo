import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { environment } from '../../../../../environments/environment';
import { patchState } from '@ngrx/signals';
import {
  TestContext,
  setupLoansTest,
  cleanupLoansTest,
  mockLoansList,
} from './loans.test-helpers';

describe('Loans Integration - Dashboard Interactions', () => {
  let ctx: TestContext;

  beforeEach(async () => {
    ctx = await setupLoansTest();

    patchState(ctx.loansStore as any, {
      loans: [
        {
          ...mockLoansList[0],
          id: 'loan-1',
          purpose: 'Personal Vacation',
          friendlyName: 'Trip to Italy',
        },
        {
          ...mockLoansList[1],
          id: 'loan-2',
          purpose: 'Business Startup',
          friendlyName: 'Coffee Shop',
        },
      ],
      loading: false,
    });
  });

  afterEach(() => {
    if (ctx && ctx.httpMock) {
      cleanupLoansTest(ctx.httpMock);
    }
  });

  it('should rename a loan and update the list optimistically', async () => {
    const loanId = 'loan-1';
    const newName = 'My New Car Loan';

    ctx.loansStore.renameLoan({ id: loanId, name: newName });

    const req = ctx.httpMock.expectOne(
      `${environment.apiUrl}/loans/update-friendly-name/${loanId}`,
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ friendlyName: newName });

    req.flush({ ...mockLoansList[0], friendlyName: newName });

    await vi.waitFor(() => {
      const updatedLoan = ctx.loansStore.loans().find((l) => l.id === loanId);
      expect(updatedLoan?.friendlyName).toBe(newName);
    });
  });

  it('should filter loans by search query locally', async () => {
    ctx.loansStore.setSearchQuery('Vacation');

    await vi.waitFor(() => {
      const filtered = ctx.loansStore.filteredLoans();
      expect(filtered.length).toBe(1);
      expect(filtered[0].purpose).toBe('Personal Vacation');
    });

    ctx.loansStore.setSearchQuery('Shop');

    await vi.waitFor(() => {
      const filtered = ctx.loansStore.filteredLoans();
      expect(filtered.length).toBe(1);
      expect(filtered[0].friendlyName).toBe('Coffee Shop');
    });

    ctx.loansStore.setSearchQuery('Spaceship');

    await vi.waitFor(() => {
      const filtered = ctx.loansStore.filteredLoans();
      expect(filtered.length).toBe(0);
    });
  });
});
