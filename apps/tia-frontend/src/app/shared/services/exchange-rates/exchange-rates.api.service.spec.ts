import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ExchangeRatesService } from './exchange-rates.api.service';
import { ExchangeRateResponse } from '../../../store/exchange-rates/models/exchange-rates.models';
import { environment } from '../../../../environments/environment';

describe('ExchangeRatesService', () => {
  let service: ExchangeRatesService;
  let httpMock: HttpTestingController;

  const mockResponse: ExchangeRateResponse = {
    success: true,
    timestamp: '2024-01-01T00:00:00Z',
    base: 'USD',
    rates: [
      {
        code: 'EUR',
        rate: 0.85,
        previousRate: 0.84,
        changePercent: 1.19,
        isPositive: true,
        name: 'Euro',
        symbol: '€',
        flagUrl: '',
        lastUpdated: '2024-01-01'
      },
      {
        code: 'GBP',
        rate: 0.73,
        previousRate: 0.72,
        changePercent: 1.39,
        isPositive: true,
        name: 'British Pound',
        symbol: '£',
        flagUrl: '',
        lastUpdated: '2024-01-01'
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExchangeRatesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ExchangeRatesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load exchange rates with default USD base currency', () => {
    service.loadExchangeRates().subscribe(rates => {
      expect(rates).toEqual(mockResponse.rates);
      expect(rates.length).toBe(2);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/exchange-rates?base=USD`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('base')).toBe('USD');
    req.flush(mockResponse);
  });

  it('should load exchange rates with custom base currency', () => {
    service.loadExchangeRates('EUR').subscribe(rates => {
      expect(rates).toEqual(mockResponse.rates);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/exchange-rates?base=EUR`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('base')).toBe('EUR');
    req.flush(mockResponse);
  });

  it('should map response to rates array', () => {
    service.loadExchangeRates().subscribe(rates => {
      expect(Array.isArray(rates)).toBe(true);
      expect(rates[0]).toHaveProperty('code');
      expect(rates[0]).toHaveProperty('rate');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/exchange-rates?base=USD`);
    req.flush(mockResponse);
  });
});
