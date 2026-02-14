import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  TransferTestContext,
  setupTransferTest,
  cleanupTransferTest,
  BASE_URL,
  mockSenderAccountGEL,
} from './transfers-external.test-helpers';

describe('External Transfer - External Bank Flow', () => {
  let ctx: TransferTestContext;

  beforeEach(async () => {
    vi.useFakeTimers();
    ctx = await setupTransferTest();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanupTransferTest(ctx.httpMock);
  });

  it('should set external recipient without API call, enter name, select sender, calculate fee, transfer with OTP, and succeed', async () => {
    const externalIban = 'GE29BOG0000000000011';

    ctx.recipientService.verifyRecipient(externalIban);

    ctx.httpMock.expectNone(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-iban`,
    );
    ctx.httpMock.expectNone(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-personal-info`,
    );

    expect(ctx.transferStore.recipientType()).toBe('iban-different-bank');
    expect(ctx.transferStore.recipientInput()).toBe(externalIban);

    ctx.transferStore.setManualRecipientName('External Recipient');

    expect(ctx.transferStore.manualRecipientName()).toBe('External Recipient');

    ctx.transferStore.setSenderAccount(mockSenderAccountGEL);

    ctx.amountService.handleAmountInput(300);

    expect(ctx.transferStore.amount()).toBe(300);
    expect(ctx.transferStore.isFeeLoading()).toBe(true);

    vi.advanceTimersByTime(350);

    const feeReq = ctx.httpMock.expectOne(
      (req) => req.url === `${BASE_URL}/get-fee` && req.method === 'GET',
    );
    expect(feeReq.request.params.get('senderAccountId')).toBe('sender-1');
    expect(feeReq.request.params.get('amountToSend')).toBe('300');

    feeReq.flush({ fee: 5 });

    expect(ctx.transferStore.isFeeLoading()).toBe(false);
    expect(ctx.transferStore.fee()).toBe(5);
    expect(ctx.transferStore.totalWithFee()).toBe(305);
    expect(ctx.transferStore.hasInsufficientBalance()).toBe(false);

    ctx.transferStore.setDescription('External transfer');
    ctx.executionService.handleOtherBankTransfer();

    const transferReq = ctx.httpMock.expectOne(
      `${BASE_URL}/someone/external-bank`,
    );
    expect(transferReq.request.method).toBe('POST');
    expect(transferReq.request.body).toEqual({
      senderAccountId: 'sender-1',
      receiverAccountIban: externalIban,
      receiverAccountCurrency: 'GEL',
      receiverName: 'External Recipient',
      amountToSend: 300,
      description: 'External transfer',
    });

    transferReq.flush({
      verify: { challengeId: 'challenge-ext', method: 'otp' },
      transferType: 'EXTERNAL_BANK',
    });

    expect(ctx.transferStore.requiresOtp()).toBe(true);
    expect(ctx.transferStore.challengeId()).toBe('challenge-ext');

    ctx.executionService.verifyTransfer('654321');

    const verifyReq = ctx.httpMock.expectOne(`${BASE_URL}/verify`);
    expect(verifyReq.request.body).toEqual({
      challengeId: 'challenge-ext',
      code: '654321',
    });

    verifyReq.flush({ success: true, transferId: 'tx-ext-001' });

    expect(ctx.transferStore.transferSuccess()).toBe(true);
    expect(ctx.transferStore.requiresOtp()).toBe(false);
  });

  it('should calculate fee with debounce and update total', () => {
    ctx.transferStore.setExternalRecipient(
      'GE29BOG0000000000011',
      'iban-different-bank',
    );
    ctx.transferStore.setSenderAccount(mockSenderAccountGEL);

    ctx.amountService.handleAmountInput(1000);

    expect(ctx.transferStore.isFeeLoading()).toBe(true);

    vi.advanceTimersByTime(350);

    const feeReq = ctx.httpMock.expectOne(
      (req) => req.url === `${BASE_URL}/get-fee`,
    );
    feeReq.flush({ fee: 15 });

    expect(ctx.transferStore.fee()).toBe(15);
    expect(ctx.transferStore.totalWithFee()).toBe(1015);
    expect(ctx.transferStore.isFeeLoading()).toBe(false);
  });

  it('should mark insufficient balance when total with fee exceeds balance', () => {
    ctx.transferStore.setExternalRecipient(
      'GE29BOG0000000000011',
      'iban-different-bank',
    );
    ctx.transferStore.setSenderAccount(mockSenderAccountGEL);

    ctx.amountService.handleAmountInput(4990);

    vi.advanceTimersByTime(350);

    const feeReq = ctx.httpMock.expectOne(
      (req) => req.url === `${BASE_URL}/get-fee`,
    );
    feeReq.flush({ fee: 20 });

    expect(ctx.transferStore.totalWithFee()).toBe(5010);
    expect(ctx.transferStore.hasInsufficientBalance()).toBe(true);
  });

  it('should handle international IBAN as external bank', () => {
    const intlIban = 'DE89370400440532013000';

    ctx.recipientService.verifyRecipient(intlIban);

    ctx.httpMock.expectNone(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-iban`,
    );

    expect(ctx.transferStore.recipientType()).toBe('iban-different-bank');
    expect(ctx.transferStore.recipientInput()).toBe(intlIban);
  });
});
