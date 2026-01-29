import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FinancesService } from './finances.service';
import { environment } from "../../../../../environments/environment";
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('FinancesService', () => {
  let service: FinancesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FinancesService]
    });
    service = TestBed.inject(FinancesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch summary data via GET', () => {
    const mockData = { income: 100 };
    service.getSummary('2026-01-01', '2026-01-31').subscribe(res => {
      expect(res).toEqual(mockData);
    });

    const req = httpMock.expectOne(r => r.url.includes('/finances/summary'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('value')).toBe('2026-01-01');
    req.flush(mockData);
  });
});