import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../../../environments/environment';
import {
  TestContext,
  setupAccountsTest,
  cleanupAccountsTest,
  mockAccounts,
} from './accounts.test-helpers';

describe('Settings — Accounts Integration — Toggle visibility', () => {
  let ctx: TestContext;

  beforeEach(async () => {
    ctx = await setupAccountsTest();
  });

  afterEach(() => {
    cleanupAccountsTest(ctx.httpMock);
  });

  it('should toggle visibility successfully, clear favorite and trigger reload', async () => {
    ctx.store.loadAccounts();
    const loadReq = ctx.httpMock.expectOne(`${environment.apiUrl}/settings/accounts`);
    loadReq.flush(mockAccounts);

    ctx.store.toggleVisibility({ id: 'acc-2', isHidden: false });

    const req = ctx.httpMock.expectOne((r) => r.url === `${environment.apiUrl}/settings/account-visibility`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ accountId: 'acc-2', isHidden: true });
    req.flush({ success: 'ok' });

    await vi.waitFor(() => {
      const acc = ctx.store.accounts()?.find((a) => a.id === 'acc-2');
      expect(acc?.isHidden).toBe(true);
      expect(acc?.isFavorite).toBe(false);
      expect(ctx.alertService.success).toHaveBeenCalled();
      expect(ctx.globalStore.dispatch).toHaveBeenCalled();
      expect(ctx.store.loaded()).toBe(false);
    });

    const reloadedAccounts = mockAccounts.map((a) => (a.id === 'acc-2' ? { ...a, isHidden: true, isFavorite: false } : a));
    ctx.store.loadAccounts();
    const reloadReq = ctx.httpMock.expectOne(`${environment.apiUrl}/settings/accounts`);
    expect(reloadReq.request.method).toBe('GET');
    reloadReq.flush(reloadedAccounts);

    await vi.waitFor(() => {
      const acc = ctx.store.accounts()?.find((a) => a.id === 'acc-2');
      expect(acc?.isHidden).toBe(true);
      expect(acc?.isFavorite).toBe(false);
      expect(ctx.store.loaded()).toBe(true);
    });
  });

  it('should handle toggle visibility error', async () => {
    ctx.store.loadAccounts();
    const loadReq = ctx.httpMock.expectOne(`${environment.apiUrl}/settings/accounts`);
    loadReq.flush(mockAccounts);

    ctx.store.toggleVisibility({ id: 'acc-2', isHidden: false });

    const req = ctx.httpMock.expectOne((r) => r.url === `${environment.apiUrl}/settings/account-visibility`);
    req.flush({ message: 'err' }, { status: 500, statusText: 'Server Error' });

    await vi.waitFor(() => {
      expect(ctx.alertService.error).toHaveBeenCalled();
      expect(ctx.store.visibilityLoadingIds().has('acc-2')).toBe(false);
    });
  });
});
