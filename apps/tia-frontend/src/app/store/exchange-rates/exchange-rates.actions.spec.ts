import { describe, it, expect } from 'vitest';
import { loadExchangeRates, loadExchangeRatesSuccess, loadExchangeRatesFailure } from './exchange-rates.actions';
import { ExchangeRateInterface } from './models/exchange-rates.models';

describe('ExchangeRates Actions', () => {
  describe('loadExchangeRates', () => {
    it('should create an action with baseCurrency', () => {
      const action = loadExchangeRates({ baseCurrency: 'EUR' });
      expect(action.type).toBe('[EXCHANGE_RATES] Load Exchange Rates');
      expect(action.baseCurrency).toBe('EUR');
    });

    it('should create an action without baseCurrency', () => {
      const action = loadExchangeRates({});
      expect(action.type).toBe('[EXCHANGE_RATES] Load Exchange Rates');
    });
  });

  describe('loadExchangeRatesSuccess', () => {
    it('should create an action with exchange rates', () => {
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
      const action = loadExchangeRatesSuccess({ ExchangeRates: mockRates });
      expect(action.type).toBe('[EXCHANGE_RATES] Load Exchange Rates Success');
      expect(action.ExchangeRates).toEqual(mockRates);
    });
  });

  describe('loadExchangeRatesFailure', () => {
    it('should create an action', () => {
      const action = loadExchangeRatesFailure();
      expect(action.type).toBe('[EXCHANGE_RATES] Load Exchange Rates Failure');
    });
  });
});
