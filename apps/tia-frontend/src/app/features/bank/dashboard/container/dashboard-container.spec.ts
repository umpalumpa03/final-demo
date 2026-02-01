import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { DashboardContainer } from './dashboard-container';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import {
  clearExchangeRates,
  loadExchangeRates
} from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.actions';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';

describe('DashboardContainer', () => {
  let component: DashboardContainer;
  let mockStore: any;
  let mockRouter: any;

  beforeEach(() => {
    // Create mocks
    mockStore = {
      dispatch: vi.fn()
    };

    mockRouter = {
      navigate: vi.fn()
    };

    // Configure TestBed
    TestBed.configureTestingModule({
      providers: [
        DashboardContainer,
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter }
      ]
    });

    component = TestBed.inject(DashboardContainer);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize myItems signal with widgetItems', () => {
    expect(component['myItems']()).toBeDefined();
    expect(Array.isArray(component['myItems']())).toBe(true);
  });

  it('should dispatch actions on ngOnInit', () => {
    component.ngOnInit();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      TransactionActions.updateFilters({
        filters: { pageLimit: 10 }
      })
    );

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      loadExchangeRates({ baseCurrency: 'USD' })
    );

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      AccountsActions.loadAccounts()
    );

    expect(mockStore.dispatch).toHaveBeenCalledTimes(3);
  });

  it('should update items when onItemsChange is called', () => {
    const newItems = [
      { id: '1', title: 'Test Widget', subtitle: 'Test Subtitle', type: 'test' as any }
    ];

    component.onItemsChange(newItems);

    expect(component['myItems']()).toEqual(newItems);
  });

  it('should log new order when onContainerOrderChange is called', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const ids = ['1', '2', '3'];

    component.onContainerOrderChange(ids);

    expect(consoleSpy).toHaveBeenCalledWith('New Order saved to DB:', ids);
  });

  it('should toggle visibility of a widget', () => {
    // Set up initial items
    component['myItems'].set([
      { id: '1', title: 'Widget 1', subtitle: 'Subtitle 1', type: 'transactions' as any, isHidden: false },
      { id: '2', title: 'Widget 2', subtitle: 'Subtitle 2', type: 'accounts' as any, isHidden: false }
    ]);

    component.onToggleVisibility(false, '1');

    const items = component['myItems']();
    expect(items[0].isHidden).toBe(true);
    expect(items[1].isHidden).toBe(false);
  });

  it('should keep other items unchanged when toggling visibility', () => {
    component['myItems'].set([
      { id: '1', title: 'Widget 1', subtitle: 'Subtitle 1', type: 'transactions' as any },
      { id: '2', title: 'Widget 2', subtitle: 'Subtitle 2', type: 'accounts' as any }
    ]);

    component.onToggleVisibility(true, '1');

    const items = component['myItems']();
    expect(items[1].id).toBe('2');
  });

  it('should dispatch exchange rate actions on widget refresh', () => {
    const mockWidget = { id: '1', title: 'Test', subtitle: 'Test Subtitle', type: 'exchange' as any };

    component.onWidgetRefresh(mockWidget);

    expect(mockStore.dispatch).toHaveBeenCalledWith(clearExchangeRates());
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      loadExchangeRates({ baseCurrency: 'USD' })
    );
  });

  it('should navigate to accounts page on widget add', () => {
    const mockWidget = { id: '1', title: 'Test', subtitle: 'Test Subtitle', type: 'accounts' as any };

    component.onWidgetAdd(mockWidget);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/products/accounts']);
  });

  it('should dispatch pagination change action', () => {
    const pageLimit = 20;

    component.onPaginationChange(pageLimit);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      TransactionActions.updateFilters({
        filters: { pageLimit: 20 }
      })
    );
  });

  it('should compute dynamic colspans correctly', () => {
    component['myItems'].set([
      { id: '1', title: 'Widget 1', subtitle: 'Subtitle 1', type: 'transactions' as any },
      { id: '2', title: 'Widget 2', subtitle: 'Subtitle 2', type: 'accounts' as any },
      { id: '3', title: 'Widget 3', subtitle: 'Subtitle 3', type: 'exchange' as any }
    ]);

    const colspans = component['dynamicColspans']();

    expect(colspans[0]).toBe(2);
    expect(colspans[1]).toBe(1);
    expect(colspans[2]).toBe(1);
  });

  it('should handle empty items array', () => {
    component['myItems'].set([]);

    const colspans = component['dynamicColspans']();

    expect(colspans).toEqual([]);
  });
});
