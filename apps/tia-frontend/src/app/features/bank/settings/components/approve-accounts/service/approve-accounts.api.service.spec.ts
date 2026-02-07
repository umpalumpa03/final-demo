import { TestBed } from '@angular/core/testing';
import { ApproveAccountsApiService } from './approve-accounts.api.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../../../environments/environment';

describe('ApproveAccountsApiService', () => {
  let service: ApproveAccountsApiService;
  let httpMock: HttpTestingController;

  const mockPermissions = [
    { id: 1, name: 'View Balance', value: 1 },
    { id: 2, name: 'Make Transfer', value: 2 },
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

  it('should be created', () => {
    expect(service).toBeTruthy();
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
});
