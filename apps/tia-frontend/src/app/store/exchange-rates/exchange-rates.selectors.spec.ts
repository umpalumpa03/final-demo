import { describe, it, expect } from 'vitest';
import { selectExchangeRates, selectLoading } from './exchange-rates.selectors';
import { ExchangeRateState } from './exchange-rates.state';
import { ExchangeRateInterface } from './models/exchange-rates.models';

describe('ExchangeRates Selectors', () => {
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

  const mockState: ExchangeRateState = {
    ExchangeRates: mockRates,
    loading: true,
    error: false,
  };

  it('should select exchange rates', () => {
    const result = selectExchangeRates.projector(mockState);
    expect(result).toEqual(mockRates);
  });

  it('should select loading state', () => {
    const result = selectLoading.projector(mockState);
    expect(result).toBe(true);
  });
});
