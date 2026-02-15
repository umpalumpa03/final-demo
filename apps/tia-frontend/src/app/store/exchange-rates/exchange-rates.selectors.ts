import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ExchangeRateState } from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.state';

export const selectExchangeRatesSelector =
  createFeatureSelector<ExchangeRateState>('ExchangeRates');

export const selectExchangeRates = createSelector(
  selectExchangeRatesSelector,
  (state) => state.ExchangeRates,
);

export const selectLoading = createSelector(
  selectExchangeRatesSelector,
  (state) => state.loading,
);

export const selectError = createSelector(
  selectExchangeRatesSelector,
  (state) => state.error,
);

export const selectRateByCode = (code: string) =>
  createSelector(
    selectExchangeRates,
    (rates) => rates.find((r) => r.code === code.toUpperCase())?.rate,
  );
