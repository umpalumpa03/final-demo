import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { LoanManagementApiService } from '../shared/services/loan-management-api.service';
import { LoanManagementStore } from '../store/loan-management.store';

import { patchState } from '@ngrx/signals';
import {
  PendingApproval,
  LoanDetailsResponse,
  LoanManagementState,
  UserInfo,
  ApproveLoanResponse,
} from '../shared/models/loan-management.model';

export const mockPendingApprovals: PendingApproval[] = [
  {
    id: 'loan-1',
    userId: 'user-1',
    userFullName: 'John Doe',
    loanAmount: 5000,
    accountId: 'acc-1',
    months: 12,
    purpose: 'education',
    status: 1,
    statusName: 'Pending',
    address: {
      street: '123 Main St',
      city: 'Tbilisi',
      region: 'Tbilisi',
      postalCode: '0100',
    },
    contactPerson: {
      name: 'Jane Doe',
      relationship: 'spouse',
      phone: '555-1234',
      email: 'jane@test.com',
    },
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'loan-2',
    userId: 'user-2',
    userFullName: 'Jane Smith',
    loanAmount: 10000,
    accountId: 'acc-2',
    months: 24,
    purpose: 'medical',
    status: 1,
    statusName: 'Pending',
    address: {
      street: '456 Oak Ave',
      city: 'Batumi',
      region: 'Adjara',
      postalCode: '6000',
    },
    contactPerson: {
      name: 'Bob Smith',
      relationship: 'sibling',
      phone: '555-5678',
      email: 'bob@test.com',
    },
    createdAt: '2026-02-05T10:00:00Z',
  },
];

export const mockUserInfo: UserInfo = {
  fullName: 'John Doe',
  email: 'john@test.com',
  phoneNumber: '555-1234',
  employmentStatus: 'Employed',
  address: '123 Main St, Tbilisi',
  annualIncome: 60000,
  creditScore: 720,
  creditScoreBadge: 'Good',
};

export const mockLoanDetailsResponse: LoanDetailsResponse = {
  loanDetails: {
    loanAmount: 5000,
    loanPurpose: 'education',
    loanTermMonths: 12,
    interestRate: 8.5,
    monthlyPayment: 436.5,
    requestDate: '2026-02-01',
  },
  riskAssessment: {
    debtToIncomeRatio: 0.25,
    loanToIncomeRatio: 0.08,
    totalInterest: 238,
  },
};

export const mockApproveResponse: ApproveLoanResponse = {
  id: 'loan-1',
  status: 2,
  statusName: 'Approved',
  approvedAt: '2026-02-09T12:00:00Z',
};

export const mockRejectResponse: ApproveLoanResponse = {
  id: 'loan-1',
  status: 3,
  statusName: 'Rejected',
  rejectedAt: '2026-02-09T12:00:00Z',
  rejectionReason: 'Insufficient income',
};

export interface LoanManagementTestContext {
  readonly httpMock: HttpTestingController;
  readonly store: InstanceType<typeof LoanManagementStore>;
}

export function patchStoreState(
  store: InstanceType<typeof LoanManagementStore>,
  state: Partial<LoanManagementState>,
): void {
  patchState(store as Parameters<typeof patchState>[0], state);
}

export async function setupLoanManagementTest(): Promise<LoanManagementTestContext> {
  await TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideTranslateService(),
      LoanManagementStore,
      LoanManagementApiService,
    ],
  }).compileComponents();

  const httpMock = TestBed.inject(HttpTestingController);
  const store = TestBed.inject(LoanManagementStore);

  return { httpMock, store };
}

export function cleanupLoanManagementTest(
  httpMock: HttpTestingController,
): void {
  try {
    httpMock.verify();
  } finally {
    TestBed.resetTestingModule();
  }
}
