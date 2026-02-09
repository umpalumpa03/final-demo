import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApproveCardsService } from './approve-cards.service';
import { environment } from '../../../../../../../../environments/environment';
import { CardPermission } from '../../../../shared/models/approve-models/cards-models/approve-cards.model';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('ApproveCardsService', () => {
  let service: ApproveCardsService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiUrl}/cards`;

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
    service.getPendingCards().subscribe((res) => expect(res).toEqual(mockData));

    const req = httpMock.expectOne(`${baseUrl}/pending`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should change card status', () => {
    const body = {
      cardId: '1',
      status: 'APPROVED' as any,
      permissions: ['allowAtm' as CardPermission],
    };

    service.changeCardStatus(body).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/change-card-status`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush({});
  });

  it('should fetch card permissions catalog', () => {
    const mockCatalog = [{ value: 'p1', displayName: 'Perm 1' }] as any;
    service
      .getCardPermissions()
      .subscribe((res) => expect(res).toEqual(mockCatalog));

    const req = httpMock.expectOne(`${baseUrl}/catalog/permissions`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCatalog);
  });

  it('should handle error when fetching pending cards', () => {
    let actualError: any;

    service.getPendingCards().subscribe({
      next: () => {
        throw new Error('Should have failed');
      },
      error: (error) => {
        actualError = error;
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/pending`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(actualError.status).toBe(500);
  });
});
