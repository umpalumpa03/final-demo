import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { loadExchangeRates } from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.actions';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectExchangeRates, selectLoading, selectError } from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.selectors';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { BaseWidget } from '../shared/base-widget.config';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollArea } from '@tia/shared/lib/layout/components/scroll-area/container/scroll-area';

@Component({
  selector: 'app-widget-exchange',
  imports: [
    AsyncPipe,
    DecimalPipe,
    RouteLoader,
    ErrorStates,
    TranslateModule,
    ScrollArea,
  ],
  templateUrl: './widget-exchange.html',
  styleUrl: './widget-exchange.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetExchange extends BaseWidget {
  private readonly store = inject(Store);

  public isLoading$ = this.store.select(selectLoading);
  public error$ = this.store.select(selectError);

  public exchangeRates$ = this.store
    .select(selectExchangeRates)
    .pipe(map((rates) => rates.filter((rate) => rate.code !== 'USD')));

  public retryLoad(): void {
    this.store.dispatch(loadExchangeRates({ baseCurrency: 'USD', forceRefresh: true }));
  }
}
