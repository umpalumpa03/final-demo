import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectAccounts,
  selectError,
  selectIsLoading
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { AsyncPipe, DatePipe } from '@angular/common';
import { selectItems } from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-dashboard-container',
  imports: [
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './dashboard-container.html',
  styleUrl: './dashboard-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardContainer implements OnInit {
  private readonly store = inject(Store);

  public accounts$ = this.store.select(selectAccounts);
  public isLoading$ = this.store.select(selectIsLoading);
  public error$ = this.store.select(selectError);

  public transactions$ = this.store.select(selectItems);

  ngOnInit() {

    this.store.dispatch(AccountsActions.loadAccounts());
    this.store.dispatch(TransactionActions.loadTransactions());

  }
}
