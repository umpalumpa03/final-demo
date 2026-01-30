import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { selectItems } from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { Store } from '@ngrx/store';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import { AsyncPipe, DatePipe } from '@angular/common';
import { selectError, selectIsLoading } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { loadExchangeRates } from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.actions';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { map } from 'rxjs';

@Component({
  selector: 'app-widget-transactions',
  imports: [
    AsyncPipe,
    DatePipe,
    RouteLoader,
    ErrorStates
  ],
  templateUrl: './widget-transactions.html',
  styleUrl: './widget-transactions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetTransactions {
  private readonly store = inject(Store);

  public isLoading$ = this.store.select(selectIsLoading);
  public error$ = this.store.select(selectError);

  public transactions$ = this.store.select(selectItems);

  public retryLoad(): void {
    this.store.dispatch(TransactionActions.updateFilters({
      filters: { pageLimit: 10 }
    }));
  }

  public isEmpty$ = this.transactions$.pipe(
    map(transactions => !transactions || transactions.length === 0)
  );
}
