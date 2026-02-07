import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApproveCardsService } from './approve-cards.service';
import { environment } from '../../../../../../../../environments/environment';
import { CardPermission } from '../model/approve-cards.model';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('ApproveCardsService', () => {
  let service: ApproveCardsService;
  let httpMock: HttpTestingController;

  const url = `${environment.apiUrl}/cards/pending`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ApproveCardsService,
      ],
    });

    service = TestBed.inject(ApproveCardsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should get pending cards', () => {
    const mockData = [{ id: '1' }] as any;

    service.getPendingCards().subscribe((res) => {
      expect(res).toEqual(mockData);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should change card status', () => {
    const body = { 
      cardId: '1', 
      status: 'APPROVED' as any, 
      permissions: ['allowAtm' as CardPermission] 
    };

    service.changeCardStatus(body).subscribe();

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush({});
  });
});