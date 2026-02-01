import { describe, it, expect } from 'vitest';
import * as Selectors from './exchange-rates.selectors';
import { ExchangeRateState } from './exchange-rates.state';
import { ExchangeRateInterface } from './models/exchange-rates.models';
describe('ExchangeRates Selectors', () => {
  const mockRates = [
    { code: 'USD', rate: 2.65 } as ExchangeRateInterface,
    { code: 'EUR', rate: 2.85 } as ExchangeRateInterface,
  ];

  const mockFeatureState: ExchangeRateState = {
    ExchangeRates: mockRates,
    loading: false,
    error: false,
  };

  const globalState = {
    ExchangeRates: mockFeatureState,
  };

  it('should verify the feature selector statement', () => {
    const result = Selectors.selectExchangeRatesSelector(globalState);
    expect(result).toEqual(mockFeatureState);
  });

  it('should select the ExchangeRates array', () => {
    const result = Selectors.selectExchangeRates.projector(mockFeatureState);
    expect(result).toEqual(mockRates);
  });

  it('should select loading state', () => {
    const result = Selectors.selectLoading.projector(mockFeatureState);
    expect(result).toBe(false);
  });

  it('should execute the rate by code factory (Statement 19)', () => {
    const selectorFactory = Selectors.selectRateByCode('usd');

    const result = selectorFactory.projector(mockRates);

    expect(result).toBe(2.65);
  });
});
