import { createAction, props } from '@ngrx/store';
import { ExchangeRateInterface } from 'apps/tia-frontend/src/app/store/exchange-rates/models/exchange-rates.models';

export const loadExchangeRates = createAction('[EXCHANGE_RATES] Load Exchange Rates');

export const loadExchangeRatesSuccess = createAction('[EXCHANGE_RATES] Load Exchange Rates Success', props<{ ExchangeRates: ExchangeRateInterface[] }>());
export const loadExchangeRatesFailure = createAction('[EXCHANGE_RATES] Load Exchange Rates Failure');
