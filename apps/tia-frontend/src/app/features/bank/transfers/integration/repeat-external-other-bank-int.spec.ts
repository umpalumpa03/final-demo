import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  RepeatTestContext,
  setupRepeatTest,
  cleanupRepeatTest,
  mockReceiverAccountGEL,
  mockSenderAccountNoPermission,
  mockExternalBankTransaction,
} from './repeat-transfer.test-helpers';
import { ITransactions } from 'apps/tia-frontend/src/app/shared/models/transactions/transactions.models';

describe('Repeat Transfer - External Other Bank Flow', () => {
  let ctx: RepeatTestContext;

  beforeEach(async () => {
    ctx = await setupRepeatTest();
  });

  afterEach(() => {
    cleanupRepeatTest(ctx.httpMock);
  });

  it('should set external recipient, populate store, and navigate to amount page', () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    ctx.repeatService.initRepeatTransfer(mockExternalBankTransaction);

    expect(ctx.transferStore.recipientInput()).toBe('GE29BOG0000000000011');
    expect(ctx.transferStore.recipientType()).toBe('iban-different-bank');
    expect(ctx.transferStore.manualRecipientName()).toBe('External Recipient');
    expect(ctx.transferStore.senderAccount()!.id).toBe('sender-1');
    expect(ctx.transferStore.amount()).toBe(300);
    expect(ctx.transferStore.description()).toBe('External bank transfer');
    expect(ctx.transferStore.fee()).toBe(0);
    expect(ctx.transferStore.totalWithFee()).toBe(300);
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/external/amount',
    ]);
  });

  it('should not make any API calls for external bank repeat', () => {
    ctx.repeatService.initRepeatTransfer(mockExternalBankTransaction);

    ctx.httpMock.expectNone((req) => req.url.includes('lookup-recipient'));
  });

  it('should handle missing recipientName in meta gracefully', () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    const transaction: ITransactions = {
      ...mockExternalBankTransaction,
      meta: null,
    };

    ctx.repeatService.initRepeatTransfer(transaction);

    expect(ctx.transferStore.manualRecipientName()).toBe('');
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/external/amount',
    ]);
  });

  it('should set error when sender account not found', () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    const transaction: ITransactions = {
      ...mockExternalBankTransaction,
      debitAccountNumber: 'GE00TIA9999999999999',
    };

    ctx.repeatService.initRepeatTransfer(transaction);

    expect(ctx.transferStore.error()).toBe(
      'transfers.external.accounts.senderNotFound',
    );
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/external/accounts',
    ]);
  });

  it('should set error when sender has no valid permission for external bank', async () => {
    cleanupRepeatTest(ctx.httpMock);
    ctx = await setupRepeatTest([
      mockSenderAccountNoPermission,
      mockReceiverAccountGEL,
    ]);

    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    const transaction: ITransactions = {
      ...mockExternalBankTransaction,
      debitAccountNumber: mockSenderAccountNoPermission.iban,
    };

    ctx.repeatService.initRepeatTransfer(transaction);

    expect(ctx.transferStore.error()).toBe(
      'transfers.external.accounts.noPermission',
    );
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/external/accounts',
    ]);
  });

  it('should handle international IBAN as external bank transfer', () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    const intlTransaction: ITransactions = {
      ...mockExternalBankTransaction,
      creditAccountNumber: 'DE89370400440532013000',
      meta: { recipientName: 'Hans Mueller' },
    };

    ctx.repeatService.initRepeatTransfer(intlTransaction);

    expect(ctx.transferStore.recipientType()).toBe('iban-different-bank');
    expect(ctx.transferStore.recipientInput()).toBe('DE89370400440532013000');
    expect(ctx.transferStore.manualRecipientName()).toBe('Hans Mueller');
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/external/amount',
    ]);
  });

  it('should initialize fee info with zero fee', () => {
    ctx.repeatService.initRepeatTransfer(mockExternalBankTransaction);

    expect(ctx.transferStore.fee()).toBe(0);
    expect(ctx.transferStore.totalWithFee()).toBe(300);
  });
});
