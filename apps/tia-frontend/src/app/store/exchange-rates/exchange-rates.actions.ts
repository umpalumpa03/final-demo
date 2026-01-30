import { createAction, emptyProps, props } from '@ngrx/store';
import { ExchangeRateInterface } from 'apps/tia-frontend/src/app/store/exchange-rates/models/exchange-rates.models';

export const loadExchangeRates = createAction(
  '[EXCHANGE_RATES] Load Exchange Rates',
  props<{ baseCurrency?: string }>()
);

export const loadExchangeRatesSuccess = createAction(
  '[EXCHANGE_RATES] Load Exchange Rates Success',
  props<{ ExchangeRates: ExchangeRateInterface[] }>()
);

export const loadExchangeRatesFailure = createAction(
  '[EXCHANGE_RATES] Load Exchange Rates Failure'
);

export const clearExchangeRates = createAction(
  '[EXCHANGE_RATES] Clear Exchange Rates'
)
