import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CardListService } from './card-list.service';
import { CardAccount } from '../models/card-account.model';
import { environment } from '../../../../../../../environments/environment';

describe('CardListService', () => {
  let service: CardListService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/cards`;

  const mockAccounts: CardAccount[] = [
    {
      id: 'acc1',
      iban: 'GE29TIA7890123456789012',
      name: 'Main GEL Account',
      balance: 4500000,
      currency: 'GEL',
      status: 'active',
      cardIds: ['card1'],
      openedAt: '2026-01-18T01:10:50.948Z',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CardListService],
    });

    service = TestBed.inject(CardListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCardAccounts', () => {
    it('should fetch card accounts successfully', () => {
      service.getCardAccounts().subscribe((accounts) => {
        expect(accounts).toEqual(mockAccounts);
      });

      httpMock.expectOne(`${baseUrl}/accounts`).flush(mockAccounts);
    });

    it('should handle HTTP error', () => {
      service.getCardAccounts().subscribe({
        next: () => expect.fail('should have failed'),
        error: (error) => expect(error.status).toBe(500),
      });

      httpMock.expectOne(`${baseUrl}/accounts`).flush(null, { status: 500, statusText: 'Error' });
    });
  });

  describe('getCardImage', () => {
    const cardId = 'card1';
    const mockImage = 'data:image/svg+xml;base64,test';

    it('should fetch card image successfully', () => {
      service.getCardImage(cardId).subscribe((image) => {
        expect(image).toBe(mockImage);
      });

      const req = httpMock.expectOne(`${baseUrl}/${cardId}/image`);
      expect(req.request.responseType).toBe('text');
      req.flush(mockImage);
    });

    it('should handle HTTP error', () => {
      service.getCardImage(cardId).subscribe({
        next: () => expect.fail('should have failed'),
        error: (error) => expect(error.status).toBe(404),
      });

      httpMock.expectOne(`${baseUrl}/${cardId}/image`).flush(null, { status: 404, statusText: 'Not Found' });
    });
  });
});