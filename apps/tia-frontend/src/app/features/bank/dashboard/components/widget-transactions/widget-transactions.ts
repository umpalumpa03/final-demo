import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import {
  selectItems,
  selectIsLoading,
  selectError,
} from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { map } from 'rxjs';
import { ScrollArea } from '@tia/shared/lib/layout/components/scroll-area/container/scroll-area';
import { BaseWidget } from '../shared/base-widget.config';

@Component({
  selector: 'app-widget-transactions',
  imports: [AsyncPipe, DatePipe, RouteLoader, ErrorStates, ScrollArea, CurrencyPipe],
  templateUrl: './widget-transactions.html',
  styleUrl: './widget-transactions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetTransactions extends BaseWidget {
  private readonly store = inject(Store);

  public isLoading$ = this.store.select(selectIsLoading);
  public error$ = this.store.select(selectError);

  public transactions$ = this.store.select(selectItems);

  public retryLoad(): void {
    this.store.dispatch(
      TransactionActions.updateFilters({
        filters: { pageLimit: 10 },
      }),
    );
  }

  public isEmpty$ = this.transactions$.pipe(
    map((transactions) => !transactions || transactions.length === 0),
  );
}
