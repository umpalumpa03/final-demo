import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../../../environments/environment';
import {
  TestContext,
  setupAccountsTest,
  cleanupAccountsTest,
  mockAccounts,
} from './accounts.test-helpers';

describe('Settings — Accounts Integration — Change friendly name', () => {
  let ctx: TestContext;

  beforeEach(async () => {
    ctx = await setupAccountsTest();
  });

  afterEach(() => {
    cleanupAccountsTest(ctx.httpMock);
  });

  it('should change friendly name successfully and allow accounts to be reloaded', async () => {
    ctx.store.loadAccounts();
    const loadReq = ctx.httpMock.expectOne(`${environment.apiUrl}/settings/accounts`);
    loadReq.flush(mockAccounts);

    ctx.store.changeFriendlyName({ id: 'acc-1', friendlyName: 'New Name' });

    const req = ctx.httpMock.expectOne((r) => r.url === `${environment.apiUrl}/settings/change-friendly-name`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ accountId: 'acc-1', friendlyName: 'New Name' });
    req.flush({ success: 'ok' });

    await vi.waitFor(() => {
      const acc = ctx.store.accounts()?.find((a) => a.id === 'acc-1');
      expect(acc?.friendlyName).toBe('New Name');
      expect(ctx.alertService.success).toHaveBeenCalled();
      expect(ctx.globalStore.dispatch).toHaveBeenCalled();
      expect(ctx.store.loaded()).toBe(false);
    });

    const reloadedAccounts = mockAccounts.map((a) => (a.id === 'acc-1' ? { ...a, friendlyName: 'New Name' } : a));
    ctx.store.loadAccounts();
    const reloadReq = ctx.httpMock.expectOne(`${environment.apiUrl}/settings/accounts`);
    expect(reloadReq.request.method).toBe('GET');
    reloadReq.flush(reloadedAccounts);

    await vi.waitFor(() => {
      expect(ctx.store.accounts()?.find((a) => a.id === 'acc-1')?.friendlyName).toBe('New Name');
      expect(ctx.store.loaded()).toBe(true);
    });
  });

  it('should handle change friendly name error', async () => {
    ctx.store.loadAccounts();
    const loadReq = ctx.httpMock.expectOne(`${environment.apiUrl}/settings/accounts`);
    loadReq.flush(mockAccounts);

    ctx.store.changeFriendlyName({ id: 'acc-1', friendlyName: 'Bad Name' });

    const req = ctx.httpMock.expectOne((r) => r.url === `${environment.apiUrl}/settings/change-friendly-name`);
    req.flush({ message: 'err' }, { status: 500, statusText: 'Server Error' });

    await vi.waitFor(() => {
      expect(ctx.alertService.error).toHaveBeenCalled();
      expect(ctx.store.changeNameLoadingIds().has('acc-1')).toBe(false);
    });
  });
});
