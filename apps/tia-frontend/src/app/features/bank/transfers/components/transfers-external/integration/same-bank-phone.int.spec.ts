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

describe('External Transfer - Same Bank Phone Flow', () => {
  let ctx: TransferTestContext;

  beforeEach(async () => {
    ctx = await setupTransferTest();
  });

  afterEach(() => {
    cleanupTransferTest(ctx.httpMock);
  });

  it('should lookup recipient by phone, select accounts, transfer with OTP, and succeed', async () => {
    ctx.transferStore.lookupRecipient({ value: '599112233', type: 'phone' });

    const lookupReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-personal-info`,
    );
    expect(lookupReq.request.method).toBe('POST');
    expect(lookupReq.request.body).toEqual({
      identifier: '599112233',
      identifierType: 'phoneNumber',
    });
    lookupReq.flush(mockRecipientResponsePhone);

    await vi.waitFor(() => {
      expect(ctx.transferStore.recipientInfo()).toBeTruthy();
      expect(ctx.transferStore.recipientInfo()!.fullName).toBe(
        'Giorgi Beridze',
      );
      expect(ctx.transferStore.recipientType()).toBe('phone');
    });

    ctx.transferStore.setSelectedRecipientAccount(mockRecipientAccountGEL);

    expect(ctx.transferStore.selectedRecipientAccount()!.currency).toBe('GEL');

    ctx.transferStore.setSenderAccount(mockSenderAccountGEL);

    expect(ctx.transferStore.senderAccount()!.id).toBe('sender-1');
    expect(ctx.transferStore.senderAccount()!.currency).toBe('GEL');

    ctx.amountService.handleAmountInput(100);

    expect(ctx.transferStore.amount()).toBe(100);
    expect(ctx.transferStore.hasInsufficientBalance()).toBe(false);
    expect(ctx.transferStore.totalWithFee()).toBe(100);
    expect(ctx.transferStore.fee()).toBe(0);

    ctx.transferStore.setDescription('Test transfer');
    ctx.executionService.handleSameBankTransfer();

    const transferReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfers/someone`,
    );
    expect(transferReq.request.method).toBe('POST');
    expect(transferReq.request.body).toEqual({
      senderAccountId: 'sender-1',
      receiverAccountIban: mockRecipientAccountGEL.iban,
      description: 'Test transfer',
      amountToSend: 100,
    });

    transferReq.flush({
      verify: { challengeId: 'challenge-abc', method: 'otp' },
      transferType: 'SAME_BANK',
    });

    await vi.waitFor(() => {
      expect(ctx.transferStore.requiresOtp()).toBe(true);
      expect(ctx.transferStore.challengeId()).toBe('challenge-abc');
    });

    ctx.executionService.verifyTransfer('123456');

    const verifyReq = ctx.httpMock.expectOne(`${BASE_URL}/verify`);
    expect(verifyReq.request.method).toBe('POST');
    expect(verifyReq.request.body).toEqual({
      challengeId: 'challenge-abc',
      code: '123456',
    });

    verifyReq.flush({ success: true, transferId: 'tx-001' });

    await vi.waitFor(() => {
      expect(ctx.transferStore.transferSuccess()).toBe(true);
      expect(ctx.transferStore.requiresOtp()).toBe(false);
    });
  });

  it('should store recipient info and mark as verified after phone lookup', async () => {
    ctx.transferStore.lookupRecipient({ value: '599112233', type: 'phone' });

    const lookupReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-personal-info`,
    );
    lookupReq.flush({
      fullName: 'Single Account User',
      accounts: [mockRecipientAccountGEL],
    });

    await vi.waitFor(() => {
      expect(ctx.transferStore.recipientInfo()!.fullName).toBe(
        'Single Account User',
      );
      expect(ctx.transferStore.recipientInfo()!.accounts.length).toBe(1);
      expect(ctx.transferStore.isVerified()).toBe(true);
      expect(ctx.transferStore.isLoading()).toBe(false);
    });
  });

  it('should keep multiple accounts unselected after lookup', async () => {
    ctx.transferStore.lookupRecipient({ value: '599112233', type: 'phone' });

    const lookupReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-personal-info`,
    );
    lookupReq.flush({
      fullName: 'Multi Account User',
      accounts: [
        mockRecipientAccountGEL,
        { id: 'acc-2', iban: 'GE00TIA002', currency: 'USD' },
      ],
    });

    await vi.waitFor(() => {
      expect(ctx.transferStore.recipientInfo()!.accounts.length).toBe(2);
      expect(ctx.transferStore.selectedRecipientAccount()).toBeNull();
    });
  });

  it('should skip OTP when transfer does not require verification', async () => {
    ctx.transferStore.setRecipientInfo(
      mockRecipientResponsePhone,
      '599112233',
      'phone',
    );
    ctx.transferStore.setSelectedRecipientAccount(mockRecipientAccountGEL);
    ctx.transferStore.setSenderAccount(mockSenderAccountGEL);
    ctx.transferStore.setAmount(50);
    ctx.transferStore.setDescription('No OTP transfer');

    ctx.executionService.handleSameBankTransfer();

    const transferReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfers/someone`,
    );

    transferReq.flush({
      verify: { challengeId: 'challenge-xyz', method: null },
      transferType: 'SAME_BANK',
    });

    const verifyReq = ctx.httpMock.expectOne(`${BASE_URL}/verify`);
    expect(verifyReq.request.body).toEqual({ challengeId: 'challenge-xyz' });
    verifyReq.flush({ success: true, transferId: 'tx-002' });

    await vi.waitFor(() => {
      expect(ctx.transferStore.transferSuccess()).toBe(true);
      expect(ctx.transferStore.requiresOtp()).toBe(false);
    });
  });
});
