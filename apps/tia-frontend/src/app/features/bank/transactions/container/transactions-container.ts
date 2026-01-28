import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import {
  selectIsLoading,
  selectItems,
} from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { TransactionsTable } from '../components/transactions-table/transactions-table';
import { TRANSACTIONS_BASE_CONFIG } from '../config/transaction-data';
import { convertTransactionData } from '../utils/data-converter.utils';
import { TableConfig } from '@tia/shared/lib/tables/models/table.model';
import { LibraryTitle } from '../../../storybook/shared/library-title/library-title';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { FlexLayout } from '@tia/shared/lib/layout/components/flex-layout/flex-layout';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';

@Component({
  selector: 'app-transactions-container',
  imports: [
    TransactionsTable,
    LibraryTitle,
    ButtonComponent,
    FlexLayout,
    RouteLoader,
  ],
  templateUrl: './transactions-container.html',
  styleUrl: './transactions-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsContainer implements OnInit {
  private store = inject(Store);

  public items = this.store.selectSignal(selectItems);
  public readonly isLoading = this.store.selectSignal(selectIsLoading);

  public tableConfig = computed<TableConfig>(() => ({
    ...TRANSACTIONS_BASE_CONFIG,
    rows: this.items().map(convertTransactionData),
  }));

  public ngOnInit(): void {
    this.store.dispatch(TransactionActions.enter());
  }

  public onScroll(event: Event): void {
    const el = event.target as HTMLElement;

    if (!el) return;

    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 20) {
      if (this.items().length % 10 === 0) {
        this.store.dispatch(TransactionActions.loadMore());
      }
    }
  }
}
