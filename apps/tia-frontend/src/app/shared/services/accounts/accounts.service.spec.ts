import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AccountsService } from './accounts.service';
import { environment } from '../../../../environments/environment';
import {
  AccountType,
  CreateAccountRequest,
} from '../../models/accounts/accounts.model';

describe('AccountsService', () => {
  let service: AccountsService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/accounts`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AccountsService],
    });
    service = TestBed.inject(AccountsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all accounts', () => {
    service.getAccounts().subscribe();
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should fetch account by id', () => {
    service.getAccountById('1').subscribe();
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should fetch currencies', () => {
    service.getCurrencies().subscribe();
    const req = httpMock.expectOne(`${apiUrl}/catalogs/currencies`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should create account', () => {
    const createRequest: CreateAccountRequest = {
      friendlyName: 'New Account',
      type: AccountType.saving,
      currency: 'USD',
    };
    service.createAccount(createRequest).subscribe();
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createRequest);
    req.flush({
      id: '1',
      ...createRequest,
      balance: 0,
      isActive: true,
      accountNumber: '123',
      createdAt: '2024-01-01',
    });
  });

  it('should make transfer', () => {
    service.makeTransfer('1').subscribe();
    const req = httpMock.expectOne(`${apiUrl}/1/transfer`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });
});
