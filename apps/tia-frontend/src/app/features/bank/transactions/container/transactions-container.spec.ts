import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsContainer } from './transactions-container';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import {
  selectItems,
  selectIsLoading,
} from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { Component } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TransactionsTable } from '../components/transactions-table/transactions-table';

@Component({
  selector: 'app-transactions-table',
  template: '',
  standalone: true,
  inputs: ['transactionsData'],
})
class MockTransactionsTable {}

describe('TransactionsContainer', () => {
  let component: TransactionsContainer;
  let fixture: ComponentFixture<TransactionsContainer>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsContainer],
      providers: [provideMockStore()],
    })
      .overrideComponent(TransactionsContainer, {
        remove: { imports: [TransactionsTable] },
        add: { imports: [MockTransactionsTable] },
      })
      .compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TransactionsContainer);
    component = fixture.componentInstance;

    store.overrideSelector(selectItems, []);
    store.overrideSelector(selectIsLoading, false);

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
    const config = component.tableConfig();
    expect(config.rows.length).toBe(1);
  });

  it('should load more when scrolled to bottom AND not loading', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    store.overrideSelector(selectIsLoading, false);
    store.overrideSelector(selectItems, []);
    store.refreshState();
    const mockElement = {
      scrollHeight: 1000,
      scrollTop: 900,
      clientHeight: 100,
    };
    component.onScroll({ target: mockElement } as any);
    expect(dispatchSpy).toHaveBeenCalledWith(TransactionActions.loadMore());
  });

  it('should NOT load more if already loading', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    store.overrideSelector(selectIsLoading, true);
    store.refreshState();
    const mockElement = {
      scrollHeight: 1000,
      scrollTop: 900,
      clientHeight: 100,
    };
    component.onScroll({ target: mockElement } as any);
    expect(dispatchSpy).not.toHaveBeenCalledWith(TransactionActions.loadMore());
  });
});
