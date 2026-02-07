import { TestBed } from '@angular/core/testing';
import { ApproveAccountsApiService } from '../service/approve-accounts.api.service';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AccountPermissionsStore } from './aprove-accounts.store';
import { HttpErrorResponse } from '@angular/common/http';

describe('AccountPermissionsStore', () => {
  let store: InstanceType<typeof AccountPermissionsStore>;
  let apiServiceMock: { getAccountPermissions: ReturnType<typeof vi.fn> };

  const mockPermissions = [
    { id: 1, name: 'Permission 1', value: 1 },
    { id: 2, name: 'Permission 2', value: 2 },
  ];

  beforeEach(() => {
    apiServiceMock = {
      getAccountPermissions: vi.fn(),
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
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should load permissions successfully and update state', () => {
    apiServiceMock.getAccountPermissions.mockReturnValue(of(mockPermissions));

    store.loadPermissions();

    expect(apiServiceMock.getAccountPermissions).toHaveBeenCalled();
    expect(store.permissions()).toEqual(mockPermissions);
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should handle API errors correctly and log the error', () => {
    const errorMsg = 'Internal Server Error';
    const errorResponse = new HttpErrorResponse({
      error: 'Server Error',
      status: 500,
      statusText: 'Internal Server Error',
    });

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    apiServiceMock.getAccountPermissions.mockReturnValue(
      throwError(() => errorResponse),
    );

    store.loadPermissions();

    expect(apiServiceMock.getAccountPermissions).toHaveBeenCalled();
    expect(store.isLoading()).toBe(false);
    const simpleError = { message: errorMsg };
    apiServiceMock.getAccountPermissions.mockReturnValue(
      throwError(() => simpleError),
    );

    store.loadPermissions();
    expect(store.error()).toBe(errorMsg);

    consoleSpy.mockRestore();
  });
});
