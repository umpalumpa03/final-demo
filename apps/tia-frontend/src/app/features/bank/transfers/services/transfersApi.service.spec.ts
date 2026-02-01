import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TransfersApiService } from './transfersApi.service';
import { environment } from '../../../../../environments/environment';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('TransfersApiService (vitest)', () => {
  let service: TransfersApiService;
  let httpMock: HttpTestingController;
  const baseURL = `${environment.apiUrl}/transfers`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransfersApiService],
    });

    service = TestBed.inject(TransfersApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call lookupByPhone and return recipient data', () => {
    const mockResponse = { fullName: 'John Doe', accounts: [] };
    const phone = '555123456';

    service.lookupByPhone(phone).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${baseURL}/tia-transfer/lookup-recipient-by-personal-info`,
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      identifier: phone,
      identifierType: 'phoneNumber',
    });
    req.flush(mockResponse);
  });

  it('should call lookupByIban and return recipient data', () => {
    const mockResponse = { fullName: 'Jane Doe', accounts: [] };
    const iban = 'GE123TIA';

    service.lookupByIban(iban).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${baseURL}/tia-transfer/lookup-recipient-by-iban`,
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ iban });
    req.flush(mockResponse);
  });

  it('should call getFee with correct params', () => {
    const mockFee = { fee: 5 };
    const accountId = 'acc-123';
    const amount = 100;

    service.getFee(accountId, amount).subscribe((res) => {
      expect(res).toEqual(mockFee);
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url === `${baseURL}/get-fee` &&
        request.params.get('senderAccountId') === accountId &&
        request.params.get('amountToSend') === '100',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockFee);
  });
});
