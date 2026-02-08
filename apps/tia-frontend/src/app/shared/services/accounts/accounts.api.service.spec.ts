import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AccountsApiService } from './accounts.api.service';
import { AccountsStore } from '../../../features/bank/settings/components/accounts/strore/accounts.store';
import { environment } from '../../../../environments/environment';
import {
  AccountType,
  CreateAccountRequest,
} from '../../models/accounts/accounts.model';

describe('AccountsApiService', () => {
  let service: AccountsApiService;
  let httpMock: HttpTestingController;
  let mockStore: any;
  const apiUrl = `${environment.apiUrl}/accounts`;

  beforeEach(() => {
    TestBed.resetTestingModule();
    mockStore = {
      invalidate: vi.fn(),
      loadAccounts: vi.fn(),
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AccountsApiService,
        {
          provide: AccountsStore,
          useValue: mockStore,
        },
      ],
    });
    service = TestBed.inject(AccountsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all accounts with correct params', () => {
    service.getAccounts().subscribe();
    const req = httpMock.expectOne(
      (request) =>
        request.url === apiUrl &&
        request.params.get('ignoreHiddens') === 'true' &&
        request.params.get('status') === 'active',
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should fetch account by id and currencies', () => {
    service.getAccountById('1').subscribe();
    let req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush({});

    service.getCurrencies().subscribe();
    req = httpMock.expectOne(`${apiUrl}/catalogs/currencies`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should create account and make transfer', () => {
    const createRequest: CreateAccountRequest = {
      friendlyName: 'New Account',
      type: AccountType.saving,
      currency: 'USD',
    };
    service.createAccount(createRequest).subscribe();
    let req = httpMock.expectOne(`${apiUrl}/create-account-request`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createRequest);
    req.flush({
      id: '1',
      ...createRequest,
      balance: 0,
      isActive: true,
      accountNumber: '123',
      createdAt: '2026-01-01',
    });

    service.makeTransfer('1').subscribe();
    req = httpMock.expectOne(`${apiUrl}/1/transfer`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should update friendly name and trigger store invalidation', () => {
    const accountId = 'acc-123';
    const newFriendlyName = 'My Updated Account';
    const mockAccount = {
      id: accountId,
      friendlyName: newFriendlyName,
      balance: 1000,
      isActive: true,
      accountNumber: '456',
      createdAt: '2026-01-01',
      type: AccountType.saving,
      currency: 'USD',
    };

    service.updateFriendlyName(accountId, newFriendlyName).subscribe((result) => {
      expect(result).toEqual(mockAccount);
      expect(mockStore.invalidate).toHaveBeenCalled();
      expect(mockStore.loadAccounts).toHaveBeenCalled();
    });

    const req = httpMock.expectOne(
      `${apiUrl}/update-friendly-name/${accountId}`,
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ friendlyName: newFriendlyName });
    req.flush(mockAccount);
  });

  it('should map currencies to array of values', () => {
    const mockCurrencies = [
      { value: 'USD', label: 'US Dollar' },
      { value: 'EUR', label: 'Euro' },
      { value: 'GEL', label: 'Georgian Lari' },
    ];

    service.getCurrencies().subscribe((currencies) => {
      expect(currencies).toEqual(['USD', 'EUR', 'GEL']);
    });

    const req = httpMock.expectOne(`${apiUrl}/catalogs/currencies`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCurrencies);
  });
});
