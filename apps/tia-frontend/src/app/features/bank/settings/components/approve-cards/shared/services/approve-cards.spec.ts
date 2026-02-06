import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApproveCardsService } from './approve-cards.service';
import { UpdateCardStatusRequest, CardPermission } from '../model/approve-cards.model';
import { environment } from '../../../../../../../../environments/environment';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('ApproveCardsService', () => {
  let service: ApproveCardsService;
  let httpMock: HttpTestingController;
  
  const url = `${environment.apiUrl}/cards`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApproveCardsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ApproveCardsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch pending cards via GET', () => {
    const mockCards = [{ id: '1', nickname: 'Test Card' }] as any;

    service.getPendingCards().subscribe((cards) => {
      expect(cards).toEqual(mockCards);
    });

    const req = httpMock.expectOne(`${url}/pending`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCards);
  });

  it('should update card status via PUT', () => {
    const mockRequest: UpdateCardStatusRequest = {
      cardId: '123',
      status: 'APPROVED' as any,
      permissions: ['allowAtm' as CardPermission]
    };

    service.changeCardStatus(mockRequest).subscribe();

    const req = httpMock.expectOne(`${url}/pending`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockRequest);
    
    req.flush(null);
  });
});