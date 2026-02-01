import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CardListService } from './card-list.service';
import { environment } from '../../../../environments/environment';

describe('CardListService', () => {
  let service: CardListService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/cards`;

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
    it('should fetch card accounts', () => {
      const mockAccounts = [
        {
          id: 'acc-123',
          iban: 'GE00TB0000000000000000',
          name: 'My Account',
          balance: 1000,
          currency: 'GEL',
          status: 'ACTIVE',
          cardIds: ['card-123'],
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
  });

  describe('getCardImage', () => {
    it('should fetch card image as text', () => {
      const mockImage = 'data:image/png;base64,abc123';
      const cardId = 'card-123';

      service.getCardImage(cardId).subscribe((image) => {
        expect(image).toBe(mockImage);
      });

      const req = httpMock.expectOne(`${apiUrl}/${cardId}/image`);
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('text');
      req.flush(mockImage);
    });
  });

  describe('getCardDetails', () => {
    it('should fetch card details', () => {
      const mockDetails = {
        id: 'card-123',
        accountId: 'acc-123',
        type: 'DEBIT' as const,
        network: 'VISA' as const,
        design: 'design-1',
        cardName: 'My Card',
        status: 'ACTIVE' as const,
        allowOnlinePayments: true,
        allowInternational: true,
        allowAtm: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      const cardId = 'card-123';

      service.getCardDetails(cardId).subscribe((details) => {
        expect(details).toEqual(mockDetails);
      });

      const req = httpMock.expectOne(`${apiUrl}/${cardId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockDetails);
    });
  });
describe('getCardDesigns', () => {
  it('should fetch and transform card designs', () => {
    const mockDesigns = [
      { design: 'design-1', designName: 'Classic', uri: '/designs/classic.png' },
      { design: 'design-2', designName: 'Modern', uri: '/designs/modern.png' },
    ];

    const expectedDesigns = [
      { id: 'design-1', designName: 'Classic', uri: `${environment.apiUrl}/designs/classic.png` },
      { id: 'design-2', designName: 'Modern', uri: `${environment.apiUrl}/designs/modern.png` },
    ];

    service.getCardDesigns().subscribe((designs) => {
      expect(designs).toEqual(expectedDesigns);
    });

    const req = httpMock.expectOne(`${apiUrl}/designs`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDesigns);
  });
});

  describe('getCardCategories', () => {
    it('should fetch card categories', () => {
      const mockCategories = [
        { value: 'DEBIT' as const, displayName: 'Debit Card' },
        { value: 'CREDIT' as const, displayName: 'Credit Card' },
      ];

      service.getCardCategories().subscribe((categories) => {
        expect(categories).toEqual(mockCategories);
      });

      const req = httpMock.expectOne(`${apiUrl}/categories-catalog`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategories);
    });
  });

  describe('getCardTypes', () => {
    it('should fetch card types', () => {
      const mockTypes = [
        { value: 'VISA' as const, displayName: 'Visa' },
        { value: 'MASTERCARD' as const, displayName: 'Mastercard' },
      ];

      service.getCardTypes().subscribe((types) => {
        expect(types).toEqual(mockTypes);
      });

      const req = httpMock.expectOne(`${apiUrl}/types-catalog`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTypes);
    });
  });

  describe('createCard', () => {
    it('should create card', () => {
      const mockRequest = {
        accountId: 'acc-123',
        design: 'design-1',
        cardName: 'My New Card',
        cardCategory: 'DEBIT' as const,
        cardType: 'VISA' as const,
      };

      const mockResponse = { success: true };

      service.createCard(mockRequest).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/request-card`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });
  });
});