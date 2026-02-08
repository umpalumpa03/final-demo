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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch summary and categories with correct HttpParams', () => {
    service.getSummary('2026-01-01', '2026-01-31').subscribe();
    const req1 = httpMock.expectOne(r => 
      r.url === `${apiUrl}/finances/summary` && 
      r.params.get('value') === '2026-01-01' &&
      r.params.get('value2') === '2026-01-31'
    );
    expect(req1.request.method).toBe('GET');
    req1.flush({});

    service.getCategories('2026-01-01').subscribe();
    const req2 = httpMock.expectOne(r => 
      r.url === `${apiUrl}/finances/category-breakdown` && 
      r.params.get('value') === '2026-01-01' &&
      !r.params.has('value2')
    );
    req2.flush([]);
  });

  it('should handle getFullFinancialData and cache the result', () => {
    const from = '2026-01-01';
    const to = '2026-01-31';

    service.getFullFinancialData(from, to).subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.summary).toBeDefined();
    });

    const endpoints = [
      'summary',
      'category-breakdown',
      'daily-spending',
      'income-vs-expenses',
      'savings-trend',
      'recent-transactions'
    ];

    endpoints.forEach(endpoint => {
      httpMock.expectOne(req => req.url.includes(endpoint)).flush({});
    });

    service.getFullFinancialData(from, to).subscribe();
    httpMock.expectNone(req => req.url.includes('finances'));

    service.getFullFinancialData(from, to, true).subscribe();
    endpoints.forEach(endpoint => {
      httpMock.expectOne(req => req.url.includes(endpoint)).flush({});
    });
  });

  it('should fetch trend data with correct month params', () => {
    service.getIncomeVsExpenses(5).subscribe();
    httpMock.expectOne(r => 
      r.url.includes('income-vs-expenses') && 
      r.params.get('months') === '5'
    ).flush([]);

    service.getRecentTransactions(10).subscribe();
    httpMock.expectOne(r => 
      r.url.includes('recent-transactions') && 
      r.params.get('limit') === '10'
    ).flush([]);
  });
});