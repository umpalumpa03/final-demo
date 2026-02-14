import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { LoansStore } from '../store/loans.store';
import { LoansService } from '../shared/services/loans.service';
import { AlertService } from '@tia/shared/services/settings-language/alert.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

describe('Loans Integration - Prepayment Wizard Flow', () => {
  let store: InstanceType<typeof LoansStore>;
  let httpMock: HttpTestingController;
  let alertService: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        LoansStore,
        LoansService,
        AlertService,
        TranslateService,
        { provide: Store, useValue: { selectSignal: () => () => [] } },
      ],
    });

    store = TestBed.inject(LoansStore);
    httpMock = TestBed.inject(HttpTestingController);
    alertService = TestBed.inject(AlertService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should complete partial prepayment flow successfully', () => {
    const mockLoan = {
      id: 'loan-123',
      loanAmount: 10000,
      accountId: 'acc-1',
      status: 2,
    };

    const mockCalculationResult = {
      displayedInfo: [
        {
          label: 'New Monthly Payment',
          value: '450',
          text: 'New Monthly Payment',
          amount: 450,
        },
        {
          label: 'Total Interest Saved',
          value: '1200',
          text: 'Total Interest Saved',
          amount: 1200,
        },
      ],
    };

    const mockInitiateResponse = {
      success: true,
      message: 'Success',
      verify: { challengeId: 'challenge-abc', method: 'SMS' },
    };

    const mockVerifyResponse = {
      success: true,
      message: 'Payment completed successfully',
    };

    store.calculatePrepayment({
      payload: {
        loanId: mockLoan.id,
        type: 'partial',
        amount: 1000,
        loanPartialPaymentType: 'reduceMonthlyPayment',
      },
    });

    const calcReq = httpMock.expectOne(
      (req) =>
        req.url.includes('/loans/calculate-partial-prepayment') &&
        req.method === 'GET' &&
        req.params.get('loanId') === mockLoan.id &&
        req.params.get('amount') === '1000' &&
        req.params.get('option') === 'reduceMonthlyPayment',
    );
    calcReq.flush(mockCalculationResult);

    expect(store.calculationResult()).toEqual(mockCalculationResult);

    store.initiatePrepayment({
      payload: {
        loanId: mockLoan.id,
        paymentAccountId: mockLoan.accountId,
        amount: 1000,
        loanPrepaymentOption: 'partial',
        loanPartialPaymentType: 'reduceMonthlyPayment',
      },
    });

    const initiateReq = httpMock.expectOne(
      (req) =>
        req.url.includes('/loans/loan-prepayment') && req.method === 'POST',
    );
    initiateReq.flush(mockInitiateResponse);

    expect(store.activeChallengeId()).toBe('challenge-abc');

    store.verifyPrepayment({
      payload: { challengeId: 'challenge-abc', code: '123456' },
    });

    const verifyReq = httpMock.expectOne((req) =>
      req.url.includes('/verify-prepayment'),
    );
    verifyReq.flush(mockVerifyResponse);

    expect(store.activeChallengeId()).toBeNull();

    const mockUpdatedLoans = [
      {
        ...mockLoan,
        loanAmount: 9000,
        friendlyName: 'Car Loan',
        purpose: 'Vehicle',
      },
    ];
    const reloadReq = httpMock.expectOne(
      (req) => req.url.endsWith('/loans') && req.method === 'GET',
    );
    reloadReq.flush(mockUpdatedLoans);

    expect(store.loans().length).toBe(1);
    expect(store.loans()[0].loanAmount).toBe(9000);
  });

  it('should handle prepayment verification failure and then success', () => {
    store.initiatePrepayment({
      payload: {
        loanId: 'loan-123',
        paymentAccountId: 'acc-1',
        amount: 1000,
        loanPrepaymentOption: 'partial',
        loanPartialPaymentType: 'reduceMonthlyPayment',
      },
    });

    const initiateReq = httpMock.expectOne((req) =>
      req.url.includes('/loans/loan-prepayment'),
    );
    initiateReq.flush({
      success: true,
      message: 'Success',
      verify: { challengeId: 'challenge-abc', method: 'SMS' },
    });

    store.verifyPrepayment({
      payload: {
        challengeId: 'challenge-abc',
        code: 'wrong-code',
      },
    });

    const failReq = httpMock.expectOne((r) =>
      r.url.includes('/verify-prepayment'),
    );
    failReq.flush({
      success: false,
      message: 'Invalid verification code',
    });

    expect(store.error()).toBeTruthy();

    store.verifyPrepayment({ payload: { challengeId: 'ch', code: '123' } });

    const successReq = httpMock.expectOne((r) =>
      r.url.includes('/verify-prepayment'),
    );
    successReq.flush({ success: true });

    const reloadReq = httpMock.expectOne(
      (req) => req.url.endsWith('/loans') && req.method === 'GET',
    );
    reloadReq.flush([{ id: 'loan-123', loanAmount: 9000 }]);

    expect(store.loans()[0].loanAmount).toBe(9000);
  });

  it('should clear cache after successful prepayment', () => {
    store.loadLoanDetails('loan-123');

    const detailsReq = httpMock.expectOne((req) =>
      req.url.includes('/loans/loan-123'),
    );
    detailsReq.flush({
      id: 'loan-123',
      loanAmount: 10000,
      friendlyName: 'Car Loan',
    });

    expect(Object.keys(store.loanDetailsCache()).length).toBe(1);

    store.initiatePrepayment({
      payload: {
        loanId: 'loan-123',
        loanPrepaymentOption: 'partial',
        paymentAccountId: 'acc-1',
        amount: 1000,
        loanPartialPaymentType: 'full',
      },
    });

    const initiateReq = httpMock.expectOne((req) =>
      req.url.includes('/loans/loan-prepayment'),
    );
    initiateReq.flush({
      success: true,
      message: 'Success',
      verify: { challengeId: 'challenge-abc', method: 'SMS' },
    });

    store.verifyPrepayment({ payload: { challengeId: 'ch', code: '123' } });

    httpMock
      .expectOne((r) => r.url.includes('/verify-prepayment'))
      .flush({ success: true });

    httpMock.expectOne((r) => r.url.endsWith('/loans')).flush([]);

    expect(store.loanDetailsCache()).toEqual({});
  });
});
