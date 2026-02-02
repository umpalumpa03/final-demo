import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsContainer } from './transactions-container';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import {
  selectItems,
  selectIsLoading,
  selectTotalTransactions,
  selectCategoryOptions,
} from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { selectAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('TransactionsContainer', () => {
  let component: TransactionsContainer;
  let fixture: ComponentFixture<TransactionsContainer>;
  let store: MockStore;

  const mockScrollEvent = (scrollTop: number, loading = false) =>
    ({
      target: { scrollHeight: 1000, scrollTop, clientHeight: 100 },
    }) as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsContainer],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectItems, value: [] },
            { selector: selectIsLoading, value: false },
            { selector: selectTotalTransactions, value: 0 },
            { selector: selectCategoryOptions, value: [] },
            { selector: selectAccounts, value: [] },
          ],
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TransactionsContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch initialization actions', () => {
    const spy = vi.spyOn(store, 'dispatch');
    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith(TransactionActions.enter());
    expect(spy).toHaveBeenCalledWith(TransactionActions.loadTransactions());
    expect(spy).toHaveBeenCalledWith(AccountsActions.loadAccounts());
  });

  it('should correctly derive view data (Table, Accounts, Strings) from store', () => {
    const mockItems = [{ id: '1', amount: 500, currency: 'GEL' } as any];
    const mockAccounts = [{ friendlyName: 'Bank', iban: 'GE123' } as any];

    store.setState({});
    selectItems.setResult(mockItems);
    selectAccounts.setResult(mockAccounts);
    selectTotalTransactions.setResult(100);
    store.refreshState();
    fixture.detectChanges();

    expect(component.tableConfig().rows.length).toBe(1);
    expect(component.accountOptions()[0]).toEqual({
      label: 'Bank',
      value: 'GE123',
    });
    expect(component.totalTransactionsString()).toContain('1 of 100');
  });

  it('should handle "Load More" logic on scroll', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    selectItems.setResult(
      new Array(20).fill({ id: '1', amount: 100, currency: 'GEL' }),
    );

    store.refreshState();
    fixture.detectChanges();

    component.onScroll(mockScrollEvent(900));
    expect(dispatchSpy).toHaveBeenCalledWith(TransactionActions.loadMore());

    dispatchSpy.mockClear();

    selectIsLoading.setResult(true);
    store.refreshState();
    component.onScroll(mockScrollEvent(900));
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch updateFilters action', () => {
    const spy = vi.spyOn(store, 'dispatch');
    component.onFiltersChange({ searchCriteria: 'Test' });
    expect(spy).toHaveBeenCalledWith(
      TransactionActions.updateFilters({ filters: { searchCriteria: 'Test' } }),
    );
  });
});
