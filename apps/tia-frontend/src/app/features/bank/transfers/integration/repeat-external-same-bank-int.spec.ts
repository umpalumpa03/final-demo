import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  RepeatTestContext,
  setupRepeatTest,
  cleanupRepeatTest,
  BASE_URL,
  mockSenderAccountUSD,
  mockReceiverAccountGEL,
  mockSenderAccountNoPermission,
  mockRecipientAccountGEL,
  mockRecipientResponseIban,
  mockSameBankTransaction,
} from './repeat-transfer.test-helpers';
import { ITransactions } from 'apps/tia-frontend/src/app/shared/models/transactions/transactions.models';

describe('Repeat Transfer - External Same Bank Flow', () => {
  let ctx: RepeatTestContext;

  beforeEach(async () => {
    ctx = await setupRepeatTest();
  });

  afterEach(() => {
    cleanupRepeatTest(ctx.httpMock);
  });

  it('should lookup by IBAN, populate store, and navigate to amount page', async () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    ctx.repeatService.initRepeatTransfer(mockSameBankTransaction);

    expect(ctx.transferStore.isLoading()).toBe(true);

    const lookupReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-iban`,
    );
    expect(lookupReq.request.method).toBe('POST');
    expect(lookupReq.request.body).toEqual({
      iban: 'GE00TIA0000000000099',
    });

    lookupReq.flush(mockRecipientResponseIban);

    await vi.waitFor(() => {
      expect(ctx.transferStore.isLoading()).toBe(false);
      expect(ctx.transferStore.recipientInfo()!.fullName).toBe(
        'Nino Kapanadze',
      );
      expect(ctx.transferStore.selectedRecipientAccount()!.currency).toBe(
        'GEL',
      );
      expect(ctx.transferStore.senderAccount()!.id).toBe('sender-1');
      expect(ctx.transferStore.amount()).toBe(200);
      expect(ctx.transferStore.description()).toBe('Same bank transfer');
      expect(ctx.transferStore.fee()).toBe(0);
      expect(ctx.transferStore.totalWithFee()).toBe(200);
      expect(navigateSpy).toHaveBeenCalledWith([
        '/bank/transfers/external/amount',
      ]);
    });
  });

  it('should match recipient account by currency from transaction', async () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    const usdTransaction: ITransactions = {
      ...mockSameBankTransaction,
      currency: 'USD',
      debitAccountNumber: mockSenderAccountUSD.iban,
    };

    ctx.repeatService.initRepeatTransfer(usdTransaction);

    const lookupReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-iban`,
    );

    lookupReq.flush({
      fullName: 'Multi Currency User',
      accounts: [
        mockRecipientAccountGEL,
        { id: 'acc-usd', iban: 'GE00TIA0000000000098', currency: 'USD' },
      ],
    });

    await vi.waitFor(() => {
      expect(ctx.transferStore.selectedRecipientAccount()!.currency).toBe(
        'USD',
      );
      expect(ctx.transferStore.selectedRecipientAccount()!.id).toBe('acc-usd');
      expect(navigateSpy).toHaveBeenCalledWith([
        '/bank/transfers/external/amount',
      ]);
    });
  });

  it('should fall back to first account when no currency match found', async () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    const eurTransaction: ITransactions = {
      ...mockSameBankTransaction,
      currency: 'EUR',
    };

    ctx.repeatService.initRepeatTransfer(eurTransaction);

    const lookupReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-iban`,
    );

    lookupReq.flush({
      fullName: 'No EUR User',
      accounts: [mockRecipientAccountGEL],
    });

    await vi.waitFor(() => {
      expect(ctx.transferStore.selectedRecipientAccount()!.id).toBe(
        'recipient-acc-1',
      );
      expect(navigateSpy).toHaveBeenCalledWith([
        '/bank/transfers/external/amount',
      ]);
    });
  });

  it('should create fallback account when response has no accounts but has currency', async () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    ctx.repeatService.initRepeatTransfer(mockSameBankTransaction);

    const lookupReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-iban`,
    );

    lookupReq.flush({
      fullName: 'Fallback User',
      accounts: [],
      currency: 'GEL',
    });

    await vi.waitFor(() => {
      expect(ctx.transferStore.selectedRecipientAccount()!.id).toBe(
        'iban-recipient',
      );
      expect(ctx.transferStore.selectedRecipientAccount()!.iban).toBe(
        'GE00TIA0000000000099',
      );
      expect(ctx.transferStore.selectedRecipientAccount()!.currency).toBe(
        'GEL',
      );
      expect(navigateSpy).toHaveBeenCalledWith([
        '/bank/transfers/external/amount',
      ]);
    });
  });

  it('should set error when recipient account cannot be resolved', async () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    ctx.repeatService.initRepeatTransfer(mockSameBankTransaction);

    const lookupReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-iban`,
    );

    lookupReq.flush({
      fullName: 'No Accounts User',
      accounts: [],
    });

    await vi.waitFor(() => {
      expect(ctx.transferStore.error()).toBe(
        'transfers.repeat.recipientAccountNotFound',
      );
      expect(ctx.transferStore.isLoading()).toBe(false);
      expect(navigateSpy).toHaveBeenCalledWith([
        '/bank/transfers/external/recipient',
      ]);
    });
  });

  it('should set error when sender account not found for same bank repeat', async () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    const transaction: ITransactions = {
      ...mockSameBankTransaction,
      debitAccountNumber: 'GE00TIA9999999999999',
    };

    ctx.repeatService.initRepeatTransfer(transaction);

    const lookupReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-iban`,
    );
    lookupReq.flush(mockRecipientResponseIban);

    await vi.waitFor(() => {
      expect(ctx.transferStore.error()).toBe(
        'transfers.external.accounts.senderNotFound',
      );
      expect(navigateSpy).toHaveBeenCalledWith([
        '/bank/transfers/external/accounts',
      ]);
    });
  });

  it('should set error when sender has no valid permission for same bank', async () => {
    cleanupRepeatTest(ctx.httpMock);
    ctx = await setupRepeatTest([
      mockSenderAccountNoPermission,
      mockReceiverAccountGEL,
    ]);

    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    const transaction: ITransactions = {
      ...mockSameBankTransaction,
      debitAccountNumber: mockSenderAccountNoPermission.iban,
    };

    ctx.repeatService.initRepeatTransfer(transaction);

    const lookupReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-iban`,
    );
    lookupReq.flush(mockRecipientResponseIban);

    await vi.waitFor(() => {
      expect(ctx.transferStore.error()).toBe(
        'transfers.repeat.senderNoPermission',
      );
      expect(navigateSpy).toHaveBeenCalledWith([
        '/bank/transfers/external/accounts',
      ]);
    });
  });

  it('should handle API error during recipient lookup gracefully', async () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    ctx.repeatService.initRepeatTransfer(mockSameBankTransaction);

    const lookupReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-iban`,
    );
    lookupReq.flush(
      { message: 'Server error' },
      { status: 500, statusText: 'Internal Server Error' },
    );

    await vi.waitFor(() => {
      expect(ctx.transferStore.error()).toBe(
        'transfers.repeat.recipientNotFound',
      );
      expect(ctx.transferStore.isLoading()).toBe(false);
      expect(ctx.transferStore.recipientInput()).toBe('GE00TIA0000000000099');
      expect(navigateSpy).toHaveBeenCalledWith([
        '/bank/transfers/external/recipient',
      ]);
    });
  });

  it('should set recipientType as iban-same-bank for TIA IBAN', async () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    ctx.repeatService.initRepeatTransfer(mockSameBankTransaction);

    const lookupReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-iban`,
    );
    lookupReq.flush(mockRecipientResponseIban);

    await vi.waitFor(() => {
      expect(ctx.transferStore.recipientType()).toBe('iban-same-bank');
      expect(navigateSpy).toHaveBeenCalledWith([
        '/bank/transfers/external/amount',
      ]);
    });
  });
});
