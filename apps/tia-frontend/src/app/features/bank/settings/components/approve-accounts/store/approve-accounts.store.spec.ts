import { TestBed } from '@angular/core/testing';
import { ApproveAccountsApiService } from '../service/approve-accounts.api.service';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AccountPermissionsStore } from './approve-accounts.store';
import { HttpErrorResponse } from '@angular/common/http';
import { BankAccount } from '../models/pending-accounts.models';

describe('AccountPermissionsStore', () => {
  let store: InstanceType<typeof AccountPermissionsStore>;

  let apiServiceMock: {
    getAccountPermissions: ReturnType<typeof vi.fn>;
    getPendingAccounts: ReturnType<typeof vi.fn>;
    updateAccountStatus: ReturnType<typeof vi.fn>;
    modifyAccountPermissions: ReturnType<typeof vi.fn>;
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
      ],
    });

    store = TestBed.inject(AccountPermissionsStore);
  });

  it('should initialize with default state', () => {
    expect(store.permissions()).toEqual([]);
    expect(store.pendingAccounts()).toEqual([]);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should load permissions successfully', () => {
    apiServiceMock.getAccountPermissions.mockReturnValue(of(mockPermissions));
    store.loadPermissions();
    expect(store.permissions()).toEqual(mockPermissions);
    expect(store.isLoading()).toBe(false);
  });

  it('should handle API errors in loadPermissions', () => {
    const errorMsg = 'Internal Server Error';
    const errorWithMsg = { message: errorMsg };
    apiServiceMock.getAccountPermissions.mockReturnValue(
      throwError(() => errorWithMsg),
    );

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    store.loadPermissions();

    expect(store.error()).toBe(errorMsg);
    expect(store.isLoading()).toBe(false);

    consoleSpy.mockRestore();
  });

  it('should load pending accounts and update computed count', () => {
    apiServiceMock.getPendingAccounts.mockReturnValue(of(mockAccounts));
    store.loadPendingAccounts();
    expect(store.pendingAccounts()).toEqual(mockAccounts);
    expect(store.pendingAccountsCount()).toBe(2);
    expect(store.isLoading()).toBe(false);
  });

  it('should handle API errors in loadPendingAccounts', () => {
    const errorMsg = 'Network Error';
    const errorWithMsg = { message: errorMsg };
    apiServiceMock.getPendingAccounts.mockReturnValue(
      throwError(() => errorWithMsg),
    );

    store.loadPendingAccounts();

    expect(store.pendingAccounts()).toEqual([]);
    expect(store.error()).toBe(errorMsg);
    expect(store.isLoading()).toBe(false);
  });

  it('should select account and update computed selectedAccount', () => {
    apiServiceMock.getPendingAccounts.mockReturnValue(of(mockAccounts));
    store.loadPendingAccounts();

    store.selectAccount('1');

    expect(store.selectedAccountId()).toBe('1');
    expect(store.selectedAccount()?.id).toBe('1');
    expect(store.selectedAccount()?.name).toBe('Account A');
  });

  it('should remove account from list on successful status update', () => {
    apiServiceMock.getPendingAccounts.mockReturnValue(of(mockAccounts));
    store.loadPendingAccounts();

    apiServiceMock.updateAccountStatus.mockReturnValue(of({ success: true }));

    store.updateStatus({ accountId: '1', updatedStatus: 'active' });

    expect(store.pendingAccounts().length).toBe(1);
    expect(store.pendingAccounts()[0].id).toBe('2');
    expect(store.isLoading()).toBe(false);
  });

  it('should call modify API and stop loading on save', () => {
    apiServiceMock.modifyAccountPermissions.mockReturnValue(
      of({ success: true }),
    );

    store.savePermissions({ accountId: '1', permissions: 5 });

    expect(apiServiceMock.modifyAccountPermissions).toHaveBeenCalledWith({
      accountId: '1',
      permissions: 5,
    });
    expect(store.isLoading()).toBe(false);
  });
});
