import { TestBed } from '@angular/core/testing';
import { LoansService } from './loans.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ILoan } from '../models/loan.model';
import { environment } from '../../../../../../environments/environment';

describe('LoansService', () => {
  let service: LoansService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl + '/loans';

  const mockLoan: ILoan = {
    id: '1',
    loanAmount: 1000,
    accountId: 'acc-1',
    months: 12,
    purpose: 'Test',
    status: 1,
    statusName: 'Pending',
    monthlyPayment: 100,
    nextPaymentDate: '2026-01-01',
    createdAt: '2025-01-01',
    friendlyName: 'Test Loan',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoansService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(LoansService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all loans without params', () => {
    const mockLoans: ILoan[] = [mockLoan];

    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('fake-token');

    service.getAllLoans().subscribe((loans) => {
      expect(loans).toEqual(mockLoans);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    expect(req.request.params.keys().length).toBe(0);

    req.flush(mockLoans);
  });

  it('should get all loans WITH status param', () => {
    const mockLoans: ILoan[] = [];

    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    service.getAllLoans(2).subscribe();

    const req = httpMock.expectOne(
      (req) => req.url === apiUrl && req.params.has('status'),
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('status')).toBe('2');
    expect(req.request.headers.get('Authorization')).toBe('Bearer ');

    req.flush(mockLoans);
  });
});
