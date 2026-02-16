import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { WidgetTransactions } from '../../widget-transactions/widget-transactions';
import {
  selectItems,
  selectIsLoading,
  selectError,
  selectNextCursor,
} from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import { ITransactions } from 'apps/tia-frontend/src/app/shared/models/transactions/transactions.models';

const mockTransactions: ITransactions[] = [
  {
    id: 'tx-1',
    userId: 'user-1',
    amount: 99.99,
    transactionType: 'debit',
    transferType: 'BillPayment',
    currency: 'GEL',
    description: 'Coffee Shop',
    debitAccountNumber: 'GE00XX0000000000000001',
    creditAccountNumber: null,
    category: 'Food',
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
  },
  {
    id: 'tx-2',
    userId: 'user-1',
    amount: 500,
    transactionType: 'credit',
    transferType: 'ToSomeoneSameBank',
    currency: 'GEL',
    description: 'Salary',
    debitAccountNumber: '',
    creditAccountNumber: 'GE00XX0000000000000001',
    category: 'Income',
    createdAt: '2024-01-14T09:00:00Z',
    updatedAt: '2024-01-14T09:00:00Z',
  },
];

describe('WidgetTransactions Integration', () => {
  let component: WidgetTransactions;
  let fixture: ComponentFixture<WidgetTransactions>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetTransactions, TranslateModule.forRoot()],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectItems, []);
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectError, null);
    store.overrideSelector(selectNextCursor, null);

    fixture = TestBed.createComponent(WidgetTransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadTransactions on init', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      TransactionActions.loadTransactions({ forceRefresh: false }),
    );
  });

  it('should render transaction list when store has transactions', () => {
    store.overrideSelector(selectItems, mockTransactions);
    store.refreshState();
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('.transaction-card'));
    expect(cards.length).toBe(2);

    expect(fixture.nativeElement.textContent).toContain('Coffee Shop');
    expect(fixture.nativeElement.textContent).toContain('Salary');
    expect(fixture.nativeElement.textContent).toContain('99.99');
    expect(fixture.nativeElement.textContent).toContain('500');
    expect(fixture.nativeElement.textContent).toContain('Food');
    expect(fixture.nativeElement.textContent).toContain('Income');
  });

  it('should show error state and retry dispatches loadTransactions with forceRefresh', () => {
    store.overrideSelector(selectError, 'Something went wrong');
    store.overrideSelector(selectItems, []);
    store.refreshState();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-error-states'))).toBeTruthy();

    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.retryLoad();
    expect(dispatchSpy).toHaveBeenCalledWith(
      TransactionActions.loadTransactions({ forceRefresh: true }),
    );
  });

  it('should show empty state when no transactions and not loading', () => {
    store.overrideSelector(selectItems, []);
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectError, null);
    store.refreshState();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'dashboard.widgets.transactions.empty.header',
    );
  });

  it('should show loader when loading and empty', () => {
    store.overrideSelector(selectItems, []);
    store.overrideSelector(selectIsLoading, true);
    store.overrideSelector(selectError, null);
    store.refreshState();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-route-loader'))).toBeTruthy();
  });

  it('should dispatch loadMore when onScrollBottom is called', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.onScrollBottom();
    expect(dispatchSpy).toHaveBeenCalledWith(TransactionActions.loadMore());
  });
});
