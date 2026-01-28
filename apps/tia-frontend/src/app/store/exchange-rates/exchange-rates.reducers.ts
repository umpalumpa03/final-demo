import { ExchangeRateInterface } from 'apps/tia-frontend/src/app/store/exchange-rates/models/exchange-rates.models';
import { createReducer, on } from '@ngrx/store';
import {
  loadExchangeRates, loadExchangeRatesFailure,
  loadExchangeRatesSuccess
} from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.actions';

export interface ExchangeRateState {
  ExchangeRates: ExchangeRateInterface[];
  loading: boolean;
  error: boolean;
}

export const initialState: ExchangeRateState = {
  ExchangeRates: [],
  loading: false,
  error: false,
}

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

