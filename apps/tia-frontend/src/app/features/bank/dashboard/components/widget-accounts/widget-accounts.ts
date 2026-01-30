import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectAccounts,
  selectError,
  selectIsLoading
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';


@Component({
  selector: 'app-widget-accounts',
  imports: [
    AsyncPipe,
    CurrencyPipe
  ],
  templateUrl: './widget-accounts.html',
  styleUrl: './widget-accounts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
  export class WidgetAccounts implements OnInit {
  private readonly store = inject(Store);

  public accounts$ = this.store.select(selectAccounts);
  public isLoading$ = this.store.select(selectIsLoading);
  public error$ = this.store.select(selectError);

  ngOnInit() {
    this.store.dispatch(AccountsActions.loadAccounts());
  }
}
