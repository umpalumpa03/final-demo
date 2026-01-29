import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import {
  selectIsLoading,
  selectItems,
  selectTotalTransactions,
} from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { TRANSACTIONS_BASE_CONFIG } from '../config/transaction-data';
import { convertTransactionData } from '../utils/data-converter.utils';
import { TableConfig } from '@tia/shared/lib/tables/models/table.model';
import { LibraryTitle } from '../../../storybook/shared/library-title/library-title';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { Tables } from '@tia/shared/lib/tables/components/tables';
import { ShowcaseCard } from '../../../storybook/shared/showcase-card/showcase-card';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-transactions-container',
  imports: [LibraryTitle, ButtonComponent, RouteLoader, Tables, ShowcaseCard],
  templateUrl: './transactions-container.html',
  styleUrl: './transactions-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsContainer implements OnInit {
  private store = inject(Store);

  public items = this.store.selectSignal(selectItems);
  public readonly isLoading = this.store.selectSignal(selectIsLoading);
  private readonly totalTransactions = this.store.selectSignal(
    selectTotalTransactions,
  );

  public readonly totalTransactionsString = computed(() => {
    const total = this.totalTransactions().toString();
    const itemsFetched = this.items().length.toString();

    return `Showing ${itemsFetched} of ${total} transactions`;
  });

  public tableConfig = computed<TableConfig>(() => ({
    ...TRANSACTIONS_BASE_CONFIG,
    rows: this.items().map(convertTransactionData),
  }));

  public ngOnInit(): void {
    this.store.dispatch(TransactionActions.loadTransactions());
    this.store.dispatch(TransactionActions.enter());
  }

  public onScroll(event: Event): void {
    const el = event.target as HTMLElement;

    if (!el) return;

    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 20) {
      if (this.items().length % 20 === 0 && !this.isLoading()) {
        this.store.dispatch(TransactionActions.loadMore());
      }
    }
  }

  public onMockFilter(): void {
    const hardcodedFilter = {
      searchCriteria: 'Coffee at Starbucks',
    };

    console.log('Testing Filter with:', hardcodedFilter);

    this.store.dispatch(
      TransactionActions.updateFilters({ filters: hardcodedFilter }),
    );
  }
}
