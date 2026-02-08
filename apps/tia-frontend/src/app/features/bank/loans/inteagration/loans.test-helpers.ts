import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideStore, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideTranslateService } from '@ngx-translate/core';

import { LoanCreateService } from '@tia/shared/services/loans/loan-create.service';
import { LoansService } from '../shared/services/loans.service';
import { LoansStore } from '../store/loans.store';
import { LoanCreateEffects } from 'apps/tia-frontend/src/app/store/loans/loans.effects';
import { loansReducer } from 'apps/tia-frontend/src/app/store/loans/loans.reducer';

import { ILoan } from '../shared/models/loan.model';
import { ILoanRequest } from '../shared/models/loan-request.model';

export const mockLoanRequest: ILoanRequest = {
  loanAmount: 5000,
  amountToReceiveAccountId: 'acc-123',
  months: 24,
  purpose: 'personal',
  firstPaymentDate: '2026-03-01',
  contact: {
    address: {
      street: 'Test St',
      city: 'Test City',
      region: 'Test Region',
      postalCode: '1234',
    },
    contactPerson: {
      name: 'Contact Name',
      relationship: 'Friend',
      phone: '555111222',
      email: 'test@test.com',
    },
  },
};

export const mockLoanResponse: ILoan = {
  id: 'loan-123',
  loanAmount: 5000,
  accountId: 'acc-123',
  months: 24,
  purpose: 'personal',
  status: 1,
  statusName: 'Pending',
  monthlyPayment: 250,
  nextPaymentDate: null,
  createdAt: '2026-02-08T12:00:00Z',
  friendlyName: null,
};

export const mockLoansList: ILoan[] = [
  { ...mockLoanResponse, id: 'loan-1' },
  { ...mockLoanResponse, id: 'loan-2', status: 2, statusName: 'Approved' },
];

export interface TestContext {
  httpMock: HttpTestingController;
  globalStore: Store;
  loansStore: InstanceType<typeof LoansStore>;
}

export async function setupLoansTest(): Promise<TestContext> {
  await TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideTranslateService(),

      provideStore({ loanCreate: loansReducer }),
      provideEffects(LoanCreateEffects),
      LoanCreateService,

      LoansStore,
      LoansService,
    ],
  }).compileComponents();

  const httpMock = TestBed.inject(HttpTestingController);
  const globalStore = TestBed.inject(Store);
  const loansStore = TestBed.inject(LoansStore);

  return { httpMock, globalStore, loansStore };
}

export function cleanupLoansTest(httpMock: HttpTestingController): void {
  try {
    httpMock.verify();
  } finally {
    TestBed.resetTestingModule();
  }
}
