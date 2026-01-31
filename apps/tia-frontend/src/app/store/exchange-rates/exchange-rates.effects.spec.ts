import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { ExchangeRatesEffects } from './exchange-rates.effects';
import { ExchangeRatesService } from '@tia/shared/services/exchange-rates/exchange-rates.api.service';
import { loadExchangeRates, loadExchangeRatesSuccess, loadExchangeRatesFailure } from './exchange-rates.actions';
import { ExchangeRateInterface } from './models/exchange-rates.models';

describe('ExchangeRatesEffects', () => {
  let actions$: Observable<any>;
  let effects: ExchangeRatesEffects;
  let service: { loadExchangeRates: ReturnType<typeof vi.fn> };

  const mockRates: ExchangeRateInterface[] = [{
    code: 'EUR',
    rate: 0.85,
    previousRate: 0.84,
    changePercent: 1.19,
    isPositive: true,
    name: 'Euro',
    symbol: '€',
    flagUrl: '',
    lastUpdated: '2024-01-01'
  }];

  beforeEach(() => {
    service = {
      loadExchangeRates: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        ExchangeRatesEffects,
        provideMockActions(() => actions$),
        { provide: ExchangeRatesService, useValue: service }
      ]
    });

    effects = TestBed.inject(ExchangeRatesEffects);
  });

  it('should return loadExchangeRatesSuccess on success', async () => {
    service.loadExchangeRates.mockReturnValue(of(mockRates));
    actions$ = of(loadExchangeRates({ baseCurrency: 'USD' }));

    const action = await new Promise(resolve => {
      effects.loadExchangeRates$.subscribe(resolve);
    });

    expect(action).toEqual(loadExchangeRatesSuccess({ ExchangeRates: mockRates }));
  });

  it('should return loadExchangeRatesFailure on error', async () => {
    service.loadExchangeRates.mockReturnValue(throwError(() => new Error('error')));
    actions$ = of(loadExchangeRates({ baseCurrency: 'USD' }));

    const action = await new Promise(resolve => {
      effects.loadExchangeRates$.subscribe(resolve);
    });

    expect(action).toEqual(loadExchangeRatesFailure());
  });

  it('should use default baseCurrency USD', async () => {
    service.loadExchangeRates.mockReturnValue(of(mockRates));
    actions$ = of(loadExchangeRates({}));

    await new Promise(resolve => {
      effects.loadExchangeRates$.subscribe(resolve);
    });

    expect(service.loadExchangeRates).toHaveBeenCalledWith('USD');
  });
});
