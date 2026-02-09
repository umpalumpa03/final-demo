import { TestBed } from '@angular/core/testing';
import { ApproveAccountsApiService } from './approve-accounts.api.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../../../environments/environment';
import { IUpdateAccountStatus } from '../../../shared/models/approve-models/accounts-models/pending-accounts.models';
import { IUpdateAccountPermission } from '../../../shared/models/approve-models/accounts-models/account-permissions.models'

describe('ApproveAccountsApiService', () => {
  let service: ApproveAccountsApiService;
  let httpMock: HttpTestingController;

  const mockPermissions = [
    { value: 1, label: 'View Balance' },
    { value: 2, label: 'Make Transfer' },
  ];

  const mockPendingAccounts: any[] = [
    { id: '1', name: 'Account 1', status: 'pending' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApproveAccountsApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ApproveAccountsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve account permissions via GET request', () => {
    service.getAccountPermissions().subscribe((permissions) => {
      expect(permissions).toEqual(mockPermissions);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/accounts/account-permissions`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockPermissions);
  });

  it('should retrieve pending accounts via GET request', () => {
    service.getPendingAccounts().subscribe((accounts) => {
      expect(accounts).toEqual(mockPendingAccounts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/accounts/pending`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPendingAccounts);
  });

  it('should update account status via PUT request', () => {
    const payload: IUpdateAccountStatus = {
      accountId: '123',
      updatedStatus: 'active',
    };
    const mockResponse = { success: true };

    service.updateAccountStatus(payload).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/accounts/change-account-status`,
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should modify account permissions via PUT request', () => {
    const payload: IUpdateAccountPermission = {
      accountId: '123',
      permissions: 5,
    };
    const mockResponse = { success: true };

    service.modifyAccountPermissions(payload).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/accounts/modify-account-permission`,
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });
});
