import { describe, it, expect } from 'vitest';
import { ExchangeRateReducer } from './exchange-rates.reducers';
import { loadExchangeRates, loadExchangeRatesSuccess, loadExchangeRatesFailure } from './exchange-rates.actions';
import { initialState } from './exchange-rates.state';
import { ExchangeRateInterface } from './models/exchange-rates.models';

describe('ExchangeRateReducer', () => {
  const mockRate: ExchangeRateInterface = {
    code: 'EUR',
    rate: 0.85,
    previousRate: 0.84,
    changePercent: 1.19,
    isPositive: true,
    name: 'Euro',
    symbol: '€',
    flagUrl: '',
    lastUpdated: '2024-01-01'
  };

  it('should return the initial state', () => {
    const action = { type: 'Unknown' } as any;
    const state = ExchangeRateReducer(undefined, action);
    expect(state).toBe(initialState);
  });

  it('should set loading to true on loadExchangeRates', () => {
    const action = loadExchangeRates({ baseCurrency: 'USD' });
    const state = ExchangeRateReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBe(false);
  });

  it('should set exchange rates and loading to false on loadExchangeRatesSuccess', () => {
    const mockRates: ExchangeRateInterface[] = [mockRate];
    const action = loadExchangeRatesSuccess({ ExchangeRates: mockRates });
    const state = ExchangeRateReducer(initialState, action);
    expect(state.ExchangeRates).toEqual(mockRates);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(false);
  });

  it('should set error to true and loading to false on loadExchangeRatesFailure', () => {
    const action = loadExchangeRatesFailure();
    const state = ExchangeRateReducer(initialState, action);
    expect(state.error).toBe(true);
    expect(state.loading).toBe(false);
  });
});
