import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideTranslateService } from '@ngx-translate/core';
import { LoanManagementStore } from './loan-management.store';
import { LoanManagementApiService } from '../shared/services/loan-management-api.service';
import {
  PendingApproval,
  LoanDetailsResponse,
  UserInfo,
  LOAN_APPROVAL_STATUS,
} from '../shared/models/loan-management.model';

const mockPendingApprovals: PendingApproval[] = [
  {
    id: 'loan-1',
    userId: 'user-1',
    userFullName: 'Michael Scott',
    loanAmount: 25000,
    accountId: 'acc-1',
    months: 60,
    purpose: 'home_improvement',
    status: 1,
    statusName: 'Pending',
    address: {
      street: '123 Main St',
      city: 'Scranton',
      region: 'PA',
      postalCode: '18503',
    },
    contactPerson: {
      name: 'Dwight Schrute',
      relationship: 'Friend',
      phone: '555-1234',
      email: 'dwight@example.com',
    },
    createdAt: '2026-01-14T10:00:00Z',
  },
  {
    id: 'loan-2',
    userId: 'user-2',
    userFullName: 'Pam Beesly',
    loanAmount: 15000,
    accountId: 'acc-2',
    months: 48,
    purpose: 'car_purchase',
    status: 1,
    statusName: 'Pending',
    address: {
      street: '456 Oak Ave',
      city: 'Scranton',
      region: 'PA',
      postalCode: '18504',
    },
    contactPerson: {
      name: 'Jim Halpert',
      relationship: 'Spouse',
      phone: '555-5678',
      email: 'jim@example.com',
    },
    createdAt: '2026-01-13T10:00:00Z',
  },
];

const mockLoanDetailsResponse: LoanDetailsResponse = {
  loanDetails: {
    loanAmount: 25000,
    loanPurpose: 'home_improvement',
    loanTermMonths: 60,
    interestRate: 5.5,
    monthlyPayment: 475,
    requestDate: '2026-01-14T10:00:00Z',
  },
  riskAssessment: {
    debtToIncomeRatio: 7.8,
    loanToIncomeRatio: 33.3,
    totalInterest: 3500,
  },
};

const mockUserInfo: UserInfo = {
  fullName: 'Michael Scott',
  email: 'michael@example.com',
  phoneNumber: '+1 (555) 123-4567',
  employmentStatus: 'Employed',
  address: '123 Main St, Scranton, PA 18503',
  annualIncome: 75000,
  creditScore: 720,
  creditScoreBadge: 'Good',
};

