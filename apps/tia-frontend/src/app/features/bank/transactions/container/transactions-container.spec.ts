import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsContainer } from './transactions-container';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import {
  selectItems,
  selectIsLoading,
  selectTotalTransactions,
} from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('TransactionsContainer', () => {
  let component: TransactionsContainer;
  let fixture: ComponentFixture<TransactionsContainer>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsContainer],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TransactionsContainer);
    component = fixture.componentInstance;

    store.overrideSelector(selectItems, []);
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectTotalTransactions, 0);

    fixture.detectChanges();
  });

  it('should dispatch enter action on init', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(TransactionActions.enter());
  });

  it('should compute tableConfig correctly', () => {
    store.overrideSelector(selectItems, [{ id: 1, amount: 500 } as any]);
    store.refreshState();
    fixture.detectChanges();
    expect(component.tableConfig().rows.length).toBe(1);
  });

  it('should load more when scrolled to bottom AND items length is multiple of 20', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    store.overrideSelector(selectItems, new Array(20).fill({ id: 1 }));
    store.refreshState();

    component.onScroll({
      target: { scrollHeight: 1000, scrollTop: 900, clientHeight: 100 },
    } as any);

    expect(dispatchSpy).toHaveBeenCalledWith(TransactionActions.loadMore());
  });

  it('should NOT load more if already loading', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    store.overrideSelector(selectIsLoading, true);
    store.overrideSelector(selectItems, new Array(20).fill({ id: 1 }));
    store.refreshState();

    component.onScroll({
      target: { scrollHeight: 1000, scrollTop: 900, clientHeight: 100 },
    } as any);

    expect(dispatchSpy).not.toHaveBeenCalledWith(TransactionActions.loadMore());
  });

  it('should dispatch updateFilters action when onMockFilter is called', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.onMockFilter();
    expect(dispatchSpy).toHaveBeenCalledWith(
      TransactionActions.updateFilters({
        filters: { searchCriteria: 'Coffee at Starbucks' },
      }),
    );
  });
});
