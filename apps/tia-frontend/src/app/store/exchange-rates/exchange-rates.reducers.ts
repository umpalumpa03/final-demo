import { createReducer, on } from '@ngrx/store';
import {
  loadExchangeRates, loadExchangeRatesFailure,
  loadExchangeRatesSuccess
} from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.actions';
import { initialState } from './exchange-rates.state'

export const ExchangeRateReducer = createReducer(
  initialState,
  on(loadExchangeRates, state => ({
    ...state,
    loading: true,
    error: false,
  })),

  on(loadExchangeRatesSuccess, (state, {ExchangeRates}) => ({
    ...state,
    ExchangeRates,
    loading: false,
    error: false,
  })),

  on(loadExchangeRatesFailure, state => ({
    ...state,
    loading: false,
    error: true,
  }))
)

