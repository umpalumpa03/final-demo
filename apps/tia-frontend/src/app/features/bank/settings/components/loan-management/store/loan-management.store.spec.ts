import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoanManagementStore } from './loan-management.store';
import { LoanManagementApiService } from '../shared/services/loan-management-api.service';
import {
  PendingApproval,
  LoanApprovalDetails,
  UserInfo,
  LOAN_APPROVAL_STATUS,
} from '../shared/models/loan-management.model';

// Mock data
const mockPendingApprovals: PendingApproval[] = [
  {
    id: 'loan-1',
    loanAmount: 25000,
    months: 60,
    purpose: 'Home Renovation',
    userId: 'user-1',
    createdAt: '2026-01-14T10:00:00Z',
    interestRate: 5.5,
    monthlyPayment: 475,
    userName: 'Michael Scott',
    creditScore: 720,
  },
  {
    id: 'loan-2',
    loanAmount: 15000,
    months: 48,
    purpose: 'Car Purchase',
    userId: 'user-2',
    createdAt: '2026-01-13T10:00:00Z',
    interestRate: 6.2,
    monthlyPayment: 355,
    userName: 'Pam Beesly',
    creditScore: 680,
  },
];

const mockLoanDetails: LoanApprovalDetails = {
  id: 'loan-1',
  loanAmount: 25000,
  months: 60,
  purpose: 'Home Renovation',
  userId: 'user-1',
  createdAt: '2026-01-14T10:00:00Z',
  interestRate: 5.5,
  monthlyPayment: 475,
  riskAssessment: {
    debtToIncomeRatio: 7.8,
    loanToIncomeRatio: 33.3,
    totalInterest: 3500,
  },
};

const mockUserInfo: UserInfo = {
  id: 'user-1',
  firstName: 'Michael',
  lastName: 'Scott',
  email: 'michael@example.com',
  phone: '+1 (555) 123-4567',
  creditScore: 720,
  creditScoreRating: 'Good',
  employmentStatus: 'Employed',
  address: '123 Main St, Scranton, PA 18503',
  annualIncome: 75000,
};

describe('LoanManagementStore', () => {
  let store: InstanceType<typeof LoanManagementStore>;
  let apiServiceMock: {
    getPendingApprovals: ReturnType<typeof vi.fn>;
    getPendingApprovalDetails: ReturnType<typeof vi.fn>;
    getUserInfo: ReturnType<typeof vi.fn>;
    approveLoan: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    apiServiceMock = {
      getPendingApprovals: vi.fn().mockReturnValue(of(mockPendingApprovals)),
      getPendingApprovalDetails: vi.fn().mockReturnValue(of(mockLoanDetails)),
      getUserInfo: vi.fn().mockReturnValue(of(mockUserInfo)),
      approveLoan: vi.fn().mockReturnValue(of({ id: 'loan-1', status: 1 })),
    };

    TestBed.configureTestingModule({
      providers: [
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
      expect(store.error()).toBe('Access denied. Support role required.');
      expect(store.loading()).toBe(false);
    });
  });

  describe('selectLoan', () => {
    it('should fetch loan details and user info when selecting a loan', () => {
      store.selectLoan('loan-1');
      expect(store.selectedLoanId()).toBe('loan-1');
      expect(apiServiceMock.getPendingApprovalDetails).toHaveBeenCalledWith(
        'loan-1',
      );
      expect(store.detailsCache()['loan-1']).toEqual(mockLoanDetails);
    });

    it('should use cached details and not make duplicate API call', () => {
      store.selectLoan('loan-1');
      expect(apiServiceMock.getPendingApprovalDetails).toHaveBeenCalledTimes(1);
      store.clearSelection();
      store.selectLoan('loan-1');
      expect(apiServiceMock.getPendingApprovalDetails).toHaveBeenCalledTimes(1);
    });

    it('should cancel previous request when selecting different loan (switchMap)', () => {
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

    it('should use cached user info and not make duplicate API call', () => {
      store.loadUserInfo('user-1');
      expect(apiServiceMock.getUserInfo).toHaveBeenCalledTimes(1);
      store.loadUserInfo('user-1');
      expect(apiServiceMock.getUserInfo).toHaveBeenCalledTimes(1);
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
      expect(store.detailsCache()['loan-1']).toBeDefined();
      store.approveLoan('loan-1');
      expect(store.detailsCache()['loan-1']).toBeUndefined();
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
    it('selectedLoanDetails should return cached details for selected loan', () => {
      store.selectLoan('loan-1');
      expect(store.selectedLoanDetails()).toEqual(mockLoanDetails);
    });

    it('selectedUserInfo should return cached user info for selected loan', () => {
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
      store.selectLoan('loan-1');
      expect(store.selectedLoanId()).toBe('loan-1');
      store.clearSelection();
      expect(store.selectedLoanId()).toBeNull();
      expect(store.actionError()).toBeNull();
    });
  });
});
