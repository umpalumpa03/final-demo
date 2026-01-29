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
    TestBed.resetTestingModule();
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

  it('should fetch all accounts with correct params', () => {
    service.getAccounts().subscribe();
    const req = httpMock.expectOne(
      (request) =>
        request.url === apiUrl &&
        request.params.get('ignoreHiddens') === 'true' &&
        request.params.get('status') === 'active'
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
    let req = httpMock.expectOne(apiUrl);
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
});
