import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { environment } from '../../../../../../../environments/environment';
import {
  LoanManagementTestContext,
  setupLoanManagementTest,
  cleanupLoanManagementTest,
  patchStoreState,
  mockPendingApprovals,
  mockUserInfo,
  mockLoanDetailsResponse,
  mockApproveResponse,
  mockRejectResponse,
} from './loan-management.test-helpers';
import { LOAN_APPROVAL_STATUS } from '../shared/models/loan-management.model';

describe('Loan Management Integration', () => {
  let ctx: LoanManagementTestContext;
  const apiUrl: string = `${environment.apiUrl}/loans`;

  beforeEach(async () => {
    ctx = await setupLoanManagementTest();
  });

  afterEach(() => {
    cleanupLoanManagementTest(ctx.httpMock);
  });

  it('should load pending approvals successfully', async () => {
    ctx.store.loadPendingApprovals();
    expect(ctx.store.loading()).toBe(true);

    const req = ctx.httpMock.expectOne(`${apiUrl}/pending-approvals`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPendingApprovals);

    await vi.waitFor(() => {
      expect(ctx.store.pendingApprovals().length).toBe(2);
      expect(ctx.store.loading()).toBe(false);
      expect(ctx.store.hasInitialLoad()).toBe(true);
      expect(ctx.store.pendingCount()).toBe(2);
    });
  });

  it('should handle 403 error when loading approvals', async () => {
    ctx.store.loadPendingApprovals();
    expect(ctx.store.loading()).toBe(true);

    const req = ctx.httpMock.expectOne(`${apiUrl}/pending-approvals`);
    req.flush(null, { status: 403, statusText: 'Forbidden' });

    await vi.waitFor(() => {
      expect(ctx.store.loading()).toBe(false);
      expect(ctx.store.error()).toBe('settings.loan-management.alerts.error.access_denied');
      expect(ctx.store.pendingApprovals().length).toBe(0);
    });
  });

  it('should handle generic error when loading approvals', async () => {
    ctx.store.loadPendingApprovals();

    const req = ctx.httpMock.expectOne(`${apiUrl}/pending-approvals`);
    req.flush(
      { message: 'Server error' },
      { status: 500, statusText: 'Internal Server Error' },
    );

    await vi.waitFor(() => {
      expect(ctx.store.loading()).toBe(false);
      expect(ctx.store.error()).toBe('Server error');
    });
  });

  it('should select a loan and fetch user info + loan details in parallel', async () => {
    patchStoreState(ctx.store, { pendingApprovals: mockPendingApprovals });

    ctx.store.selectLoan('loan-1');
    expect(ctx.store.selectedLoanId()).toBe('loan-1');
    expect(ctx.store.userInfoLoading()).toBe(true);
    expect(ctx.store.loanDetailsLoading()).toBe(true);

    const userInfoReq = ctx.httpMock.expectOne(`${apiUrl}/user-info/user-1`);
    const loanDetailsReq = ctx.httpMock.expectOne(
      `${apiUrl}/pending-approvals/loan-1`,
    );

    expect(userInfoReq.request.method).toBe('GET');
    expect(loanDetailsReq.request.method).toBe('GET');

    userInfoReq.flush(mockUserInfo);
    loanDetailsReq.flush(mockLoanDetailsResponse);

    await vi.waitFor(() => {
      expect(ctx.store.selectedUserInfo()).toEqual(mockUserInfo);
      expect(ctx.store.selectedLoanDetailsResponse()).toEqual(
        mockLoanDetailsResponse,
      );
      expect(ctx.store.userInfoLoading()).toBe(false);
      expect(ctx.store.loanDetailsLoading()).toBe(false);
    });
  });

  it('should approve a loan and update state optimistically', async () => {
    patchStoreState(ctx.store, { pendingApprovals: mockPendingApprovals });

    ctx.store.approveLoan('loan-1');
    expect(ctx.store.actionLoading()).toBe(true);
    expect(ctx.store.pendingApprovals().length).toBe(1);
    expect(
      ctx.store.pendingApprovals().find((l) => l.id === 'loan-1'),
    ).toBeUndefined();

    const req = ctx.httpMock.expectOne(`${apiUrl}/approve`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      loanId: 'loan-1',
      status: LOAN_APPROVAL_STATUS.APPROVED,
    });

    req.flush(mockApproveResponse);

    await vi.waitFor(() => {
      expect(ctx.store.actionLoading()).toBe(false);
      expect(ctx.store.selectedLoanId()).toBeNull();
      expect(ctx.store.successMessage()).toBe('settings.loan-management.alerts.success.loan_approved');
    });
  });

  it('should handle approve error and re-fetch approvals list', async () => {
    patchStoreState(ctx.store, { pendingApprovals: mockPendingApprovals });

    ctx.store.approveLoan('loan-1');

    const approveReq = ctx.httpMock.expectOne(`${apiUrl}/approve`);
    approveReq.flush(null, { status: 404, statusText: 'Not Found' });

    const refetchReq = ctx.httpMock.expectOne(`${apiUrl}/pending-approvals`);
    refetchReq.flush(mockPendingApprovals);

    await vi.waitFor(() => {
      expect(ctx.store.actionLoading()).toBe(false);
      expect(ctx.store.actionError()).toBe(
        'settings.loan-management.alerts.error.already_processed',
      );
      expect(ctx.store.pendingApprovals().length).toBe(2);
    });
  });

  it('should reject a loan with reason', async () => {
    patchStoreState(ctx.store, { pendingApprovals: mockPendingApprovals });

    ctx.store.rejectLoan({ loanId: 'loan-1', reason: 'Insufficient income' });
    expect(ctx.store.actionLoading()).toBe(true);
    expect(ctx.store.pendingApprovals().length).toBe(1);

    const req = ctx.httpMock.expectOne(`${apiUrl}/approve`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      loanId: 'loan-1',
      status: LOAN_APPROVAL_STATUS.REJECTED,
      rejectionReason: 'Insufficient income',
    });

    req.flush(mockRejectResponse);

    await vi.waitFor(() => {
      expect(ctx.store.actionLoading()).toBe(false);
      expect(ctx.store.selectedLoanId()).toBeNull();
      expect(ctx.store.successMessage()).toBe('settings.loan-management.alerts.success.loan_rejected');
    });
  });

  it('should handle reject error with 403 status', async () => {
    patchStoreState(ctx.store, { pendingApprovals: mockPendingApprovals });

    ctx.store.rejectLoan({ loanId: 'loan-2', reason: 'Test reason' });

    const rejectReq = ctx.httpMock.expectOne(`${apiUrl}/approve`);
    rejectReq.flush(null, { status: 403, statusText: 'Forbidden' });

    const refetchReq = ctx.httpMock.expectOne(`${apiUrl}/pending-approvals`);
    refetchReq.flush(mockPendingApprovals);

    await vi.waitFor(() => {
      expect(ctx.store.actionLoading()).toBe(false);
      expect(ctx.store.actionError()).toBe(
        'settings.loan-management.alerts.error.access_denied',
      );
    });
  });

  it('should compute shouldLoadInitialData correctly', () => {
    expect(ctx.store.shouldLoadInitialData()).toBe(true);

    patchStoreState(ctx.store, { hasInitialLoad: true });
    expect(ctx.store.shouldLoadInitialData()).toBe(false);
  });

  it('should clear selection', () => {
    patchStoreState(ctx.store, {
      selectedLoanId: 'loan-1',
      actionError: 'some error',
    });

    ctx.store.clearSelection();
    expect(ctx.store.selectedLoanId()).toBeNull();
    expect(ctx.store.actionError()).toBeNull();
  });

  it('should clear error and success message', () => {
    patchStoreState(ctx.store, {
      error: 'load error',
      actionError: 'action error',
      successMessage: 'success',
    });

    ctx.store.clearError();
    expect(ctx.store.error()).toBeNull();
    expect(ctx.store.actionError()).toBeNull();

    ctx.store.clearSuccessMessage();
    expect(ctx.store.successMessage()).toBeNull();
  });
});
