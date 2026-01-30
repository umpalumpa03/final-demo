import { ExchangeRateInterface } from './models/exchange-rates.models';

export interface ExchangeRateState {
  ExchangeRates: ExchangeRateInterface[];
  loading: boolean;
  error: boolean;
}

export const initialState: ExchangeRateState = {
  ExchangeRates: [],
  loading: false,
  error: false,
};
