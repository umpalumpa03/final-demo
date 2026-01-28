import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExchangeRateInterface } from '../../store/exchange-rates/models/exchange-rates.models'
import { environment } from '../../../environments/environment'

@Injectable()

export class ExchangeRatesService {
  private readonly http = inject(HttpClient);

  loadExchangeRates(): Observable<ExchangeRateInterface[]> {
    return this.http.get<ExchangeRateInterface[]>(`${environment.apiUrl}/exchange-rates`);
  }
}
