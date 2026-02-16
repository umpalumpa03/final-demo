import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import {
  selectCategoryOptions,
  selectCategoryOptionsForModal,
  selectError,
  selectFilters,
  selectIsLoading,
  selectItems,
  selectTotalTransactions,
} from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { selectAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';
import { AccountsApiService } from '@tia/shared/services/accounts/accounts.api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ITransactionFilter,
  ITransactions,
} from '@tia/shared/models/transactions/transactions.models';

@Injectable()
export class TransactionsFacadeService {
  private readonly store = inject(Store);
  private readonly accountsService = inject(AccountsApiService);

  public readonly items = this.store.selectSignal(selectItems);
  public readonly isLoading = this.store.selectSignal(selectIsLoading);
  public readonly filters = this.store.selectSignal(selectFilters);
  public readonly totalTransactions = this.store.selectSignal(
    selectTotalTransactions,
  );
  public readonly transactionError = this.store.selectSignal(selectError);

  public readonly categoryOptions = this.store.selectSignal(
    selectCategoryOptions,
  );
  public readonly categoryOptionsForModal = this.store.selectSignal(
    selectCategoryOptionsForModal,
  );
  public readonly accounts = this.store.selectSignal(selectAccounts);

  public readonly currencyList = toSignal(
    this.accountsService.getCurrencies(),
    {
      initialValue: [] as string[],
    },
  );

  private getCleanFilters(
    filters: Partial<ITransactionFilter>,
  ): Partial<ITransactionFilter> {
    const { pageLimit, pageCursor, ...pureFilters } = filters;

    return Object.fromEntries(
      Object.entries(pureFilters)
        .filter(
          ([_, value]) => value !== undefined && value !== null && value !== '',
        )
        .map(([key, value]) => [key, value?.toString()]),
    );
  }

  public initializePage(initialFilters?: Partial<ITransactionFilter>): void {
    this.store.dispatch(TransactionActions.enter());
    this.store.dispatch(AccountsActions.loadAccounts({}));

    const current = this.getCleanFilters(this.filters());
    const incoming = this.getCleanFilters(initialFilters ?? {});

    const isDifferent = JSON.stringify(current) !== JSON.stringify(incoming);

    if (isDifferent) {
      this.store.dispatch(
        TransactionActions.updateFilters({
          filters: { ...initialFilters, pageLimit: 20 },
        }),
      );
    } else {
      this.store.dispatch(TransactionActions.loadTransactions({}));
    }
  }
  public updateFilters(filters: ITransactionFilter): void {
    this.store.dispatch(TransactionActions.updateFilters({ filters }));
  }

  public loadMore(): void {
    const itemsLength = this.items().length;
    if (itemsLength > 0 && !this.isLoading()) {
      this.store.dispatch(TransactionActions.loadMore());
    }
  }

  public assignCategory(transactionId: string, categoryId: string): void {
    this.store.dispatch(
      TransactionActions.assignCategory({ transactionId, categoryId }),
    );
  }

  public createCategory(name: string): void {
    this.store.dispatch(TransactionActions.createCategory({ name }));
  }

  public setTransactionToRepeat(transaction: ITransactions): void {
    this.store.dispatch(
      TransactionActions.setTransactionToRepeat({ transaction }),
    );
  }

  public retryLoad(): void {
    this.store.dispatch(
      TransactionActions.loadTransactions({ forceRefresh: true }),
    );
  }
}