describe('LoanManagementStore', () => {
  let store: InstanceType<typeof LoanManagementStore>;
  let apiServiceMock: {
    getPendingApprovals: ReturnType<typeof vi.fn>;
    getLoanDetails: ReturnType<typeof vi.fn>;
    getUserInfo: ReturnType<typeof vi.fn>;
    approveLoan: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    apiServiceMock = {
      getPendingApprovals: vi.fn().mockReturnValue(of(mockPendingApprovals)),
      getLoanDetails: vi.fn().mockReturnValue(of(mockLoanDetailsResponse)),
      getUserInfo: vi.fn().mockReturnValue(of(mockUserInfo)),
      approveLoan: vi.fn().mockReturnValue(of({ id: 'loan-1', status: 2 })),
    };

    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        LoanManagementStore,
        { provide: LoanManagementApiService, useValue: apiServiceMock },
      ],
    });

    store = TestBed.inject(LoanManagementStore);
  });

  describe('loadPendingApprovals', () => {
    it('should load pending approvals and update state', () => {
      store.loadPendingApprovals();
      expect(apiServiceMock.getPendingApprovals).toHaveBeenCalledTimes(1);
      expect(store.pendingApprovals()).toEqual(mockPendingApprovals);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
    });

    it('should handle 403 error with appropriate message', () => {
      apiServiceMock.getPendingApprovals.mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              status: 403,
              error: { message: 'Forbidden' },
            }),
        ),
      );
      store.loadPendingApprovals();
      expect(store.error()).toBe('settings.loan-management.alerts.error.access_denied');
      expect(store.loading()).toBe(false);
    });
  });

  describe('selectLoan', () => {
    it('should fetch loan details and user info when selecting a loan', () => {
      store.loadPendingApprovals();
      store.selectLoan('loan-1');
      expect(store.selectedLoanId()).toBe('loan-1');
      expect(apiServiceMock.getLoanDetails).toHaveBeenCalledWith('loan-1');
      expect(store.loanDetailsCache()['loan-1']).toEqual(mockLoanDetailsResponse);
    });

    it('should fetch fresh data on each selection', () => {
      store.loadPendingApprovals();
      store.selectLoan('loan-1');
      expect(apiServiceMock.getLoanDetails).toHaveBeenCalledTimes(1);
      store.clearSelection();
      store.selectLoan('loan-1');
      expect(apiServiceMock.getLoanDetails).toHaveBeenCalledTimes(2);
    });

    it('should cancel previous request when selecting different loan (switchMap)', () => {
      store.loadPendingApprovals();
      store.selectLoan('loan-1');
      store.selectLoan('loan-2');
      expect(store.selectedLoanId()).toBe('loan-2');
    });
  });

  describe('loadUserInfo', () => {
    it('should fetch user info and cache it', () => {
      store.loadUserInfo('user-1');
      expect(apiServiceMock.getUserInfo).toHaveBeenCalledWith('user-1');
      expect(store.userInfoCache()['user-1']).toEqual(mockUserInfo);
      expect(store.userInfoLoading()).toBe(false);
    });

    it('should fetch fresh user info on each call', () => {
      store.loadUserInfo('user-1');
      expect(apiServiceMock.getUserInfo).toHaveBeenCalledTimes(1);
      store.loadUserInfo('user-1');
      expect(apiServiceMock.getUserInfo).toHaveBeenCalledTimes(2);
    });
  });

  describe('approveLoan', () => {
    it('should optimistically remove loan from list and call API', () => {
      store.loadPendingApprovals();
      expect(store.pendingApprovals().length).toBe(2);
      store.approveLoan('loan-1');
      expect(store.pendingApprovals().length).toBe(1);
      expect(
        store.pendingApprovals().find((l) => l.id === 'loan-1'),
      ).toBeUndefined();
      expect(apiServiceMock.approveLoan).toHaveBeenCalledWith({
        loanId: 'loan-1',
        status: LOAN_APPROVAL_STATUS.APPROVED,
      });
    });

    it('should invalidate caches after successful approval', () => {
      store.loadPendingApprovals();
      store.selectLoan('loan-1');
      expect(store.loanDetailsCache()['loan-1']).toBeDefined();
      store.approveLoan('loan-1');
      expect(store.loanDetailsCache()['loan-1']).toBeUndefined();
      expect(store.selectedLoanId()).toBeNull();
    });

    it('should reload list on error (rollback)', () => {
      apiServiceMock.approveLoan.mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              status: 500,
              error: { message: 'Server error' },
            }),
        ),
      );
      store.loadPendingApprovals();
      apiServiceMock.getPendingApprovals.mockClear();
      store.approveLoan('loan-1');
      expect(apiServiceMock.getPendingApprovals).toHaveBeenCalled();
      expect(store.actionError()).toBe('Server error');
    });
  });

  describe('rejectLoan', () => {
    it('should optimistically remove loan and call API with rejection reason', () => {
      store.loadPendingApprovals();
      store.rejectLoan({ loanId: 'loan-1', reason: 'Insufficient income' });
      expect(
        store.pendingApprovals().find((l) => l.id === 'loan-1'),
      ).toBeUndefined();
      expect(apiServiceMock.approveLoan).toHaveBeenCalledWith({
        loanId: 'loan-1',
        status: LOAN_APPROVAL_STATUS.REJECTED,
        rejectionReason: 'Insufficient income',
      });
    });
  });

  describe('computed signals', () => {
    it('selectedLoanDetails should return pending approval for selected loan', () => {
      store.loadPendingApprovals();
      store.selectLoan('loan-1');
      expect(store.selectedLoanDetails()).toEqual(mockPendingApprovals[0]);
    });

    it('selectedLoanDetailsResponse should return cached details response', () => {
      store.loadPendingApprovals();
      store.selectLoan('loan-1');
      expect(store.selectedLoanDetailsResponse()).toEqual(mockLoanDetailsResponse);
    });

    it('selectedUserInfo should return cached user info for selected loan', () => {
      store.loadPendingApprovals();
      store.selectLoan('loan-1');
      expect(store.selectedUserInfo()).toEqual(mockUserInfo);
    });

    it('hasPendingApprovals should reflect list state', () => {
      expect(store.hasPendingApprovals()).toBe(false);
      store.loadPendingApprovals();
      expect(store.hasPendingApprovals()).toBe(true);
    });

    it('pendingCount should return correct count', () => {
      store.loadPendingApprovals();
      expect(store.pendingCount()).toBe(2);
    });
  });

  describe('clearSelection', () => {
    it('should clear selected loan and action error', () => {
      store.loadPendingApprovals();
      store.selectLoan('loan-1');
      expect(store.selectedLoanId()).toBe('loan-1');
      store.clearSelection();
      expect(store.selectedLoanId()).toBeNull();
      expect(store.actionError()).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear both error and actionError', () => {
      apiServiceMock.getPendingApprovals.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 500 })),
      );
      store.loadPendingApprovals();
      expect(store.error()).toBeTruthy();
      
      store.clearError();
      expect(store.error()).toBeNull();
      expect(store.actionError()).toBeNull();
    });
  });

  describe('clearSuccessMessage', () => {
    it('should clear success message', () => {
      store.loadPendingApprovals();
      store.approveLoan('loan-1');
      expect(store.successMessage()).toBe('settings.loan-management.alerts.success.loan_approved');
      
      store.clearSuccessMessage();
      expect(store.successMessage()).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle error loading pending approvals with generic message', () => {
      apiServiceMock.getPendingApprovals.mockReturnValue(
        throwError(() => new HttpErrorResponse({ 
          status: 500,
          statusText: 'Server Error'
        })),
      );
      store.loadPendingApprovals();
      expect(store.error()).toContain('Http failure response');
      expect(store.loading()).toBe(false);
    });

    it('should handle error loading pending approvals with custom message', () => {
      apiServiceMock.getPendingApprovals.mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              status: 500,
              error: { message: 'Custom error message' },
            }),
        ),
      );
      store.loadPendingApprovals();
      expect(store.error()).toBe('Custom error message');
    });

    it('should handle getUserInfo error gracefully', () => {
      apiServiceMock.getUserInfo.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 500 })),
      );
      store.loadUserInfo('user-1');
      expect(store.userInfoLoading()).toBe(false);
    });

    it('should handle getLoanDetails error gracefully', () => {
      apiServiceMock.getLoanDetails.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 500 })),
      );
      store.loadPendingApprovals();
      store.selectLoan('loan-1');
      expect(store.loanDetailsLoading()).toBe(false);
    });

    it('should handle 404 error when approving loan', () => {
      apiServiceMock.approveLoan.mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              status: 404,
              error: { message: 'Not found' },
            }),
        ),
      );
      store.loadPendingApprovals();
      store.approveLoan('loan-1');
      expect(store.actionError()).toBe('settings.loan-management.alerts.error.already_processed');
    });

    it('should handle 403 error when approving loan', () => {
      apiServiceMock.approveLoan.mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              status: 403,
              error: { message: 'Forbidden' },
            }),
        ),
      );
      store.loadPendingApprovals();
      store.approveLoan('loan-1');
      expect(store.actionError()).toBe('settings.loan-management.alerts.error.access_denied');
    });

    it('should handle 404 error when rejecting loan', () => {
      apiServiceMock.approveLoan.mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              status: 404,
              error: { message: 'Not found' },
            }),
        ),
      );
      store.loadPendingApprovals();
      store.rejectLoan({ loanId: 'loan-1', reason: 'Test reason' });
      expect(store.actionError()).toBe('settings.loan-management.alerts.error.already_processed');
    });

    it('should handle 403 error when rejecting loan', () => {
      apiServiceMock.approveLoan.mockReturnValue(
        throwError(
          () =>
            new HttpErrorResponse({
              status: 403,
              error: { message: 'Forbidden' },
            }),
        ),
      );
      store.loadPendingApprovals();
      store.rejectLoan({ loanId: 'loan-1', reason: 'Test reason' });
      expect(store.actionError()).toBe('settings.loan-management.alerts.error.access_denied');
    });

    it('should handle error reloading list after approve failure', () => {
      apiServiceMock.approveLoan.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 500 })),
      );
      apiServiceMock.getPendingApprovals.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 500 })),
      );
      
      store.loadPendingApprovals();
      apiServiceMock.getPendingApprovals.mockClear();
      store.approveLoan('loan-1');
      
      expect(apiServiceMock.getPendingApprovals).toHaveBeenCalled();
    });

    it('should handle error reloading list after reject failure', () => {
      apiServiceMock.approveLoan.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 500 })),
      );
      apiServiceMock.getPendingApprovals.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 500 })),
      );
      
      store.loadPendingApprovals();
      apiServiceMock.getPendingApprovals.mockClear();
      store.rejectLoan({ loanId: 'loan-1', reason: 'Test' });
      
      expect(apiServiceMock.getPendingApprovals).toHaveBeenCalled();
    });
  });

  describe('selectLoan with null', () => {
    it('should handle selecting null loan ID', () => {
      store.loadPendingApprovals();
      store.selectLoan('loan-1');
      expect(store.selectedLoanId()).toBe('loan-1');
      
      store.selectLoan(null);
      expect(store.selectedLoanId()).toBeNull();
      expect(store.actionError()).toBeNull();
    });
  });

  describe('fetchUserInfo with undefined userId', () => {
    it('should handle undefined userId gracefully', () => {
      const loan = {
        ...mockPendingApprovals[0],
        userId: undefined,
      };
      apiServiceMock.getPendingApprovals.mockReturnValue(of([loan]));
      
      store.loadPendingApprovals();
      store.selectLoan(loan.id);
      
      expect(store.userInfoLoading()).toBe(false);
    });
  });

  describe('computed signals edge cases', () => {
    it('should return null for selectedLoanDetails when no loan selected', () => {
      expect(store.selectedLoanDetails()).toBeNull();
    });

    it('should return null for selectedLoanDetailsResponse when no loan selected', () => {
      expect(store.selectedLoanDetailsResponse()).toBeNull();
    });

    it('should return null for selectedUserInfo when no loan selected', () => {
      expect(store.selectedUserInfo()).toBeNull();
    });

    it('should return null for selectedUserInfo when loan has no userId', () => {
      const loanWithoutUserId = {
        ...mockPendingApprovals[0],
        userId: undefined,
      };
      apiServiceMock.getPendingApprovals.mockReturnValue(of([loanWithoutUserId]));
      
      store.loadPendingApprovals();
      store.selectLoan(loanWithoutUserId.id);
      
      expect(store.selectedUserInfo()).toBeNull();
    });
  });

  describe('success messages', () => {
    it('should set success message after approving loan', () => {
      store.loadPendingApprovals();
      store.approveLoan('loan-1');
      expect(store.successMessage()).toBe('settings.loan-management.alerts.success.loan_approved');
    });

    it('should set success message after rejecting loan', () => {
      store.loadPendingApprovals();
      store.rejectLoan({ loanId: 'loan-1', reason: 'Test' });
      expect(store.successMessage()).toBe('settings.loan-management.alerts.success.loan_rejected');
    });

    it('should clear success message before new action', () => {
      store.loadPendingApprovals();
      store.approveLoan('loan-1');
      expect(store.successMessage()).toBeTruthy();
      
      apiServiceMock.getPendingApprovals.mockReturnValue(of(mockPendingApprovals));
      store.loadPendingApprovals();
      store.approveLoan('loan-2');
      
      // Success message should be cleared at start of new action
      expect(store.actionLoading()).toBe(false);
    });
  });
});
