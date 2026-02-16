import { TestBed } from '@angular/core/testing';
import { ApproveAccountsApiService } from '../service/approve-accounts.api.service';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AccountPermissionsStore } from './approve-accounts.store';
import { BankAccount } from '../../../shared/models/approve-models/accounts-models/pending-accounts.models';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';

describe('AccountPermissionsStore', () => {
  let store: InstanceType<typeof AccountPermissionsStore>;

  let apiServiceMock: {
    getAccountPermissions: any;
    getPendingAccounts: any;
    updateAccountStatus: any;
    modifyAccountPermissions: any;
  };

  const mockAlertService = {
    success: vi.fn(),
    error: vi.fn(),
  };

  const mockTranslateService = {
    instant: vi.fn((key) => key),
  };

  const mockPermissions = [
    { value: 1, label: 'Permission 1' },
    { value: 2, label: 'Permission 2' },
  ];

  const mockAccounts: BankAccount[] = [
    {
      id: '1',
      name: 'Account A',
      user: { firstName: 'G', lastName: 'Z' },
    } as any,
    {
      id: '2',
      name: 'Account B',
      user: { firstName: 'N', lastName: 'K' },
    } as any,
  ];

  beforeEach(() => {
    apiServiceMock = {
      getAccountPermissions: vi.fn(),
      getPendingAccounts: vi.fn(),
      updateAccountStatus: vi.fn(),
      modifyAccountPermissions: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AccountPermissionsStore,
        { provide: ApproveAccountsApiService, useValue: apiServiceMock },
        { provide: AlertService, useValue: mockAlertService },
        { provide: TranslateService, useValue: mockTranslateService },
      ],
    });

    store = TestBed.inject(AccountPermissionsStore);
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    expect(store.permissions()).toEqual([]);
    expect(store.pendingAccounts()).toEqual([]);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should load pending accounts and reverse them', () => {
    apiServiceMock.getPendingAccounts.mockReturnValue(of(mockAccounts));

    store.loadPendingAccounts();

    const expectedReversed = [...mockAccounts].reverse();
    expect(store.pendingAccounts()).toEqual(expectedReversed);
    expect(store.pendingAccounts()[0].id).toBe('2');
    expect(store.isLoading()).toBe(false);
  });

  it('should not call API if pending accounts are already loaded (Cache)', () => {
    apiServiceMock.getPendingAccounts.mockReturnValue(of(mockAccounts));

    store.loadPendingAccounts();
    expect(apiServiceMock.getPendingAccounts).toHaveBeenCalledTimes(1);

    store.loadPendingAccounts();
    expect(apiServiceMock.getPendingAccounts).toHaveBeenCalledTimes(1);
  });

  it('should not call API if permissions are already loaded (Cache)', () => {
    apiServiceMock.getAccountPermissions.mockReturnValue(of(mockPermissions));

    store.loadPermissions();
    store.loadPermissions();

    expect(apiServiceMock.getAccountPermissions).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors in loadPendingAccounts', () => {
    const errorMsg = 'Network Error';
    apiServiceMock.getPendingAccounts.mockReturnValue(
      throwError(() => ({ message: errorMsg })),
    );

    store.loadPendingAccounts();

    expect(store.error()).toBe(errorMsg);
    expect(store.isLoading()).toBe(false);
  });

  it('should remove account from list locally on successful status update', () => {
    apiServiceMock.getPendingAccounts.mockReturnValue(of(mockAccounts));
    store.loadPendingAccounts();

    apiServiceMock.updateAccountStatus.mockReturnValue(of({}));

    store.updateStatus({ accountId: '1', updatedStatus: 'active' });

    expect(store.pendingAccounts().length).toBe(1);
    expect(store.pendingAccounts()[0].id).toBe('2');
    expect(mockAlertService.success).toHaveBeenCalled();
  });

  it('should update state and show alert on savePermissions success', () => {
    apiServiceMock.modifyAccountPermissions.mockReturnValue(of({}));

    store.savePermissions({ accountId: '1', permissions: 7 });

    expect(apiServiceMock.modifyAccountPermissions).toHaveBeenCalled();
    expect(store.isLoading()).toBe(false);
    expect(mockAlertService.success).toHaveBeenCalledWith(
      'settings.approve-accounts.alerts.permissions_saved',
      expect.anything(),
    );
  });

  it('should handle error in savePermissions', () => {
    apiServiceMock.modifyAccountPermissions.mockReturnValue(
      throwError(() => ({ message: 'Save Failed' })),
    );

    store.savePermissions({ accountId: '1', permissions: 7 });

    expect(store.error()).toBe('Save Failed');
    expect(store.isLoading()).toBe(false);
  });

  it('should update selectedAccountId via selectAccount method', () => {
    store.selectAccount('99');
    expect(store.selectedAccountId()).toBe('99');

    store.selectAccount(null);
    expect(store.selectedAccountId()).toBeNull();
  });
  it('should load permissions from API if store is empty', () => {
    expect(store.permissions().length).toBe(0);

    apiServiceMock.getAccountPermissions.mockReturnValue(of(mockPermissions));

    store.loadPermissions();

    expect(apiServiceMock.getAccountPermissions).toHaveBeenCalledTimes(1);
    expect(store.permissions()).toEqual(mockPermissions);
    expect(store.isLoading()).toBe(false);
  });

  it('should handle API errors in loadPermissions', () => {
    const errorMsg = 'Permissions Load Failed';
    apiServiceMock.getAccountPermissions.mockReturnValue(
      throwError(() => ({ message: errorMsg })),
    );

    store.loadPermissions();

    expect(store.error()).toBe(errorMsg);
    expect(store.isLoading()).toBe(false);
    expect(store.permissions()).toEqual([]);
  });

  it('should show correct alert title (Info) when status is not active', () => {
    apiServiceMock.getPendingAccounts.mockReturnValue(of(mockAccounts));
    store.loadPendingAccounts();

    apiServiceMock.updateAccountStatus.mockReturnValue(of({}));
    const payload = { accountId: '1', updatedStatus: 'declined' };

    store.updateStatus(payload as any);

    expect(store.pendingAccounts().find((a) => a.id === '1')).toBeUndefined();

    expect(mockAlertService.success).toHaveBeenCalledWith(
      'settings.approve-accounts.alerts.declined_success',
      expect.objectContaining({
        title: 'Info',
      }),
    );
  });

  it('should handle API errors in updateStatus', () => {
    const errorMsg = 'Update Failed';
    apiServiceMock.updateAccountStatus.mockReturnValue(
      throwError(() => ({ message: errorMsg })),
    );

    store.updateStatus({ accountId: '1', updatedStatus: 'active' });

    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe(errorMsg);
    expect(mockAlertService.success).not.toHaveBeenCalled();
  });

  it('should correctly compute pendingAccountsCount and selectedAccount', () => {
    expect(store.pendingAccountsCount()).toBe(0);
    expect(store.selectedAccount()).toBeUndefined();

    apiServiceMock.getPendingAccounts.mockReturnValue(of(mockAccounts));
    store.loadPendingAccounts();

    expect(store.pendingAccountsCount()).toBe(2);

    store.selectAccount('2');
    const selected = store.selectedAccount();

    expect(selected).toBeDefined();
    expect(selected?.id).toBe('2');
    expect(selected?.name).toBe('Account B');
  });

  it('should reset state to initial values', () => {
    store.selectAccount('123');
    apiServiceMock.getPendingAccounts.mockReturnValue(of(mockAccounts));
    store.loadPendingAccounts();

    expect(store.pendingAccounts().length).toBeGreaterThan(0);
    expect(store.selectedAccountId()).toBe('123');

    store.resetState();

    expect(store.pendingAccounts()).toEqual([]);
    expect(store.selectedAccountId()).toBeNull();
    expect(store.permissions()).toEqual([]);
    expect(store.error()).toBeNull();
  });
});
