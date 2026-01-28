import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadExchangeRates,
  loadExchangeRatesFailure, loadExchangeRatesSuccess
} from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ExchangeRatesService } from '@tia/shared/services/exchange-rates.api.service';
import { ExchangeRateInterface } from 'apps/tia-frontend/src/app/store/exchange-rates/models/exchange-rates.models';

@Injectable()
export class ExchangeRatesEffects {
  actions$ = inject(Actions);
  exchangeRatesService = inject(ExchangeRatesService);

  loadExchangeRates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadExchangeRates),
      mergeMap(({ baseCurrency = 'USD' }) =>
        this.exchangeRatesService.loadExchangeRates(baseCurrency).pipe(
          map((ExchangeRates: ExchangeRateInterface[]) => loadExchangeRatesSuccess({ ExchangeRates })),
          catchError(() => of(loadExchangeRatesFailure()))
        )))
  );
}
