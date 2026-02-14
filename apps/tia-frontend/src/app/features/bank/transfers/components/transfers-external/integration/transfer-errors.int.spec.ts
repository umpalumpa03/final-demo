import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  TransferTestContext,
  setupTransferTest,
  cleanupTransferTest,
  BASE_URL,
  mockSenderAccountGEL,
  mockRecipientAccountGEL,
  mockRecipientResponsePhone,
} from './transfers-external.test-helpers';

describe('External Transfer - Transfer Errors', () => {
  let ctx: TransferTestContext;

  beforeEach(async () => {
    ctx = await setupTransferTest();
    ctx.transferStore.setRecipientInfo(
      mockRecipientResponsePhone,
      '599112233',
      'phone',
    );
    ctx.transferStore.setSelectedRecipientAccount(mockRecipientAccountGEL);
    ctx.transferStore.setSenderAccount(mockSenderAccountGEL);
    ctx.transferStore.setAmount(100);
    ctx.transferStore.setDescription('Test');
  });

  afterEach(() => {
    cleanupTransferTest(ctx.httpMock);
  });

  it('should flag insufficient balance when amount exceeds available balance', () => {
    ctx.amountService.handleAmountInput(6000);

    expect(ctx.transferStore.hasInsufficientBalance()).toBe(true);
    expect(ctx.transferStore.amount()).toBe(6000);
  });

  it('should clear insufficient balance flag when amount is reduced', () => {
    ctx.amountService.handleAmountInput(6000);
    expect(ctx.transferStore.hasInsufficientBalance()).toBe(true);

    ctx.amountService.handleAmountInput(1000);
    expect(ctx.transferStore.hasInsufficientBalance()).toBe(false);
  });

  it('should set noPermission error and reset sender on 400 transfer API failure', async () => {
    ctx.executionService.handleSameBankTransfer();

    const transferReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfers/someone`,
    );

    transferReq.flush(
      { statusCode: 400, message: 'No permission' },
      { status: 400, statusText: 'Bad Request' },
    );

    await vi.waitFor(() => {
      expect(ctx.transferStore.error()).toBe(
        'transfers.external.accounts.noPermission',
      );
      expect(ctx.transferStore.senderAccount()).toBeNull();
    });
  });

  it('should set error message on non-400 transfer API failure', async () => {
    ctx.executionService.handleSameBankTransfer();

    const transferReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfers/someone`,
    );

    transferReq.flush(
      { message: 'Internal server error' },
      { status: 500, statusText: 'Server Error' },
    );

    await vi.waitFor(() => {
      expect(ctx.transferStore.error()).toBe('Internal server error');
      expect(ctx.transferStore.isLoading()).toBe(false);
    });
  });

  it('should set error when OTP verification fails with invalid code', async () => {
    ctx.executionService.handleSameBankTransfer();

    const transferReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfers/someone`,
    );
    transferReq.flush({
      verify: { challengeId: 'challenge-fail', method: 'otp' },
      transferType: 'SAME_BANK',
    });

    await vi.waitFor(() => {
      expect(ctx.transferStore.requiresOtp()).toBe(true);
    });

    ctx.executionService.verifyTransfer('000000');

    const verifyReq = ctx.httpMock.expectOne(`${BASE_URL}/verify`);
    verifyReq.flush({
      success: false,
      transferId: '',
      message: 'Invalid OTP code',
    });

    await vi.waitFor(() => {
      expect(ctx.transferStore.error()).toBe('Invalid OTP code');
      expect(ctx.transferStore.transferSuccess()).toBe(false);
    });
  });

  it('should handle 400 error during OTP verification and reset sender', async () => {
    ctx.transferStore.setChallengeId('challenge-400');
    ctx.transferStore.setRequiresOtp(true);

    ctx.executionService.verifyTransfer('123456');

    const verifyReq = ctx.httpMock.expectOne(`${BASE_URL}/verify`);
    verifyReq.flush(
      { statusCode: 400, message: 'Bad request' },
      { status: 400, statusText: 'Bad Request' },
    );

    await vi.waitFor(() => {
      expect(ctx.transferStore.error()).toBe(
        'transfers.external.accounts.noPermission',
      );
      expect(ctx.transferStore.senderAccount()).toBeNull();
    });
  });

  it('should not execute transfer when amount is zero', () => {
    ctx.transferStore.setAmount(0);

    ctx.executionService.handleSameBankTransfer();

    ctx.httpMock.expectNone(`${BASE_URL}/tia-transfers/someone`);
  });

  it('should not execute external bank transfer when required fields are missing', () => {
    ctx.transferStore.setExternalRecipient(
      'GE29BOG0000000000011',
      'iban-different-bank',
    );
    ctx.transferStore.setSenderAccount(mockSenderAccountGEL);
    ctx.transferStore.setAmount(0);

    ctx.executionService.handleOtherBankTransfer();

    ctx.httpMock.expectNone(`${BASE_URL}/someone/external-bank`);
  });

  it('should handle fee calculation error gracefully for external transfers', () => {
    vi.useFakeTimers();

    ctx.transferStore.setExternalRecipient(
      'GE29BOG0000000000011',
      'iban-different-bank',
    );
    ctx.transferStore.setSenderAccount(mockSenderAccountGEL);

    ctx.amountService.handleAmountInput(500);

    vi.advanceTimersByTime(350);

    const feeReq = ctx.httpMock.expectOne(
      (req) => req.url === `${BASE_URL}/get-fee`,
    );
    feeReq.flush(
      { message: 'Fee service unavailable' },
      { status: 503, statusText: 'Service Unavailable' },
    );

    expect(ctx.transferStore.isFeeLoading()).toBe(false);
    expect(ctx.transferStore.fee()).toBe(0);
    expect(ctx.transferStore.totalWithFee()).toBe(0);

    vi.useRealTimers();
  });
});
