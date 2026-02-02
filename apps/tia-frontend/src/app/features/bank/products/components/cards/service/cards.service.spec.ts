import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CardsService } from './cards.service';
import { environment } from 'apps/tia-frontend/src/environments/environment';

describe('CardsService', () => {
  let service: CardsService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/cards`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CardsService],
    });

    service = TestBed.inject(CardsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get card image', () => {
    const mockImage = 'base64ImageString';

    service.getCardImage('card-1').subscribe((image) => {
      expect(image).toBe(mockImage);
    });

    const req = httpMock.expectOne(`${apiUrl}/card-1/image`);
    expect(req.request.method).toBe('GET');
    req.flush(mockImage);
  });

  it('should get and transform card designs', () => {
    const mockBackendResponse = [
      { design: 'blue', designName: 'Blue Card', uri: '/designs/blue.jpg' },
    ];

    service.getCardDesigns().subscribe((designs) => {
      expect(designs).toEqual([
        { id: 'blue', designName: 'Blue Card', uri: `${environment.apiUrl}/designs/blue.jpg` },
      ]);
    });

    const req = httpMock.expectOne(`${apiUrl}/designs`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBackendResponse);
  });

  it('should get card categories', () => {
    const mockCategories = [{ value: 'DEBIT' as const, displayName: 'Debit' }];

    service.getCardCategories().subscribe((categories) => {
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(`${apiUrl}/categories-catalog`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('should get card types', () => {
    const mockTypes = [{ value: 'VISA' as const, displayName: 'Visa' }];

    service.getCardTypes().subscribe((types) => {
      expect(types).toEqual(mockTypes);
    });

    const req = httpMock.expectOne(`${apiUrl}/types-catalog`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTypes);
  });

  it('should create card', () => {
    const mockRequest = {
      accountId: 'acc-1',
      design: 'blue',
      cardName: 'My Card',
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