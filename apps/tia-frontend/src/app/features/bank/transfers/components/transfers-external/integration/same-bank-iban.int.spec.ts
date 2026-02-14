import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  TransferTestContext,
  setupTransferTest,
  cleanupTransferTest,
  BASE_URL,
  mockSenderAccountGEL,
  mockRecipientAccountGEL,
  mockRecipientResponseIban,
} from './transfers-external.test-helpers';

describe('External Transfer - Same Bank IBAN Flow', () => {
  let ctx: TransferTestContext;

  beforeEach(async () => {
    ctx = await setupTransferTest();
  });

  afterEach(() => {
    cleanupTransferTest(ctx.httpMock);
  });

  it('should lookup by same-bank IBAN, select accounts, transfer without OTP, and succeed', async () => {
    const sameBankIban = 'GE29TIA0000000000099';

    ctx.transferStore.lookupRecipient({
      value: sameBankIban,
      type: 'iban-same-bank',
    });

    const lookupReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-iban`,
    );
    expect(lookupReq.request.method).toBe('POST');
    expect(lookupReq.request.body).toEqual({ iban: sameBankIban });

    lookupReq.flush(mockRecipientResponseIban);

    await vi.waitFor(() => {
      expect(ctx.transferStore.recipientInfo()).toBeTruthy();
      expect(ctx.transferStore.recipientInfo()!.fullName).toBe(
        'Nino Kapanadze',
      );
      expect(ctx.transferStore.recipientType()).toBe('iban-same-bank');
    });

    ctx.transferStore.setSelectedRecipientAccount(mockRecipientAccountGEL);

    ctx.transferStore.setSenderAccount(mockSenderAccountGEL);

    expect(ctx.transferStore.senderAccount()!.currency).toBe('GEL');
    expect(ctx.transferStore.selectedRecipientAccount()!.currency).toBe('GEL');

    ctx.amountService.handleAmountInput(200);

    expect(ctx.transferStore.amount()).toBe(200);
    expect(ctx.transferStore.fee()).toBe(0);
    expect(ctx.transferStore.totalWithFee()).toBe(200);
    expect(ctx.transferStore.hasInsufficientBalance()).toBe(false);

    ctx.transferStore.setDescription('IBAN transfer');
    ctx.executionService.handleSameBankTransfer();

    const transferReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfers/someone`,
    );
    expect(transferReq.request.body).toEqual({
      senderAccountId: 'sender-1',
      receiverAccountIban: mockRecipientAccountGEL.iban,
      description: 'IBAN transfer',
      amountToSend: 200,
    });

    transferReq.flush({
      verify: { challengeId: 'challenge-iban', method: null },
      transferType: 'SAME_BANK',
    });

    const verifyReq = ctx.httpMock.expectOne(`${BASE_URL}/verify`);
    expect(verifyReq.request.body).toEqual({
      challengeId: 'challenge-iban',
    });
    verifyReq.flush({ success: true, transferId: 'tx-iban-001' });

    await vi.waitFor(() => {
      expect(ctx.transferStore.transferSuccess()).toBe(true);
    });
  });

  it('should not re-fetch when lookupRecipient called with same data already fetched', async () => {
    const sameBankIban = 'GE29TIA0000000000099';

    ctx.transferStore.lookupRecipient({
      value: sameBankIban,
      type: 'iban-same-bank',
    });

    const lookupReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-iban`,
    );
    lookupReq.flush(mockRecipientResponseIban);

    await vi.waitFor(() => {
      expect(ctx.transferStore.recipientInfo()).toBeTruthy();
      expect(ctx.transferStore.isVerified()).toBe(true);
    });
  });

  it('should clear previous state when looking up a different IBAN', async () => {
    const firstIban = 'GE29TIA0000000000099';

    ctx.transferStore.lookupRecipient({
      value: firstIban,
      type: 'iban-same-bank',
    });

    const req1 = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-iban`,
    );
    req1.flush(mockRecipientResponseIban);

    await vi.waitFor(() => {
      expect(ctx.transferStore.recipientInfo()!.fullName).toBe(
        'Nino Kapanadze',
      );
    });

    ctx.transferStore.setSenderAccount(mockSenderAccountGEL);
    ctx.transferStore.setSelectedRecipientAccount(mockRecipientAccountGEL);
    ctx.transferStore.setAmount(500);

    const secondIban = 'GE29TIA0000000000088';
    ctx.transferStore.lookupRecipient({
      value: secondIban,
      type: 'iban-same-bank',
    });

    expect(ctx.transferStore.senderAccount()).toBeNull();
    expect(ctx.transferStore.selectedRecipientAccount()).toBeNull();
    expect(ctx.transferStore.amount()).toBe(0);

    const req2 = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-iban`,
    );
    req2.flush({
      fullName: 'Another User',
      accounts: [{ id: 'acc-new', iban: secondIban, currency: 'GEL' }],
    });

    await vi.waitFor(() => {
      expect(ctx.transferStore.recipientInfo()!.fullName).toBe('Another User');
    });
  });
});
