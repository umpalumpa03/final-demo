import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectAccounts,
  selectError,
  selectIsLoading
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { selectLoading } from 'apps/tia-frontend/src/app/store/loans/loans.reducer';
import { map } from 'rxjs';
import { BaseWidget } from '../shared/base-widget';
import { ScrollArea } from "@tia/shared/lib/layout/components/scroll-area/container/scroll-area";


@Component({
  selector: 'app-widget-accounts',
  imports: [
    AsyncPipe,
    CurrencyPipe,
    RouteLoader,
    ErrorStates,
    ScrollArea
],
  templateUrl: './widget-accounts.html',
  styleUrl: './widget-accounts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
  export class WidgetAccounts extends BaseWidget{
  private readonly store = inject(Store);

  public retryLoad(): void {
    this.store.dispatch(AccountsActions.loadAccounts());
  }

  public accounts$ = this.store.select(selectAccounts);
  public isLoading$ = this.store.select(selectIsLoading);
  public error$ = this.store.select(selectError);

  public isEmpty$ = this.accounts$.pipe(
    map(accounts => !accounts || accounts.length === 0)
  );

}
