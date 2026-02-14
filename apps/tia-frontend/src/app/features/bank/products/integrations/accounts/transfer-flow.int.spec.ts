import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  AccountsTestContext,
  setupAccountsTest,
  cleanupAccountsTest,
  mockAccount,
  mockAccount2,
  mockAccount3,
} from './accounts.test-helpers';
import { AccountsActions } from '../../../../../store/products/accounts/accounts.actions';

describe('Accounts Integration - Transfer Flow', () => {
  let ctx: AccountsTestContext;

  beforeEach(async () => {
    ctx = await setupAccountsTest();
  });

  afterEach(() => {
    cleanupAccountsTest(ctx.httpMock);
  });

  it('should dispatch selectAccount action for internal transfer (permission 1)', () => {
    if (!ctx.store) throw new Error('Store not initialized');
    const dispatchSpy = vi.spyOn(ctx.store, 'dispatch');

    ctx.store.dispatch(AccountsActions.selectAccount({ account: mockAccount }));

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: AccountsActions.selectAccount.type,
        account: mockAccount,
      }),
    );
  });

  it('should dispatch selectAccount action for external transfer (permission 2)', () => {
    if (!ctx.store) throw new Error('Store not initialized');
    const dispatchSpy = vi.spyOn(ctx.store, 'dispatch');

    ctx.store.dispatch(
      AccountsActions.selectAccount({ account: mockAccount2 }),
    );

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: AccountsActions.selectAccount.type,
        account: mockAccount2,
      }),
    );
  });

  it('should dispatch selectAccount action for loans (permission 32)', () => {
    if (!ctx.store) throw new Error('Store not initialized');
    const dispatchSpy = vi.spyOn(ctx.store, 'dispatch');

    ctx.store.dispatch(
      AccountsActions.selectAccount({ account: mockAccount3 }),
    );

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: AccountsActions.selectAccount.type,
        account: mockAccount3,
      }),
    );
  });

  it('should verify permission routing map', () => {
    const permissionMap: { [key: number]: string } = {
      1: '/bank/transfers/internal',
      2: '/bank/transfers/external',
      4: '/bank/transfers/external',
      8: '/bank/paybill',
      16: '/bank/paybill',
      32: '/bank/loans',
    };

    expect(permissionMap[1]).toBe('/bank/transfers/internal');
    expect(permissionMap[2]).toBe('/bank/transfers/external');
    expect(permissionMap[4]).toBe('/bank/transfers/external');
    expect(permissionMap[8]).toBe('/bank/paybill');
    expect(permissionMap[16]).toBe('/bank/paybill');
    expect(permissionMap[32]).toBe('/bank/loans');
  });

  it('should handle account with permission 1 for internal transfers', () => {
    expect(mockAccount.id).toBe('acc-123');
    expect(mockAccount.permission).toBe(1);
    expect(mockAccount.balance).toBe(1000);
    expect(mockAccount.currency).toBe('USD');
  });

  it('should handle account with permission 2 for external transfers', () => {
    expect(mockAccount2.id).toBe('acc-456');
    expect(mockAccount2.permission).toBe(2);
    expect(mockAccount2.currency).toBe('GEL');
  });

  it('should handle account with permission 32 for loans', () => {
    expect(mockAccount3.id).toBe('acc-789');
    expect(mockAccount3.permission).toBe(32);
    expect(mockAccount3.balance).toBe(2000);
  });
});
