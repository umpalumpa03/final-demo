import { inject, Injectable } from '@angular/core';
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
  private store = inject(Store);
  private accountsService = inject(AccountsApiService);

  public items = this.store.selectSignal(selectItems);
  public isLoading = this.store.selectSignal(selectIsLoading);
  public filters = this.store.selectSignal(selectFilters);
  public totalTransactions = this.store.selectSignal(selectTotalTransactions);

  public categoryOptions = this.store.selectSignal(selectCategoryOptions);
  public categoryOptionsForModal = this.store.selectSignal(
    selectCategoryOptionsForModal,
  );
  public accounts = this.store.selectSignal(selectAccounts);

  public currencyList = toSignal(this.accountsService.getCurrencies(), {
    initialValue: [] as string[],
  });

  public initializePage(): void {
    this.store.dispatch(TransactionActions.enter());
    this.store.dispatch(AccountsActions.loadAccounts({}));

    const currentFilters = this.filters();
    const needsReset =
      currentFilters.pageLimit !== 20 || !!currentFilters.pageCursor;

    if (needsReset) {
      this.store.dispatch(
        TransactionActions.updateFilters({
          filters: { pageLimit: 20, pageCursor: undefined },
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
    if (itemsLength > 0 && itemsLength % 20 === 0 && !this.isLoading()) {
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
}
