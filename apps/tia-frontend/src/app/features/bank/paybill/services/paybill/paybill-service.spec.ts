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
  PaybillIdentification,
  BillDetails,
  PaybillCategory,
  PaybillProvider,
  ProceedPaymentResponse,
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
  });

  afterEach(() => {
    httpMock.verify();
    vi.unstubAllGlobals();
  });

  it('should fetch categories (GET)', () => {
    const mockCategories: PaybillCategory[] = [
      {
        id: '1',
        name: 'Utilities',
        icon: 'utility.svg',
        description: 'Pay bills',
        servicesQuantity: 5,
      },
    ];

    service.getCategories().subscribe((data) => {
      expect(data).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(`${baseUrl}/categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('should fetch providers for a specific category (GET)', () => {
    const categoryId = 'mobile';
    const mockProviders: PaybillProvider[] = [
      {
        id: 'magti',
        serviceName: 'Magti',
        categoryId: 'mobile',
        name: 'Magti',
      },
    ];

    service.getProviders(categoryId).subscribe((data) => {
      expect(data).toEqual(mockProviders);
    });

    const req = httpMock.expectOne(`${baseUrl}/${categoryId.toLowerCase()}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProviders);
  });

  it('should check bill with correct identification payload (POST)', () => {
    const serviceId = 'my-video';

    const identification: PaybillIdentification = {
      phoneNumber: '599123456',
    };

    const mockResponse: BillDetails = {
      valid: true,
      accountHolder: 'John Doe',
      address: 'Tbilisi',
      amountDue: 25.5,
      dueDate: '2024-01-01',
      isExactAmount: false,
    };

    service.checkBill(serviceId, identification).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/check-bill`);
    expect(req.request.method).toBe('POST');

    expect(req.request.body).toEqual({
      serviceId,
      identification,
    });

    req.flush(mockResponse);
  });

  it('should proceed to payment (POST)', () => {
    const payload: ProceedPaymentPayload = {
      serviceId: 'my-video',
      identification: { phoneNumber: '599123456' },
      amount: 50,
      senderAccountId: 'GB123456',
    };

    const mockResponse: ProceedPaymentResponse = {
      transferType: 'INTERNAL',
      message: 'Success',
    };

    service.payBill(payload).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/pay`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should verify payment OTP (POST)', () => {
    const payload: ConfirmPaymentPayload = {
      challengeId: 'challenge-123',
      code: '123456',
    };

    const mockResponse: ProceedPaymentResponse = {
      transferType: 'INTERNAL',
      message: 'Payment Confirmed',
    };

    service.verifyPayment(payload).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/verify`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should handle HTTP errors gracefully', () => {
    const category = 'internet';

    service.getProviders(category).subscribe({
      next: () => {},
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/${category}`);
    req.flush('Something went wrong', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  });
  it('should resend OTP (POST)', () => {
    const challengeId = 'challenge-123';
    const mockResponse = { success: true };

    service.resendOtp(challengeId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/resend-otp`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(challengeId);
    req.flush(mockResponse);
  });

  it('should get payment details (GET)', () => {
    const serviceId = 'service-123';
    const mockDetails = {
      amount: 100,
      currency: 'GEL',
      dueDate: '2024-01-01',
    } as any;

    service.getPaymentDetails(serviceId).subscribe((res) => {
      expect(res).toEqual(mockDetails);
    });

    const req = httpMock.expectOne(`${baseUrl}/payment-details/${serviceId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDetails);
  });

  it('should create a template (POST)', () => {
    const serviceId = 'service-123';
    const identification = { phoneNumber: '599123456' };
    const nickname = 'My Template';
    const mockTemplate = { id: 'template-1', nickname } as any;

    service.createTemplate(serviceId, identification, nickname).subscribe((res) => {
      expect(res).toEqual(mockTemplate);
    });

    const req = httpMock.expectOne(`${baseUrl}/templates`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ serviceId, identification, nickname });
    req.flush(mockTemplate);
  });
});
