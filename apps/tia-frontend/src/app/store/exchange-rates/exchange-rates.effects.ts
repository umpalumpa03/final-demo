import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadExchangeRates,
  loadExchangeRatesFailure, loadExchangeRatesSuccess
} from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.actions';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { ExchangeRatesService } from '@tia/shared/services/exchange-rates/exchange-rates.api.service';
import { ExchangeRateInterface } from 'apps/tia-frontend/src/app/store/exchange-rates/models/exchange-rates.models';
import { Store } from '@ngrx/store';
import { selectExchangeRates, selectLastUpdated } from './exchange-rates.selectors';

@Injectable()
export class ExchangeRatesEffects {
  actions$ = inject(Actions);
  exchangeRatesService = inject(ExchangeRatesService);
  store = inject(Store);

  private readonly CACHE_DURATION_MS = 5 * 60 * 1000;

  loadExchangeRates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadExchangeRates),
      withLatestFrom(
        this.store.select(selectExchangeRates),
        this.store.select(selectLastUpdated)
      ),
      mergeMap(([action, cachedRates, lastUpdated]) => {
        const { baseCurrency = 'USD', forceRefresh = false } = action;

        const now = Date.now();
        const isCacheValid = lastUpdated && (now - lastUpdated) < this.CACHE_DURATION_MS;

        if (!forceRefresh && cachedRates && cachedRates.length > 0 && isCacheValid) {
          return of(loadExchangeRatesSuccess({ ExchangeRates: cachedRates }));
        }

        return this.exchangeRatesService.loadExchangeRates(baseCurrency).pipe(
          map((ExchangeRates: ExchangeRateInterface[]) => loadExchangeRatesSuccess({ ExchangeRates })),
          catchError(() => of(loadExchangeRatesFailure()))
        );
      })
    )
  );
}
