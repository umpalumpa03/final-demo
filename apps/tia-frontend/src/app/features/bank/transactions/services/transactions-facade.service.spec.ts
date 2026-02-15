import { TestBed } from '@angular/core/testing';
import { TransactionsFacadeService } from './transactions-facade.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AccountsApiService } from '@tia/shared/services/accounts/accounts.api.service';
import { of } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  selectItems,
  selectIsLoading,
  selectFilters,
  selectTotalTransactions,
  selectCategoryOptions,
  selectCategoryOptionsForModal,
  selectError,
} from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { selectAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';

describe('TransactionsFacadeService', () => {
  let service: TransactionsFacadeService;
  let store: MockStore;

  const mockAccountsService = {
    getCurrencies: vi.fn().mockReturnValue(of(['USD', 'GEL'])),
  };

  const initialState = {
    items: [],
    isLoading: false,
    filters: { pageLimit: 20 },
    total: 0,
    error: null,
    categories: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionsFacadeService,
        provideMockStore({
          initialState,
          selectors: [
            { selector: selectItems, value: [] },
            { selector: selectIsLoading, value: false },
            { selector: selectFilters, value: { pageLimit: 20 } },
            { selector: selectTotalTransactions, value: 0 },
            { selector: selectCategoryOptions, value: [] },
            { selector: selectCategoryOptionsForModal, value: [] },
            { selector: selectAccounts, value: [] },
            { selector: selectError, value: null },
          ],
        }),
        { provide: AccountsApiService, useValue: mockAccountsService },
      ],
    });

    service = TestBed.inject(TransactionsFacadeService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch updateFilters', () => {
    const spy = vi.spyOn(store, 'dispatch');
    const filters = { searchCriteria: 'test' } as any;

    service.updateFilters(filters);

    expect(spy).toHaveBeenCalledWith(
      TransactionActions.updateFilters({ filters }),
    );
  });

  it('should dispatch assignCategory', () => {
    const spy = vi.spyOn(store, 'dispatch');

    service.assignCategory('1', 'cat-1');

    expect(spy).toHaveBeenCalledWith(
      TransactionActions.assignCategory({
        transactionId: '1',
        categoryId: 'cat-1',
      }),
    );
  });

  it('should dispatch createCategory', () => {
    const spy = vi.spyOn(store, 'dispatch');

    service.createCategory('New Cat');

    expect(spy).toHaveBeenCalledWith(
      TransactionActions.createCategory({ name: 'New Cat' }),
    );
  });

  it('should dispatch setTransactionToRepeat', () => {
    const spy = vi.spyOn(store, 'dispatch');
    const mockTrx: any = { id: '123' };

    service.setTransactionToRepeat(mockTrx);

    expect(spy).toHaveBeenCalledWith(
      TransactionActions.setTransactionToRepeat({ transaction: mockTrx }),
    );
  });

  describe('initializePage', () => {
    it('should dispatch updateFilters when pure filters change', () => {
      const spy = vi.spyOn(store, 'dispatch');
      const incomingFilters = { searchCriteria: 'new' };

      service.initializePage(incomingFilters);

      expect(spy).toHaveBeenCalledWith(TransactionActions.enter());
      expect(spy).toHaveBeenCalledWith(AccountsActions.loadAccounts({}));
      expect(spy).toHaveBeenCalledWith(
        TransactionActions.updateFilters({
          filters: { ...incomingFilters, pageLimit: 20 },
        }),
      );
    });

    it('should dispatch loadTransactions when pure filters are identical', () => {
      const spy = vi.spyOn(store, 'dispatch');

      service.initializePage();

      expect(spy).toHaveBeenCalledWith(TransactionActions.loadTransactions({}));
    });
  });

  it('should dispatch loadMore if conditions are met', () => {
    store.overrideSelector(selectItems, new Array(20).fill({ id: 1 }));
    store.overrideSelector(selectIsLoading, false);
    store.refreshState();

    const spy = vi.spyOn(store, 'dispatch');

    service.loadMore();

    expect(spy).toHaveBeenCalledWith(TransactionActions.loadMore());
  });

  it('should dispatch loadTransactions with forceRefresh on retryLoad', () => {
    const spy = vi.spyOn(store, 'dispatch');

    service.retryLoad();

    expect(spy).toHaveBeenCalledWith(
      TransactionActions.loadTransactions({ forceRefresh: true }),
    );
  });
});