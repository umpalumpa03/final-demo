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
  selectFilters,
} from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { selectAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.reducer';
import { NO_ERRORS_SCHEMA, EventEmitter, Injectable } from '@angular/core';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { AccountsApiService } from '@tia/shared/services/accounts/accounts.api.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { ITransactions } from '@tia/shared/models/transactions/transactions.models';
class FakeLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of({});
  }
}

describe('TransactionsContainer', () => {
  let component: TransactionsContainer;
  let fixture: ComponentFixture<TransactionsContainer>;
  let store: MockStore;
  let router: Router;

  const mockAccountsService = {
    getCurrencies: vi.fn().mockReturnValue(of(['USD', 'GEL'])),
  };

  const mockRouter = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TransactionsContainer,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader },
        }),
      ],
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
            { selector: selectFilters, value: { pageLimit: 20 } },
          ],
        }),
        { provide: AccountsApiService, useValue: mockAccountsService },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(TransactionsContainer);
    component = fixture.componentInstance;

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should dispatch initialization actions (enter, loadTransactions, loadAccounts) when no reset needed', () => {
    store.overrideSelector(selectFilters, {
      pageLimit: 20,
      pageCursor: undefined,
    });
    const spy = vi.spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith(TransactionActions.enter());
    expect(spy).toHaveBeenCalledWith(TransactionActions.loadTransactions({}));
    expect(spy).toHaveBeenCalledWith(AccountsActions.loadAccounts({}));
    expect(spy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: TransactionActions.updateFilters.type }),
    );
  });

  it('should dispatch updateFilters when reset is needed', () => {
    store.overrideSelector(selectFilters, {
      pageLimit: 50,
      pageCursor: 'cursor',
    });
    const spy = vi.spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith(TransactionActions.enter());
    expect(spy).toHaveBeenCalledWith(
      TransactionActions.updateFilters({
        filters: { pageLimit: 20, pageCursor: undefined },
      }),
    );
    expect(spy).not.toHaveBeenCalledWith(
      TransactionActions.loadTransactions({}),
    );
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
    expect(component.accountOptions()[0]).toEqual({
      label: 'Bank',
      value: 'GE123',
    });
    expect(component.totalTransactionsString()).toBe(
      'transactions.table.showing_text',
    );
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

  it('should call onRepeatAction on table action "repeat"', () => {
    const mockTrx = { id: '123', description: 'Test' } as any;
    store.overrideSelector(selectItems, [mockTrx]);
    store.refreshState();

    const spy = vi.spyOn(component, 'onRepeatAction');
    component.onTableAction({ action: 'repeat', rowId: '123' } as any);

    expect(spy).toHaveBeenCalledWith(mockTrx);
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

  it('should show alert for credit transaction repeat', () => {
    const trx = { transactionType: 'credit' } as ITransactions;
    component.onRepeatAction(trx);

    expect(component.alertType()).toBe('warning');
    expect(component.alertMessage()).toBe('transactions.alerts.income_warning');

    vi.advanceTimersByTime(3000);
    expect(component.alertMessage()).toBeNull();
  });

  it('should show alert for loan transaction repeat', () => {
    const trx = {
      transactionType: 'debit',
      transferType: 'Loan',
    } as ITransactions;
    component.onRepeatAction(trx);

    expect(component.alertType()).toBe('warning');
    expect(component.alertMessage()).toBe('transactions.alerts.loan_warning');
  });

  it('should navigate to paybill for BillPayment repeat', () => {
    const trx = {
      transactionType: 'debit',
      transferType: 'BillPayment',
    } as ITransactions;
    const spy = vi.spyOn(store, 'dispatch');

    component.onRepeatAction(trx);

    expect(spy).toHaveBeenCalledWith(
      TransactionActions.setTransactionToRepeat({ transaction: trx }),
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/paybill']);
  });

  it('should navigate to internal transfers for OwnAccount repeat', () => {
    const trx = {
      transactionType: 'debit',
      transferType: 'OwnAccount',
    } as ITransactions;
    component.onRepeatAction(trx);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/internal',
    ]);
  });

  it('should navigate to external transfers for ToSomeoneSameBank repeat', () => {
    const trx = {
      transactionType: 'debit',
      transferType: 'ToSomeoneSameBank',
    } as ITransactions;
    component.onRepeatAction(trx);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/external',
    ]);
  });

  it('should navigate to regular transfers for unknown type repeat', () => {
    const trx = {
      transactionType: 'debit',
      transferType: 'Unknown',
    } as ITransactions;
    component.onRepeatAction(trx);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/transfers/regular',
    ]);
  });
});
