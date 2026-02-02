import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CardListApiService } from './card-list.service.api';
import { environment } from '../../../../environments/environment';

describe('CardListApiService', () => {
  let service: CardListApiService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/cards`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CardListApiService],
    });

    service = TestBed.inject(CardListApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get card accounts', () => {
    const mockAccounts = [
      {
        id: 'acc-1',
        iban: 'GE123',
        name: 'Main',
        balance: 1000,
        currency: 'GEL',
        status: 'ACTIVE',
        cardIds: ['card-1'],
        openedAt: '2024-01-01',
      },
    ];

    service.getCardAccounts().subscribe((accounts) => {
      expect(accounts).toEqual(mockAccounts);
    });

    const req = httpMock.expectOne(`${apiUrl}/accounts`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAccounts);
  });

  it('should get card details', () => {
    const mockDetails = {
      id: 'card-1',
      accountId: 'acc-1',
      type: 'DEBIT' as const,
      network: 'VISA' as const,
      design: 'blue',
      cardName: 'My Card',
      status: 'ACTIVE' as const,
      allowOnlinePayments: true,
      allowInternational: true,
      allowAtm: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    service.getCardDetails('card-1').subscribe((details) => {
      expect(details).toEqual(mockDetails);
    });

    const req = httpMock.expectOne(`${apiUrl}/card-1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDetails);
  });
});