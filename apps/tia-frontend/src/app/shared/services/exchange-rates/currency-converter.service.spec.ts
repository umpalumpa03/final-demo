import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { signal } from '@angular/core';
import { CurrencyConverterService } from './currency-converter.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CurrencyConverterService', () => {
  let service: CurrencyConverterService;
  let mockRatesSignal: any;

  const mockRates = [
    { code: 'USD', rate: 2.65 },
    { code: 'EUR', rate: 2.85 },
    { code: 'GBP', rate: 3.3 },
  ];

  beforeEach(() => {
    mockRatesSignal = signal(mockRates);

    const storeMock = {
      selectSignal: vi.fn().mockReturnValue(mockRatesSignal),
    };

    TestBed.configureTestingModule({
      providers: [
        CurrencyConverterService,
        { provide: Store, useValue: storeMock },
      ],
    });

    service = TestBed.inject(CurrencyConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the same amount when currency is GEL', () => {
    const amount = 100;
    const result = service.convertToGEL(amount, 'GEL');
    expect(result).toBe(amount);
  });

  it('should react to store signal changes', () => {
    mockRatesSignal.set([{ code: 'USD', rate: 3.0 }]);

    const result = service.convertToGEL(10, 'USD');
    expect(result).toBe(30);
  });
});
