export interface ExchangeRateResponse {
  success: boolean;
  timestamp: string;
  base: string;
  rates: ExchangeRateInterface[];
}

export interface ExchangeRateInterface {
  code: string;
  rate: number;
  previousRate: number;
  changePercent: number;
  isPositive: boolean;
  name: string;
  symbol: string;
  flagUrl: string;
  lastUpdated: string;
}

