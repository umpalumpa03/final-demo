import { TestBed } from '@angular/core/testing';
import { LoansService } from './loans.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ILoan } from '../models/loan.model';
import { environment } from '../../../../../../environments/environment';

describe('LoansService', () => {
  let service: LoansService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/loans`;

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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all loans without params', () => {
    const mockLoans: ILoan[] = [mockLoan];

    service.getAllLoans().subscribe((loans) => {
      expect(loans).toEqual(mockLoans);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys().length).toBe(0);

    req.flush(mockLoans);
  });

  it('should get all loans WITH status param', () => {
    const mockLoans: ILoan[] = [];

    service.getAllLoans(2).subscribe();

    const req = httpMock.expectOne(
      (req) => req.url === apiUrl && req.params.has('status'),
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('status')).toBe('2');

    req.flush(mockLoans);
  });

  it('should update friendly name', () => {
    const loanId = '123';
    const newName = 'My New Loan';
    const updatedLoan: ILoan = { ...mockLoan, friendlyName: newName };

    service.updateFriendlyName(loanId, newName).subscribe((loan) => {
      expect(loan).toEqual(updatedLoan);
    });

    const req = httpMock.expectOne(`${apiUrl}/update-friendly-name/${loanId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ friendlyName: newName });

    req.flush(updatedLoan);
  });

  it('should get loan by id', () => {
    const loanId = '1';
    service.getLoanById(loanId).subscribe((res) => {
      expect(res).toEqual(mockLoan);
    });
    const req = httpMock.expectOne(`${apiUrl}/${loanId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLoan);
  });

  it('should get loan months', () => {
    const mockResponse = [6, 12, 24];
    service
      .getLoanMonths()
      .subscribe((res) => expect(res).toEqual(mockResponse));
    const req = httpMock.expectOne(`${apiUrl}/loan-months`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get purposes', () => {
    const mockPurposes = [{ value: '1', displayText: 'Home' }];
    service.getPurposes().subscribe((res) => expect(res).toEqual(mockPurposes));
    const req = httpMock.expectOne(`${apiUrl}/catalog/purposes`);
    req.flush(mockPurposes);
  });

  it('should get prepayment options', () => {
    const mockOptions = [{ prepaymentValue: 'full', isActive: true }];
    service
      .getPrepaymentOptions()
      .subscribe((res) => expect(res).toEqual(mockOptions));
    const req = httpMock.expectOne(`${apiUrl}/loan-prepayment-options`);
    req.flush(mockOptions);
  });

  it('should calculate partial prepayment', () => {
    const loanId = '1';
    const amount = 100;
    const option = 'reduceMonthlyPayment';
    const mockResponse = { monthlyPayment: 90 } as any;

    service
      .calculatePartialPrepayment(loanId, amount, option)
      .subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(
      (req) =>
        req.url === `${apiUrl}/calculate-partial-prepayment` &&
        req.params.get('loanId') === loanId &&
        req.params.get('amount') === amount.toString() &&
        req.params.get('option') === option,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should initiate prepayment', () => {
    const payload = { loanId: '1', amount: 500 } as any;
    const mockResponse = { verify: { challengeId: '123' } };

    service
      .initiatePrepayment(payload)
      .subscribe((res) => expect(res).toEqual(mockResponse));

    const req = httpMock.expectOne(`${apiUrl}/loan-prepayment`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should verify prepayment', () => {
    const payload = { challengeId: '123', code: '0000' };
    const mockResponse = { success: true };

    service
      .verifyPrepayment(payload)
      .subscribe((res) => expect(res).toEqual(mockResponse));

    const req = httpMock.expectOne(`${apiUrl}/verify-prepayment`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });
});
