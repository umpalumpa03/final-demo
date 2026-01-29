import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PaybillService } from './paybill-service';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { environment } from '../../../../../../environments/environment';

describe('PaybillService', () => {
  let service: PaybillService;
  let httpMock: HttpTestingController;

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
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch categories with correct URL', () => {
    const mockCategories = [{ id: '1', name: 'Utilities' }];

    service.getCategories().subscribe((data) => {
      expect(data).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(
      'https://tia.up.railway.app/paybill/categories',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('should call checkBill with correct payload and URL', () => {
    const mockResponse = { valid: true };
    service.checkBill('power-1', '012345').subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/paybill/check-bill`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.serviceId).toBe('power-1');
    expect(req.request.body.identification.accountNumber).toBe('012345');

    req.flush(mockResponse);
  });
});
