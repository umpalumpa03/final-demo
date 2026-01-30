import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FinancesService } from './finances.service';
import { environment } from "../../../../../environments/environment";
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('FinancesService', () => {
  let service: FinancesService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FinancesService]
    });
    service = TestBed.inject(FinancesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should fetch summary with correct params', () => {
    const mockData = { totalIncome: 1000 };
    
    service.getSummary('2026-01-01', '2026-01-31').subscribe(res => {
      expect(res).toEqual(mockData);
    });

    const req = httpMock.expectOne(req => 
      req.url === `${apiUrl}/finances/summary` && 
      req.params.get('value') === '2026-01-01' && 
      req.params.get('value2') === '2026-01-31'
    );
    
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch categories breakdown', () => {
    const mockCategories = [{ category: 'Food', amount: 200 }];
    
    service.getCategories('2026-01-01').subscribe(res => {
      expect(res).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(req => req.url.includes('/category-breakdown'));
    expect(req.request.params.has('value2')).toBe(false);
    req.flush(mockCategories);
  });

  it('should fetch income vs expenses with default months', () => {
    service.getIncomeVsExpenses().subscribe();

    const req = httpMock.expectOne(req => 
      req.url.includes('/income-vs-expenses') && 
      req.params.get('months') === '7'
    );
    req.flush([]);
  });

  it('should fetch daily spending with correct params', () => {
    service.getDailySpending('2026-01-01', '2026-01-10').subscribe();

    const req = httpMock.expectOne(req => 
      req.url.includes('/daily-spending') &&
      req.params.get('value2') === '2026-01-10'
    );
    req.flush([]);
  });
});