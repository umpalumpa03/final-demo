import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../environments/environment';
import { patchState } from '@ngrx/signals';
import {
  TestContext,
  setupLoansTest,
  cleanupLoansTest,
  mockLoanResponse,
} from './loans.test-helpers';

describe('Loans Integration - Prepayment Wizard Flow', () => {
  let ctx: TestContext;

  const approvedLoanDetails = {
    ...mockLoanResponse,
    id: 'loan-approved',
    status: 2,
    remainingBalance: 5000,
    accountName: 'Test Acc',
    userId: 'user-1',
    currency: 'GEL',
    address: {},
    contactPerson: {},
    interestRate: 10,
    totalInterest: 500,
    totalAmountToPay: 5500,
    remainingPayments: 10,
    firstPaymentDate: '2026-01-01',
    lastPaymentDate: '2027-01-01',
    approvedAt: '2026-01-01',
  };

  beforeEach(async () => {
    ctx = await setupLoansTest();

    patchState(ctx.loansStore as any, {
      selectedLoanDetails: approvedLoanDetails as any,
      activePrepaymentLoan: approvedLoanDetails as any,
      isPrepaymentOpen: true,
    });
  });

  afterEach(() => {
    cleanupLoansTest(ctx.httpMock);
  });

  it('should complete partial prepayment flow successfully', async () => {
    const payload = {
      loanId: 'loan-approved',
      type: 'partial',
      amount: 1000,
      loanPartialPaymentType: 'reduceMonthlyPayment',
    };

    ctx.loansStore.calculatePrepayment({ payload: payload as any });

    expect(ctx.loansStore.actionLoading()).toBe(true);

    const calcReq = ctx.httpMock.expectOne((req) =>
      req.url.includes('/calculate-partial-prepayment'),
    );
    expect(calcReq.request.params.get('amount')).toBe('1000');

    calcReq.flush({
      displayedInfo: [{ text: 'New Monthly Payment', amount: 200 }],
    });

    await vi.waitFor(() => {
      expect(ctx.loansStore.calculationResult()).toBeTruthy();
      expect(ctx.loansStore.actionLoading()).toBe(false);
    });

    ctx.loansStore.initiatePrepayment({
      payload: {
        ...payload,
        loanPrepaymentOption: 'partial',
        paymentAccountId: 'acc-123',
      } as any,
    });

    const initReq = ctx.httpMock.expectOne(
      `${environment.apiUrl}/loans/loan-prepayment`,
    );
    initReq.flush({
      success: true,
      message: 'OTP Sent',
      verify: { challengeId: 'challenge-123', method: 'sms' },
    });

    await vi.waitFor(() => {
      expect(ctx.loansStore.activeChallengeId()).toBe('challenge-123');
      expect(ctx.loansStore.alertMessage()).toContain('OTP sent');
    });

    ctx.loansStore.verifyPrepayment({
      payload: { challengeId: 'challenge-123', code: '1234' },
    });

    const verifyReq = ctx.httpMock.expectOne(
      `${environment.apiUrl}/loans/verify-prepayment`,
    );
    verifyReq.flush({ success: true, message: 'Paid successfully' });

    const reloadReq = ctx.httpMock.expectOne(
      (req) => req.url.includes('/loans') && req.method === 'GET',
    );

    const updatedLoanList = [
      {
        ...mockLoanResponse,
        id: 'loan-approved',
        remainingBalance: 4000,
      },
    ];

    reloadReq.flush(updatedLoanList);

    await vi.waitFor(() => {
      expect(ctx.loansStore.activeChallengeId()).toBeNull();
      expect(ctx.loansStore.calculationResult()).toBeNull();

      const loan = ctx.loansStore.loans()[0] as any;
      expect(loan.remainingBalance).toBe(4000);
    });
  });

  it('should handle insufficient funds error during initiation', async () => {
    patchState(ctx.loansStore as any, {
      calculationResult: { displayedInfo: [] } as any,
    });

    ctx.loansStore.initiatePrepayment({
      payload: {
        loanId: '1',
        loanPrepaymentOption: 'full',
        paymentAccountId: '1',
      },
    });

    const req = ctx.httpMock.expectOne(
      `${environment.apiUrl}/loans/loan-prepayment`,
    );

    req.flush(
      { message: 'Insufficient funds in payment account' },
      { status: 400, statusText: 'Bad Request' },
    );

    await vi.waitFor(() => {
      expect(ctx.loansStore.alertMessage()).toBe(
        'Insufficient funds in payment account',
      );
      expect(ctx.loansStore.alertType()).toBe('error');
      expect(ctx.loansStore.actionLoading()).toBe(false);
    });
  });
});
