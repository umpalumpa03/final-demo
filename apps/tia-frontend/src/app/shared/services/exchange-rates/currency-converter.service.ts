import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectExchangeRates } from '../../../store/exchange-rates/exchange-rates.selectors';

@Injectable({ providedIn: 'root' })
export class CurrencyConverterService {
  private store = inject(Store);

  private rates = this.store.selectSignal(selectExchangeRates);

  convertToGEL(amount: number, fromCurrency: string): number {
    const currency = fromCurrency.toUpperCase();

    if (currency === 'GEL') return amount;

    const targetRateObj = this.rates().find((r) => r.code === currency);

    if (!targetRateObj) {
      // console.warn(`Rate for ${currency} not found in store.`);
      return 0;
    }

    return amount * targetRateObj.rate;
  }
}
