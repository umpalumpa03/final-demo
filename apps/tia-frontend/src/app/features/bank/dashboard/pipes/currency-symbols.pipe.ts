import { Pipe, PipeTransform } from '@angular/core';

const CURRENCY_SYMBOLS: Record<string, string> = {
  GEL: '₾',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

@Pipe({
  name: 'currencySymbol',
  standalone: true,
})
export class CurrencySymbolPipe implements PipeTransform {
  transform(currency: string): string {
    return CURRENCY_SYMBOLS[currency] || currency;
  }
}
