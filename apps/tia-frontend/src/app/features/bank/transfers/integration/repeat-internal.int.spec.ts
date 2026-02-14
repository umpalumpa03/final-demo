import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  RepeatTestContext,
  setupRepeatTest,
  cleanupRepeatTest,
  mockSenderAccountInternalGEL,
  mockReceiverAccountGEL,
  mockSenderAccountNoPermission,
  mockInternalTransaction,
} from './repeat-transfer.test-helpers';
import { ITransactions } from 'apps/tia-frontend/src/app/shared/models/transactions/transactions.models';

describe('Repeat Transfer - Internal (Own Account) Flow', () => {
  let ctx: RepeatTestContext;

  beforeEach(async () => {
    ctx = await setupRepeatTest([
      mockSenderAccountInternalGEL,
      mockReceiverAccountGEL,
    ]);
  });

  afterEach(() => {
    cleanupRepeatTest(ctx.httpMock);
  });

  it('should populate store and navigate to amount page for valid internal repeat', () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    ctx.repeatService.initRepeatTransfer(mockInternalTransaction);

    expect(ctx.transferStore.senderAccount()!.iban).toBe(
      'GE00TIA0000000000001',
    );
    expect(ctx.transferStore.receiverOwnAccount()!.iban).toBe(
      'GE00TIA0000000000010',
    );
    expect(ctx.transferStore.amount()).toBe(500);
    expect(ctx.transferStore.description()).toBe('Own transfer');
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/internal/amount',
    ]);
  });

  it('should set error and navigate to from-account when sender not found', () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    const transaction: ITransactions = {
      ...mockInternalTransaction,
      debitAccountNumber: 'GE00TIA9999999999999',
    };

    ctx.repeatService.initRepeatTransfer(transaction);

    expect(ctx.transferStore.error()).toBe('transfers.repeat.senderNotFound');
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/internal/from-account',
    ]);
  });

  it('should set error when sender has no permission (permission=0)', async () => {
    cleanupRepeatTest(ctx.httpMock);
    ctx = await setupRepeatTest([
      mockSenderAccountNoPermission,
      mockReceiverAccountGEL,
    ]);

    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    const transaction: ITransactions = {
      ...mockInternalTransaction,
      debitAccountNumber: mockSenderAccountNoPermission.iban,
    };

    ctx.repeatService.initRepeatTransfer(transaction);

    expect(ctx.transferStore.error()).toBe(
      'transfers.repeat.senderNoPermission',
    );
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/internal/from-account',
    ]);
  });

  it('should set error when receiver account not found', () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    const transaction: ITransactions = {
      ...mockInternalTransaction,
      creditAccountNumber: 'GE00TIA8888888888888',
    };

    ctx.repeatService.initRepeatTransfer(transaction);

    expect(ctx.transferStore.error()).toBe(
      'transfers.repeat.recipientAccountNotFound',
    );
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/internal/from-account',
    ]);
  });

  it('should use empty string for description when transaction has no description', () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    const transaction: ITransactions = {
      ...mockInternalTransaction,
      description: '',
    };

    ctx.repeatService.initRepeatTransfer(transaction);

    expect(ctx.transferStore.description()).toBe('');
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/internal/amount',
    ]);
  });

  it('should correctly identify OwnAccountTransfer as internal', () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    ctx.repeatService.initRepeatTransfer(mockInternalTransaction);

    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/internal/amount',
    ]);
  });

  it('should allow sender with permission=1 (bit 1 set)', async () => {
    const senderPerm1 = {
      ...mockSenderAccountInternalGEL,
      permission: 1,
    };

    cleanupRepeatTest(ctx.httpMock);
    ctx = await setupRepeatTest([senderPerm1, mockReceiverAccountGEL]);

    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    ctx.repeatService.initRepeatTransfer(mockInternalTransaction);

    expect(ctx.transferStore.senderAccount()!.permission).toBe(1);
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/internal/amount',
    ]);
  });

  it('should allow sender with permission=3 (bit 1 set)', () => {
    const navigateSpy = vi.spyOn(ctx.router, 'navigate');

    ctx.repeatService.initRepeatTransfer(mockInternalTransaction);

    expect(ctx.transferStore.senderAccount()!.permission).toBe(3);
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/transfers/internal/amount',
    ]);
  });

  it('should reject sender with permission=2 (bit 1 not set)', async () => {
    const senderPerm2 = {
      ...mockSenderAccountInternalGEL,
      permission: 2,
    };

    cleanupRepeatTest(ctx.httpMock);
    ctx = await setupRepeatTest([senderPerm2, mockReceiverAccountGEL]);

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
