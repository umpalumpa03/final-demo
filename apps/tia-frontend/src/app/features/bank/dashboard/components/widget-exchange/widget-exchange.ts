import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { loadExchangeRates } from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.actions';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectExchangeRates } from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.selectors';
import { selectLoading } from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.selectors';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import {
  selectError,
  selectIsLoading,
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { BaseWidget } from '../shared/base-widget.config';

@Component({
  selector: 'app-widget-exchange',
  imports: [AsyncPipe, DecimalPipe, RouteLoader, ErrorStates],
  templateUrl: './widget-exchange.html',
  styleUrl: './widget-exchange.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetExchange extends BaseWidget {
  private readonly store = inject(Store);

  public isLoading$ = this.store.select(selectIsLoading);
  public error$ = this.store.select(selectError);

  public exchangeRates$ = this.store
    .select(selectExchangeRates)
    .pipe(map((rates) => rates.filter((rate) => rate.code !== 'USD')));
  public exchangeRatesLoading$ = this.store.select(selectLoading);

  public retryLoad(): void {
    this.store.dispatch(loadExchangeRates({ baseCurrency: 'USD' }));
  }
}
