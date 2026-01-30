import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { selectItems } from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { Store } from '@ngrx/store';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import { AsyncPipe, DatePipe } from '@angular/common';
import { selectError, selectIsLoading } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';

@Component({
  selector: 'app-widget-transactions',
  imports: [
    AsyncPipe,
    DatePipe
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

  ngOnInit() {
    this.store.dispatch(TransactionActions.loadTransactions());
  }
}
