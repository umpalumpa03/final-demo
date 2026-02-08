import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectAccounts,
  selectError,
  selectIsLoading,
} from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import {
  AsyncPipe,
  DecimalPipe,
} from '@angular/common';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { map } from 'rxjs';
import { BaseWidget } from '../shared/base-widget.config';
import { ScrollArea } from '@tia/shared/lib/layout/components/scroll-area/container/scroll-area';
import { CurrencySymbolPipe } from 'apps/tia-frontend/src/app/features/bank/dashboard/pipes/currency-symbols.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-widget-accounts',
  imports: [
    AsyncPipe,
    RouteLoader,
    ErrorStates,
    ScrollArea,
    CurrencySymbolPipe,
    DecimalPipe,
    TranslateModule,
  ],
  templateUrl: './widget-accounts.html',
  styleUrl: './widget-accounts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetAccounts extends BaseWidget {
  private readonly store = inject(Store);

  public retryLoad(): void {
    this.store.dispatch(AccountsActions.loadAccounts({}));
  }

  public accounts$ = this.store.select(selectAccounts);
  public isLoading$ = this.store.select(selectIsLoading);
  public error$ = this.store.select(selectError);

  public isEmpty$ = this.accounts$.pipe(
    map((accounts) => !accounts || accounts.length === 0),
  );
}
