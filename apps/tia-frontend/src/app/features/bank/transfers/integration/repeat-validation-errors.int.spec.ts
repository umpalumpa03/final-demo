import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  RepeatTestContext,
  setupRepeatTest,
  cleanupRepeatTest,
  BASE_URL,
  mockSenderAccountGEL,
  mockSenderAccountUSD,
  mockSenderAccountInternalGEL,
  mockReceiverAccountGEL,
  mockInternalTransaction,
  mockExternalBankTransaction,
  mockSameBankTransaction,
} from './repeat-transfer.test-helpers';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { ITransactions } from 'apps/tia-frontend/src/app/shared/models/transactions/transactions.models';

describe('Repeat Transfer - Validation Errors', () => {
  let ctx: RepeatTestContext;

  beforeEach(async () => {
    ctx = await setupRepeatTest();
  });

  afterEach(() => {
    cleanupRepeatTest(ctx.httpMock);
  });

  it('should set invalidIban error when creditAccountNumber is null', () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    const transaction: ITransactions = {
      ...mockExternalBankTransaction,
      creditAccountNumber: null,
    };

    ctx.repeatService.initRepeatTransfer(transaction);

    expect(ctx.transferStore.error()).toBe('transfers.repeat.invalidIban');
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/external/recipient',
    ]);
  });

  it('should set invalidIban error when creditAccountNumber is empty string', () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    const transaction: ITransactions = {
      ...mockExternalBankTransaction,
      creditAccountNumber: '',
    };

    ctx.repeatService.initRepeatTransfer(transaction);

    expect(ctx.transferStore.error()).toBe('transfers.repeat.invalidIban');
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/external/recipient',
    ]);
  });

  it('should set invalidIban error when recipientType cannot be determined', () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    const transaction: ITransactions = {
      ...mockExternalBankTransaction,
      creditAccountNumber: 'INVALID-FORMAT',
    };

    ctx.repeatService.initRepeatTransfer(transaction);

    expect(ctx.transferStore.error()).toBe('transfers.repeat.invalidIban');
    expect(ctx.transferStore.recipientInput()).toBe('INVALID-FORMAT');
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/external/recipient',
    ]);
  });

  it('should reject sender with permission=2 and USD currency for external bank', async () => {
    const usdWithPerm2: Account = {
      ...mockSenderAccountUSD,
      iban: mockSenderAccountGEL.iban,
      permission: 2,
      currency: 'USD',
    };

    cleanupRepeatTest(ctx.httpMock);
    ctx = await setupRepeatTest([usdWithPerm2, mockReceiverAccountGEL]);

    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    ctx.repeatService.initRepeatTransfer(mockExternalBankTransaction);

    expect(ctx.transferStore.error()).toBe(
      'transfers.external.accounts.noPermission',
    );
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/external/accounts',
    ]);
  });

  it('should reject sender with permission=4 and GEL currency for external bank', async () => {
    const gelWithPerm4: Account = {
      ...mockSenderAccountGEL,
      permission: 4,
      currency: 'GEL',
    };

    cleanupRepeatTest(ctx.httpMock);
    ctx = await setupRepeatTest([gelWithPerm4, mockReceiverAccountGEL]);

    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    ctx.repeatService.initRepeatTransfer(mockExternalBankTransaction);

    expect(ctx.transferStore.error()).toBe(
      'transfers.external.accounts.noPermission',
    );
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/external/accounts',
    ]);
  });

  it('should correctly route ToSomeoneSameBank to external handler with API lookup', () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    ctx.repeatService.initRepeatTransfer(mockSameBankTransaction);

    const lookupReq = ctx.httpMock.expectOne(
      `${BASE_URL}/tia-transfer/lookup-recipient-by-iban`,
    );
    expect(lookupReq).toBeTruthy();

    lookupReq.flush({ fullName: 'Test', accounts: [] });

    expect(navigateSpy).not.toHaveBeenCalledWith(
      expect.arrayContaining([expect.stringContaining('internal')]),
    );
  });

  it('should correctly route ToSomeoneOtherBank to external handler', () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    ctx.repeatService.initRepeatTransfer(mockExternalBankTransaction);

    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/external/amount',
    ]);
  });

  it('should correctly route OwnAccountTransfer to internal handler', async () => {
    cleanupRepeatTest(ctx.httpMock);
    ctx = await setupRepeatTest([
      mockSenderAccountInternalGEL,
      mockReceiverAccountGEL,
    ]);

    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    ctx.repeatService.initRepeatTransfer(mockInternalTransaction);

    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/internal/amount',
    ]);
  });

  it('should reject sender with permission=0 for internal transfer', async () => {
    const zeroPerm: Account = {
      ...mockSenderAccountInternalGEL,
      permission: 0,
    };

    cleanupRepeatTest(ctx.httpMock);
    ctx = await setupRepeatTest([zeroPerm, mockReceiverAccountGEL]);

    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    ctx.repeatService.initRepeatTransfer(mockInternalTransaction);

    expect(ctx.transferStore.error()).toBe(
      'transfers.repeat.senderNoPermission',
    );
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/internal/from-account',
    ]);
  });
});
