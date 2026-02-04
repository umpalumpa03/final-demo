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
  selectCategoryOptions,
  selectIsLoading,
  selectItems,
  selectTotalTransactions,
} from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { TRANSACTIONS_BASE_CONFIG } from '../config/transaction-data';
import { convertTransactionData } from '../utils/data-converter.utils';
import {
  TableConfig,
  TransactionActionEvent,
} from '@tia/shared/lib/tables/models/table.model';
import { LibraryTitle } from '../../../storybook/shared/library-title/library-title';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { Tables } from '@tia/shared/lib/tables/components/tables';
import { TransactionsFilters } from '../components/transactions-filters/transactions-filters';
import { ITransactionFilter } from '@tia/shared/models/transactions/transactions.models';
import { selectAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';
import { SelectOption } from '@tia/shared/lib/forms/models/input.model';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { AccountsApiService } from '@tia/shared/services/accounts/accounts.api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { ScrollArea } from '@tia/shared/lib/layout/components/scroll-area/container/scroll-area';

@Component({
  selector: 'app-transactions-container',
  imports: [
    ButtonComponent,
    RouteLoader,
    Tables,
    TransactionsFilters,
    BasicCard,
    ScrollArea,
  ],
  templateUrl: './transactions-container.html',
  styleUrl: './transactions-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsContainer implements OnInit {
  private store = inject(Store);
  private readonly accountsService = inject(AccountsApiService);

  private readonly currencyList = toSignal(
    this.accountsService.getCurrencies(),
    { initialValue: [] as string[] },
  );

  public items = this.store.selectSignal(selectItems);
  public readonly isLoading = this.store.selectSignal(selectIsLoading);
  public categoryOptions = this.store.selectSignal(selectCategoryOptions);
  public accounts = this.store.selectSignal(selectAccounts);

  public readonly currencyOptions = computed<SelectOption[]>(() => {
    const currencies = this.currencyList();
    return currencies.map((curr) => ({
      label: curr,
      value: curr,
    }));
  });

  public accountOptions = computed<SelectOption[]>(() => {
    const accountsList = this.accounts();
    if (!accountsList) return [];

    return accountsList.map((acc) => ({
      label: `${acc.friendlyName}`,
      value: acc.iban,
    }));
  });
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
    this.store.dispatch(TransactionActions.loadCategories());

    this.store.dispatch(AccountsActions.loadAccounts());
  }

  public onFiltersChange(filters: Partial<ITransactionFilter>) {
    this.store.dispatch(TransactionActions.updateFilters({ filters }));
  }

  public loadProducts(): void {
    if (this.items().length % 20 === 0 && !this.isLoading()) {
      this.store.dispatch(TransactionActions.loadMore());
    }
  }

  public handleTableAction(event: TransactionActionEvent): void {
    const action = event.action;
    const rowId = event.rowId;

    if (action === 'categorize') {
      console.log('Categorize triggered');
    } else if (action === 'repeat') {
      console.log('Repeat clicked for row:', rowId);
    }
  }
}
