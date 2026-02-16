import { Pipe, PipeTransform } from '@angular/core';

const CURRENCY_SYMBOLS: Record<string, string> = {
  GEL: '₾',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

@Pipe({
  name: 'currencySymbol',
  pure: true,
})
export class CurrencySymbolPipe implements PipeTransform {
  transform(currency: string | null | undefined): string {
    if (!currency) return '';
    return CURRENCY_SYMBOLS[currency] || currency;
  }
}
