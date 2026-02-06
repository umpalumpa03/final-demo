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

  afterEach(() => httpMock.verify());

  it('should fetch summary and categories with date range params', () => {
    service.getSummary('2026-01-01', '2026-01-31').subscribe();
    service.getCategories('2026-01-01').subscribe();

    const req1 = httpMock.expectOne(r => r.url.endsWith('/summary') && r.params.get('value2') === '2026-01-31');
    const req2 = httpMock.expectOne(r => r.url.endsWith('/category-breakdown') && !r.params.has('value2'));

    expect(req1.request.method).toBe('GET');
    req1.flush({});
    req2.flush([]);
  });

  it('should fetch trend data (income, savings) with default or custom months', () => {
    service.getIncomeVsExpenses(5).subscribe();
    service.getSavingsTrend().subscribe(); 

    httpMock.expectOne(r => r.url.includes('income-vs-expenses') && r.params.get('months') === '5').flush([]);
    httpMock.expectOne(r => r.url.includes('savings-trend') && r.params.get('months') === '7').flush([]);
  });

  it('should fetch daily spending and recent transactions', () => {
    service.getDailySpending('2026-02-01').subscribe();
    service.getRecentTransactions(10).subscribe();

    httpMock.expectOne(r => r.url.includes('daily-spending')).flush([]);
    const req = httpMock.expectOne(r => r.url.includes('recent-transactions') && r.params.get('limit') === '10');
    
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});