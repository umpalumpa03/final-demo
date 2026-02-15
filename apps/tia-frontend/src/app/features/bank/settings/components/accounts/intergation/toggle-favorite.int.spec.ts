import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../../../environments/environment';
import {
  TestContext,
  setupAccountsTest,
  cleanupAccountsTest,
  mockAccounts,
} from './accounts.test-helpers';

describe('Settings — Accounts Integration — Toggle favorite', () => {
  let ctx: TestContext;

  beforeEach(async () => {
    ctx = await setupAccountsTest();
  });

  afterEach(() => {
    cleanupAccountsTest(ctx.httpMock);
  });

  it('should toggle favorite successfully and cause accounts to be reloaded', async () => {
    ctx.store.loadAccounts();
    const loadReq = ctx.httpMock.expectOne(`${environment.apiUrl}/settings/accounts`);
    loadReq.flush(mockAccounts);

    ctx.store.toggleFavorite({ id: 'acc-1', isFavorite: false });

    const req = ctx.httpMock.expectOne((r) => r.url === `${environment.apiUrl}/settings/favorite`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ accountId: 'acc-1', isFavorite: true });
    req.flush({ success: 'ok' });

    await vi.waitFor(() => {
      const acc = ctx.store.accounts()?.find((a) => a.id === 'acc-1');
      expect(acc?.isFavorite).toBe(true);
      expect(ctx.alertService.success).toHaveBeenCalled();
      expect(ctx.globalStore.dispatch).toHaveBeenCalled();
      expect(ctx.store.loaded()).toBe(false);
    });

    const reloadedAccounts = mockAccounts.map((a) => (a.id === 'acc-1' ? { ...a, isFavorite: true } : a));
    ctx.store.loadAccounts();
    const reloadReq = ctx.httpMock.expectOne(`${environment.apiUrl}/settings/accounts`);
    expect(reloadReq.request.method).toBe('GET');
    reloadReq.flush(reloadedAccounts);

    await vi.waitFor(() => {
      expect(ctx.store.accounts()?.find((a) => a.id === 'acc-1')?.isFavorite).toBe(true);
      expect(ctx.store.loaded()).toBe(true);
    });
  });

  it('should handle toggle favorite error', async () => {
    ctx.store.loadAccounts();
    const loadReq = ctx.httpMock.expectOne(`${environment.apiUrl}/settings/accounts`);
    loadReq.flush(mockAccounts);

    ctx.store.toggleFavorite({ id: 'acc-1', isFavorite: false });

    const req = ctx.httpMock.expectOne((r) => r.url === `${environment.apiUrl}/settings/favorite`);
    req.flush({ message: 'error' }, { status: 500, statusText: 'Server Error' });

    await vi.waitFor(() => {
      expect(ctx.alertService.error).toHaveBeenCalled();
      expect(ctx.store.favoriteLoadingIds().has('acc-1')).toBe(false);
    });
  });
});
