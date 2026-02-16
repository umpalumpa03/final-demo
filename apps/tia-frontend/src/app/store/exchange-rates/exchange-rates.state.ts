import { ExchangeRateInterface } from './models/exchange-rates.models';

export interface ExchangeRateState {
  ExchangeRates: ExchangeRateInterface[];
  loading: boolean;
  error: boolean;
  lastUpdated: number | null;
}

export const initialState: ExchangeRateState = {
  ExchangeRates: [],
  loading: false,
  error: false,
  lastUpdated: null,
};
