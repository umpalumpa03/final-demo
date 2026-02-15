import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { environment } from '../../../../../environments/environment';
import {
  TestContext,
  setupLoansTest,
  cleanupLoansTest,
} from './loans.test-helpers';

describe('Loans Integration - Prepayment Wizard Flow', () => {
  let ctx: TestContext;

  beforeEach(async () => {
    ctx = await setupLoansTest();
  });

  afterEach(() => {
    if (ctx?.httpMock) {
      cleanupLoansTest(ctx.httpMock);
    }
  });

  it('should complete partial prepayment flow successfully', async () => {
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

    ctx.loansStore.calculatePrepayment({
      payload: {
        loanId: mockLoan.id,
        type: 'partial',
        amount: 1000,
        loanPartialPaymentType: 'reduceMonthlyPayment',
      },
    });

    const calcReq = ctx.httpMock.expectOne(
      (req: {
        url: string;
        method: string;
        params: { get: (k: string) => string | null };
      }) =>
        req.url.includes('/loans/calculate-partial-prepayment') &&
        req.method === 'GET' &&
        req.params.get('loanId') === mockLoan.id &&
        req.params.get('amount') === '1000' &&
        req.params.get('option') === 'reduceMonthlyPayment',
    );
    calcReq.flush(mockCalculationResult);

    await vi.waitFor(() => {
      expect(ctx.loansStore.calculationResult()).toEqual(mockCalculationResult);
    });

    ctx.loansStore.initiatePrepayment({
      payload: {
        loanId: mockLoan.id,
        paymentAccountId: mockLoan.accountId,
        amount: 1000,
        loanPrepaymentOption: 'partial',
        loanPartialPaymentType: 'reduceMonthlyPayment',
      },
    });

    const initiateReq = ctx.httpMock.expectOne(
      (req: { url: string; method: string }) =>
        req.url.includes('/loans/loan-prepayment') && req.method === 'POST',
    );
    initiateReq.flush(mockInitiateResponse);

    await vi.waitFor(() => {
      expect(ctx.loansStore.activeChallengeId()).toBe('challenge-abc');
    });

    ctx.loansStore.verifyPrepayment({
      payload: { challengeId: 'challenge-abc', code: '123456' },
    });

    const verifyReq = ctx.httpMock.expectOne((req: { url: string }) =>
      req.url.includes('/verify-prepayment'),
    );
    verifyReq.flush(mockVerifyResponse);

    await vi.waitFor(() => {
      expect(ctx.loansStore.activeChallengeId()).toBeNull();
    });

    const mockUpdatedLoans = [
      {
        ...mockLoan,
        loanAmount: 9000,
        friendlyName: 'Car Loan',
        purpose: 'Vehicle',
      },
    ];
    const reloadReq = ctx.httpMock.expectOne(
      (req: { url: string; method: string }) =>
        req.url.endsWith('/loans') && req.method === 'GET',
    );
    reloadReq.flush(mockUpdatedLoans);

    await vi.waitFor(() => {
      expect(ctx.loansStore.loans().length).toBe(1);
      expect(ctx.loansStore.loans()[0].loanAmount).toBe(9000);
    });
  });

  it('should handle prepayment verification failure and then success', async () => {
    ctx.loansStore.initiatePrepayment({
      payload: {
        loanId: 'loan-123',
        paymentAccountId: 'acc-1',
        amount: 1000,
        loanPrepaymentOption: 'partial',
        loanPartialPaymentType: 'reduceMonthlyPayment',
      },
    });

    const initiateReq = ctx.httpMock.expectOne((req: { url: string }) =>
      req.url.includes('/loans/loan-prepayment'),
    );
    initiateReq.flush({
      success: true,
      message: 'Success',
      verify: { challengeId: 'challenge-abc', method: 'SMS' },
    });

    await vi.waitFor(() => {
      expect(ctx.loansStore.activeChallengeId()).toBe('challenge-abc');
    });

    ctx.loansStore.verifyPrepayment({
      payload: {
        challengeId: 'challenge-abc',
        code: 'wrong-code',
      },
    });

    const failReq = ctx.httpMock.expectOne((req: { url: string }) =>
      req.url.includes('/verify-prepayment'),
    );
    failReq.flush(
      { success: false, message: 'Invalid verification code' },
      { status: 400, statusText: 'Bad Request' },
    );

    await vi.waitFor(() => {
      expect(ctx.loansStore.actionLoading()).toBe(false);
      expect(ctx.loansStore.error()).toBeNull();
    });

    ctx.loansStore.verifyPrepayment({
      payload: { challengeId: 'challenge-abc', code: '123' },
    });

    const successReq = ctx.httpMock.expectOne((req: { url: string }) =>
      req.url.includes('/verify-prepayment'),
    );
    successReq.flush({ success: true });

    const reloadReq = ctx.httpMock.expectOne(
      (req: { url: string; method: string }) =>
        req.url.endsWith('/loans') && req.method === 'GET',
    );
    reloadReq.flush([{ id: 'loan-123', loanAmount: 9000 }]);

    await vi.waitFor(() => {
      expect(ctx.loansStore.loans()[0].loanAmount).toBe(9000);
    });
  });

  it('should clear cache after successful prepayment', async () => {
    ctx.loansStore.loadLoanDetails('loan-123');

    const detailsReq = ctx.httpMock.expectOne((req: { url: string }) =>
      req.url.includes('/loans/loan-123'),
    );
    detailsReq.flush({
      id: 'loan-123',
      loanAmount: 10000,
      friendlyName: 'Car Loan',
    });

    await vi.waitFor(() => {
      expect(Object.keys(ctx.loansStore.loanDetailsCache()).length).toBe(1);
    });

    ctx.loansStore.initiatePrepayment({
      payload: {
        loanId: 'loan-123',
        loanPrepaymentOption: 'partial',
        paymentAccountId: 'acc-1',
        amount: 1000,
        loanPartialPaymentType: 'reduceMonthlyPayment',
      },
    });

    const initiateReq = ctx.httpMock.expectOne((req: { url: string }) =>
      req.url.includes('/loans/loan-prepayment'),
    );
    initiateReq.flush({
      success: true,
      message: 'Success',
      verify: { challengeId: 'challenge-abc', method: 'SMS' },
    });

    await vi.waitFor(() => {
      expect(ctx.loansStore.activeChallengeId()).toBe('challenge-abc');
    });

    ctx.loansStore.verifyPrepayment({
      payload: { challengeId: 'challenge-abc', code: '123' },
    });

    const verifyReq = ctx.httpMock.expectOne((req: { url: string }) =>
      req.url.includes('/verify-prepayment'),
    );
    verifyReq.flush({ success: true });

    const reloadReq = ctx.httpMock.expectOne((req: { url: string }) =>
      req.url.endsWith('/loans'),
    );
    reloadReq.flush([]);

    await vi.waitFor(() => {
      expect(ctx.loansStore.loanDetailsCache()).toEqual({});
    });
  });
});
