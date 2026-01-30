import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { loadExchangeRates } from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.actions';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import { selectExchangeRates } from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.selectors';
import { selectLoading } from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.selectors';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { selectError, selectIsLoading } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';

@Component({
  selector: 'app-widget-exchange',
  imports: [
    AsyncPipe,
    DecimalPipe
  ],
  templateUrl: './widget-exchange.html',
  styleUrl: './widget-exchange.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetExchange {
  private readonly store = inject(Store);

  public isLoading$ = this.store.select(selectIsLoading);
  public error$ = this.store.select(selectError);


  public exchangeRates$ = this.store.select(selectExchangeRates).pipe(
    map(rates => rates.filter(rate => rate.code !== 'USD'))
  );
  public exchangeRatesLoading$ = this.store.select(selectLoading);

  ngOnInit() {
    this.store.dispatch(loadExchangeRates({ baseCurrency: 'USD' }));
  }
}
