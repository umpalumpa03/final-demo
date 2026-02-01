import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PaybillService } from './paybill-service';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../../environments/environment';
import {
  ProceedPaymentPayload,
  ConfirmPaymentPayload,
} from '../../components/paybill-main/shared/models/paybill.model';

describe('PaybillService', () => {
  let service: PaybillService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/paybill`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaybillService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(PaybillService);
    httpMock = TestBed.inject(HttpTestingController);

    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue('mock-token'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0,
    });
  });

  afterEach(() => {
    httpMock.verify();
    vi.unstubAllGlobals();
  });

  it('should fetch categories', () => {
    const mockCategories = [{ id: '1', name: 'Utilities' }];

    service.getCategories().subscribe((data) => {
      expect(data).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(`${baseUrl}/categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('should fetch providers for a specific category', () => {
    const category = 'Utilities';
    const mockProviders = [{ id: 'p1', serviceName: 'Gas' }];

    service.getProviders(category).subscribe((data) => {
      expect(data).toEqual(mockProviders);
    });

    const req = httpMock.expectOne(`${baseUrl}/utilities`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProviders);
  });

  it('should call checkBill with correct payload', () => {
    const mockResponse = { valid: true, accountHolder: 'John Doe' };
    const serviceId = 'power-01';
    const accountNumber = '123456789';

    service.checkBill(serviceId, accountNumber).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/check-bill`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      serviceId,
      identification: { accountNumber },
    });

    req.flush(mockResponse);
  });

  it('should call payBill and return challenge details', () => {
    const payload: ProceedPaymentPayload = {
      amount: 100,
      serviceId: 's1',
      senderAccountId: 'acc-123',
      identification: { accountNumber: '987654' },
    };

    const mockResponse = {
      verify: { challengeId: 'challenge-xyz', method: 'SMS' },
      transferType: 'BillPayment',
    };

    service.payBill(payload).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/pay`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(mockResponse);
  });

  it('should call verifyPayment with correct payload and prefix', () => {
    const payload: ConfirmPaymentPayload = {
      challengeId: 'challenge-xyz',
      code: '1111',
    };

    service.verifyPayment(payload).subscribe((res) => {
      expect(res).toBeDefined();
    });

    const req = httpMock.expectOne(`${baseUrl}/verify`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush({ status: 'success' });
  });
});
