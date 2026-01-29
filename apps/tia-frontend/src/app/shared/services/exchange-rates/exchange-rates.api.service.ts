import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ExchangeRateInterface, ExchangeRateResponse } from '../../../store/exchange-rates/models/exchange-rates.models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesService {
  private readonly http = inject(HttpClient);

  loadExchangeRates(baseCurrency: string = 'USD'): Observable<ExchangeRateInterface[]> {
    return this.http.get<ExchangeRateResponse>(`${environment.apiUrl}/exchange-rates`, {
      params: { base: baseCurrency }
    }).pipe(
      map(response => response.rates)
    );
  }
}
