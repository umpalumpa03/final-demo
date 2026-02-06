import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import {
  selectCategoryOptions,
  selectCategoryOptionsForModal,
  selectFilters,
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
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { Tables } from '@tia/shared/lib/tables/components/tables';
import { TransactionsFilters } from '../components/transactions-filters/transactions-filters';
import {
  ITransactionFilter,
  ITransactions,
} from '@tia/shared/models/transactions/transactions.models';
import { selectAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';
import { SelectOption } from '@tia/shared/lib/forms/models/input.model';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { AccountsApiService } from '@tia/shared/services/accounts/accounts.api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { ScrollArea } from '@tia/shared/lib/layout/components/scroll-area/container/scroll-area';
import { CategorizeModal } from '../components/categorize-modal/categorize-modal';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { SimpleAlertType } from '@tia/shared/lib/alerts/shared/models/alert.models';
import { Router } from '@angular/router';
import { SimpleAlerts } from '@tia/shared/lib/alerts/components/simple-alerts/simple-alerts';
import { LibraryTitle } from '../../../storybook/shared/library-title/library-title';
import {
  TranslateModule,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';

@Component({
  selector: 'app-transactions-container',
  imports: [
    ButtonComponent,
    RouteLoader,
    Tables,
    TransactionsFilters,
    BasicCard,
    ScrollArea,
    CategorizeModal,
    UiModal,
    SimpleAlerts,
    LibraryTitle,
    TranslatePipe,
    TranslateModule,
  ],
  templateUrl: './transactions-container.html',
  styleUrl: './transactions-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsContainer implements OnInit {
  private store = inject(Store);
  private readonly accountsService = inject(AccountsApiService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private currentLang = toSignal(this.translate.onLangChange, {
    initialValue: null,
  });

  private readonly currencyList = toSignal(
    this.accountsService.getCurrencies(),
    { initialValue: [] as string[] },
  );

  private readonly currentFilters = this.store.selectSignal(selectFilters);

  public items = this.store.selectSignal(selectItems);
  public readonly isLoading = this.store.selectSignal(selectIsLoading);
  public categoryOptions = this.store.selectSignal(selectCategoryOptions);
  public categoryOptionsForModal = this.store.selectSignal(
    selectCategoryOptionsForModal,
  );
  public accounts = this.store.selectSignal(selectAccounts);
  public isCategorizeModalOpen = signal<boolean>(false);
  public selectedTransaction = signal<ITransactions | null>(null);

  public alertMessage = signal<string | null>(null);
  public alertType = signal<SimpleAlertType>('warning');

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

  private showValidationAlert(type: SimpleAlertType, messageKey: string): void {
    this.alertType.set(type);
    this.alertMessage.set(this.translate.instant(messageKey));

    setTimeout(() => {
      this.alertMessage.set(null);
    }, 3000);
  }

  public readonly totalTransactionsString = computed(() => {
    this.currentLang();

    const total = this.totalTransactions().toString();
    const itemsFetched = this.items().length.toString();

    return this.translate.instant('transactions.table.showing_text', {
      fetched: itemsFetched,
      total: total,
    });
  });

  public tableConfig = computed<TableConfig>(() => {
    this.currentLang();
    return {
      ...TRANSACTIONS_BASE_CONFIG,
      headers: TRANSACTIONS_BASE_CONFIG.headers.map((h) => ({
        ...h,
        title: this.translate.instant(h.title),
      })),
      rows: this.items().map(convertTransactionData),
    };
  });

  public ngOnInit(): void {
    this.store.dispatch(TransactionActions.enter());
    const filters = this.currentFilters();
    const needsReset = filters.pageLimit !== 20 || !!filters.pageCursor;

    if (needsReset) {
      this.store.dispatch(
        TransactionActions.updateFilters({
          filters: {
            pageLimit: 20,
            pageCursor: undefined,
          },
        }),
      );
    } else {
      this.store.dispatch(TransactionActions.loadTransactions({}));
    }
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

  public onTableAction(event: TransactionActionEvent): void {
    if (event.action === 'categorize') {
      const trx = this.items().find((item) => item.id === event.rowId);

      if (trx) {
        this.selectedTransaction.set(trx);
        this.isCategorizeModalOpen.set(true);
      }
    }
    if (event.action === 'repeat') {
      const trx = this.items().find((item) => item.id === event.rowId);
      if (trx) {
        this.onRepeatAction(trx);
      }
    }
  }

  public closeCategorizeModal(): void {
    this.isCategorizeModalOpen.set(false);
    this.selectedTransaction.set(null);
  }

  public onCategorizeSave(event: {
    transactionId: string;
    categoryId: string;
  }): void {
    this.store.dispatch(
      TransactionActions.assignCategory({
        transactionId: event.transactionId,
        categoryId: event.categoryId,
      }),
    );
    this.closeCategorizeModal();
  }

  public onCategoryCreate(name: string): void {
    this.store.dispatch(TransactionActions.createCategory({ name }));
  }

  public onRepeatAction(transaction: ITransactions): void {
    if (transaction.transactionType === 'credit') {
      this.showValidationAlert('warning', 'transactions.alerts.income_warning');
      return;
    }
    if (transaction.transferType === 'Loan') {
      this.showValidationAlert('warning', 'transactions.alerts.loan_warning');
      return;
    }

    this.onRepeatConfirm(transaction);
  }
  public onRepeatConfirm(transaction: ITransactions): void {
    this.store.dispatch(
      TransactionActions.setTransactionToRepeat({ transaction }),
    );

    let route = '/bank/transfers/regular';

    if (transaction.transferType === 'BillPayment') {
      route = '/bank/paybill';
    } else if (transaction.transferType === 'OwnAccount') {
      route = '/bank/transfers/internal';
    } else if (
      transaction.transferType === 'ToSomeoneSameBank' ||
      transaction.transferType === 'ToSomeoneOtherBank'
    ) {
      route = '/bank/transfers/external';
    }

    this.router.navigate([route]);
  }
}
