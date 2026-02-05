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
  selectCategoryOptionsForModal,
} from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { selectAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AccountsApiService } from '@tia/shared/services/accounts/accounts.api.service';
import { of } from 'rxjs';

describe('TransactionsContainer', () => {
  let component: TransactionsContainer;
  let fixture: ComponentFixture<TransactionsContainer>;
  let store: MockStore;

  const mockAccountsService = {
    getCurrencies: vi.fn().mockReturnValue(of(['USD', 'GEL'])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsContainer],
      providers: [
        provideMockStore({
          initialState: {},
          selectors: [
            { selector: selectItems, value: [] },
            { selector: selectIsLoading, value: false },
            { selector: selectTotalTransactions, value: 0 },
            { selector: selectCategoryOptions, value: [] },
            { selector: selectCategoryOptionsForModal, value: [] },
            { selector: selectAccounts, value: [] },
          ],
        }),
        { provide: AccountsApiService, useValue: mockAccountsService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TransactionsContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch initialization actions on ngOnInit', () => {
    const spy = vi.spyOn(store, 'dispatch');
    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith(TransactionActions.enter());
    expect(spy).toHaveBeenCalledWith(TransactionActions.loadTransactions());
    expect(spy).toHaveBeenCalledWith(AccountsActions.loadAccounts());
    expect(spy).toHaveBeenCalledWith(TransactionActions.loadCategories());
  });

  it('should correctly derive view data from store', () => {
    const mockItems = [
      {
        id: '1',
        amount: 500,
        currency: 'GEL',
        createdAt: '2026-01-01',
        description: 'Test',
        category: { name: 'Food' },
      } as any,
    ];
    const mockAccounts = [{ friendlyName: 'Bank', iban: 'GE123' } as any];

    store.overrideSelector(selectItems, mockItems);
    store.overrideSelector(selectAccounts, mockAccounts);
    store.overrideSelector(selectTotalTransactions, 100);

    store.refreshState();
    fixture.detectChanges();

    expect(component.tableConfig().rows.length).toBe(1);
    expect(component.accountOptions().length).toBeGreaterThan(0);
    expect(component.accountOptions()[0]).toEqual({
      label: 'Bank',
      value: 'GE123',
    });
    expect(component.totalTransactionsString()).toContain('1 of 100');
  });

  it('should dispatch loadMore on scroll bottom', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const mockItems = new Array(20).fill({
      id: '1',
      amount: 100,
      currency: 'USD',
    });
    store.overrideSelector(selectItems, mockItems as any);
    store.overrideSelector(selectIsLoading, false);
    store.refreshState();
    fixture.detectChanges();

    component.loadProducts();
    expect(dispatchSpy).toHaveBeenCalledWith(TransactionActions.loadMore());
  });

  it('should NOT dispatch loadMore if loading or not enough items', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    store.overrideSelector(selectIsLoading, true);
    store.refreshState();
    component.loadProducts();
    expect(dispatchSpy).not.toHaveBeenCalled();

    store.overrideSelector(selectIsLoading, false);
    const mockItems = new Array(5).fill({
      id: '1',
      amount: 100,
      currency: 'USD',
    });
    store.overrideSelector(selectItems, mockItems as any);
    store.refreshState();

    dispatchSpy.mockClear();
    component.loadProducts();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should open modal on table action "categorize"', () => {
    const mockTrx = { id: '123', description: 'Test' } as any;
    store.overrideSelector(selectItems, [mockTrx]);
    store.refreshState();

    component.onTableAction({ action: 'categorize', rowId: '123' } as any);

    expect(component.isCategorizeModalOpen()).toBe(true);
    expect(component.selectedTransaction()).toEqual(mockTrx);
  });

  it('should dispatch assignCategory and close modal on save', () => {
    const spy = vi.spyOn(store, 'dispatch');
    component.isCategorizeModalOpen.set(true);

    const event = { transactionId: 'tx-1', categoryId: 'cat-1' };
    component.onCategorizeSave(event);

    expect(spy).toHaveBeenCalledWith(TransactionActions.assignCategory(event));
    expect(component.isCategorizeModalOpen()).toBe(false);
  });

  it('should dispatch createCategory on category create', () => {
    const spy = vi.spyOn(store, 'dispatch');
    component.onCategoryCreate('New Cat');
    expect(spy).toHaveBeenCalledWith(
      TransactionActions.createCategory({ name: 'New Cat' }),
    );
  });
});
