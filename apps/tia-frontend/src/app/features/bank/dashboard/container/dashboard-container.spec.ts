import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { DashboardContainer } from './dashboard-container';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';
import {
  clearExchangeRates,
  loadExchangeRates,
} from 'apps/tia-frontend/src/app/store/exchange-rates/exchange-rates.actions';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { BreakpointService } from 'apps/tia-frontend/src/app/core/services/breakpoints/breakpoint.service';
import { UserInfoActions } from 'apps/tia-frontend/src/app/store/user-info/user-info.actions';
import { BirthdayLogicService } from 'apps/tia-frontend/src/app/features/birthday/services/birthday-logic.service';

describe('DashboardContainer', () => {
  let component: DashboardContainer;
  let mockStore: any;
  let mockRouter: any;
  let mockDashService: any;
  let mockBreakpointService: any;
  let mockBirthdayLogic: any;

  const mockTranslate = {
    instant: (key: string) => key,
    get: vi.fn(() => of('translated')),
    stream: vi.fn(() => of('translated')),
  };

  beforeEach(() => {
    mockStore = {
      dispatch: vi.fn(),
      selectSignal: vi.fn((selector) => signal(false)),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    mockDashService = {
      myItems: signal([]),
      widgetCatalog: signal([]),
      visibleItems: signal([]),
      updateItemsOnDrag: vi.fn(),
      foldWidget: vi.fn(),
      toggleCatalogWidget: vi.fn(),
      syncWidgetsFromDraft: vi.fn(),
    };

    mockBreakpointService = {
      isXsMobile: signal(false),
    };

    mockBirthdayLogic = {
      isModalVisible: signal(false),
      dismiss: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        DashboardContainer,
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
        { provide: TranslateService, useValue: mockTranslate },
        { provide: DashboardService, useValue: mockDashService },
        { provide: BreakpointService, useValue: mockBreakpointService },
        { provide: BirthdayLogicService, useValue: mockBirthdayLogic },
      ],
    });

    component = TestBed.inject(DashboardContainer);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch actions on ngOnInit', () => {
    component.ngOnInit();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      UserInfoActions.loadWidgets({}),
    );
    expect(mockStore.dispatch).toHaveBeenCalledWith(TransactionActions.enter());
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      loadExchangeRates({ baseCurrency: 'USD' }),
    );
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      AccountsActions.loadAccounts({}),
    );
  });

  it('should delegate drag changes to DashboardService', () => {
    const newItems = [{ id: '1' }] as any;
    component.onItemsChange(newItems);
    expect(mockDashService.updateItemsOnDrag).toHaveBeenCalledWith(newItems);
  });

  it('should delegate widget folding to DashboardService', () => {
    component.onFoldWidget(true, 'widget-1');
    expect(mockDashService.foldWidget).toHaveBeenCalledWith(true, 'widget-1');
  });

  it('should update draft selection locally when toggling catalog widget', () => {
    component.onToggleCatalogWidget(true, 'widget-2');

    expect((component as any).draftSelection()).toContain('widget-2');

    component.onToggleCatalogWidget(false, 'widget-2');
    expect((component as any).draftSelection()).not.toContain('widget-2');

    expect(mockDashService.toggleCatalogWidget).not.toHaveBeenCalled();
  });

  it('should dispatch exchange rate actions on widget refresh', () => {
    component.onWidgetRefresh();

    expect(mockStore.dispatch).toHaveBeenCalledWith(clearExchangeRates());
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      loadExchangeRates({ baseCurrency: 'USD' }),
    );
  });

  it('should navigate to accounts page on widget add', () => {
    component.onWidgetAdd();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/bank/products/accounts',
    ]);
  });

  it('should check DRAFT selection when customizing', () => {
    (component as any).isCustomizing.set(true);
    (component as any).draftSelection.set(['draft-1']);
    mockDashService.myItems.set([]);

    expect((component as any).isWidgetActive('draft-1')).toBe(true);
    expect((component as any).isWidgetActive('other')).toBe(false);
  });

  it('should check MY ITEMS when NOT customizing', () => {
    (component as any).isCustomizing.set(false);
    (component as any).draftSelection.set([]);
    mockDashService.myItems.set([{ id: 'live-1' }]);

    expect((component as any).isWidgetActive('live-1')).toBe(true);
    expect((component as any).isWidgetActive('other')).toBe(false);
  });

  it('should dispatch pagination change and reload actions', () => {
    const pageLimit = 20;
    component.onPaginationChange(pageLimit);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      TransactionActions.updateFilters({ filters: { pageLimit: 20 } }),
    );
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      TransactionActions.loadTransactions({ forceRefresh: true }),
    );
  });

  it('should compute dynamic colspans based on visible items', () => {
    mockDashService.visibleItems.set([{ id: '1' }, { id: '2' }, { id: '3' }]);

    const colspans = component.dynamicColspans();

    expect(colspans[0]).toBe(2);
    expect(colspans[1]).toBe(1);
    expect(colspans[2]).toBe(1);
  });

  it('should compute horizontal colspans (all 1) on mobile', () => {
    mockBreakpointService.isXsMobile.set(true);
    mockDashService.visibleItems.set([{ id: '1' }, { id: '2' }]);

    const colspans = component.dynamicColspans();

    expect(colspans.every((c) => c === 1)).toBe(true);
  });

  it('should use 1 column if item count is < 3 (regardless of screen size)', () => {
    mockDashService.visibleItems.set([{ id: '1' }, { id: '2' }]);
    mockBreakpointService.isXsMobile.set(false);

    const columns = component['gridColumns']();
    expect(columns.default).toBe(1);
  });

  it('should use 1 column if screen is XS Mobile (regardless of item count)', () => {
    mockDashService.visibleItems.set([
      { id: '1' },
      { id: '2' },
      { id: '3' },
      { id: '4' },
    ]);
    mockBreakpointService.isXsMobile.set(true);

    const columns = component['gridColumns']();
    expect(columns.default).toBe(1);
  });

  it('should handle birthday modal dismissal', () => {
    component.onBirthdayDismiss();
    expect(mockBirthdayLogic.dismiss).toHaveBeenCalled();
  });

  it('should expose birthday modal visibility', () => {
    mockBirthdayLogic.isModalVisible.set(true);
    expect(component.isBirthdayVisible()).toBe(true);

    mockBirthdayLogic.isModalVisible.set(false);
    expect(component.isBirthdayVisible()).toBe(false);
  });
});
