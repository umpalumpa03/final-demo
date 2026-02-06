import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TransfersApiService } from './transfersApi.service';
import { environment } from '../../../../../environments/environment';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('TransfersApiService', () => {
  let service: TransfersApiService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/transfers`;

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

  it('should lookup by phone with correct payload', () => {
    const phone = '555123456';
    service.lookupByPhone(phone).subscribe();

    const req = httpMock.expectOne(
      `${baseUrl}/tia-transfer/lookup-recipient-by-personal-info`,
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      identifier: phone,
      identifierType: 'phoneNumber',
    });
    req.flush({});
  });

  it('should lookup by IBAN with correct payload', () => {
    const iban = 'GE123TIA';
    service.lookupByIban(iban).subscribe();

    const req = httpMock.expectOne(
      `${baseUrl}/tia-transfer/lookup-recipient-by-iban`,
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ iban });
    req.flush({});
  });

  it('should get fee with query params mapped correctly', () => {
    service.getFee('acc-1', 100).subscribe();

    const req = httpMock.expectOne(
      (req) =>
        req.url === `${baseUrl}/get-fee` &&
        req.params.get('senderAccountId') === 'acc-1' &&
        req.params.get('amountToSend') === '100',
    );
    expect(req.request.method).toBe('GET');
    req.flush({ fee: 5 });
  });

  it('should handle transferSameBank call', () => {
    const payload = {
      senderAccountId: '1',
      receiverAccountIban: '2',
      description: 'test',
      amountToSend: 10,
    };
    service.transferSameBank(payload).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/tia-transfers/someone`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });

  it('should handle transferExternalBank call', () => {
    const payload = {
      senderAccountId: '1',
      receiverAccountIban: '2',
      receiverAccountCurrency: 'GEL',
      receiverName: 'John',
      amountToSend: 10,
      description: 'test',
    };
    service.transferExternalBank(payload).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/someone/external-bank`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });

  it('should handle verifyTransfer with optional code (Branch Coverage)', () => {
    service.verifyTransfer({ challengeId: 'ch-1', code: '123' }).subscribe();
    const req1 = httpMock.expectOne(`${baseUrl}/verify`);
    expect(req1.request.body).toEqual({ challengeId: 'ch-1', code: '123' });
    req1.flush({});

    service.verifyTransfer({ challengeId: 'ch-2' }).subscribe();
    const req2 = httpMock.expectOne(`${baseUrl}/verify`);
    expect(req2.request.body).toEqual({ challengeId: 'ch-2' });
    req2.flush({});
  });
});
