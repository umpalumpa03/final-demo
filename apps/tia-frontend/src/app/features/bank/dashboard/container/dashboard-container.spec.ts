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
import { signal, computed } from '@angular/core';
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

    mockBreakpointService = {
      isXsMobile: signal(false),
      isTablet: signal(false),
    };

    const visibleItems = signal<any[]>([]);
    const myItems = signal<any[]>([]);

    mockDashService = {
      myItems,
      widgetCatalog: signal([]),
      visibleItems,

      gridColumns: computed(() => {
        const itemCount = visibleItems().length;
        const isVertical =
          mockBreakpointService.isXsMobile() ||
          mockBreakpointService.isTablet() ||
          itemCount < 3;
        return isVertical
          ? { default: 1, md: 1, sm: 1 }
          : { default: 2, md: 2, sm: 1 };
      }),
      dynamicColspans: computed(() => {
        const items = visibleItems();
        const isVertical =
          mockBreakpointService.isXsMobile() ||
          mockBreakpointService.isTablet() ||
          items.length < 3;
        return items.map((_, index) => (isVertical ? 1 : index === 0 ? 2 : 1));
      }),
      processedItems: signal([]),
      updateItemsOnDrag: vi.fn(),
      foldWidget: vi.fn((isSelected: boolean, id: string) => {
        myItems.update((items) =>
          items.map((item) =>
            item.id === id ? { ...item, isHidden: !isSelected } : item
          )
        );
      }),
      toggleCatalogWidget: vi.fn(),
      syncWidgetsFromDraft: vi.fn(),
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

  describe('Initialization and Lifecycle', () => {
    it('ngOnInit: should dispatch loadWidgets if they are not loaded', () => {
      mockStore.selectSignal.mockImplementation((selector: any) => {
        if (selector.name === 'selectWidgetsLoaded') return signal(false);
        return signal(false);
      });

      component.ngOnInit();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        UserInfoActions.loadWidgets({}),
      );
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        TransactionActions.enter(),
      );
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        loadExchangeRates({ baseCurrency: 'USD' }),
      );
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        AccountsActions.loadAccounts({}),
      );
    });
  });

  describe('Widget Customization and Catalog', () => {
    it('onToggleCatalogWidget: should add and remove items from draft selection', () => {
      component.onToggleCatalogWidget(true, 'widget-new');
      expect((component as any).draftSelection()).toContain('widget-new');

      component.onToggleCatalogWidget(false, 'widget-new');
      expect((component as any).draftSelection()).not.toContain('widget-new');
    });

    it('isWidgetActive: should use draft selection when customizing', () => {
      (component as any).isCustomizing.set(true);
      (component as any).draftSelection.set(['draft-id']);

      expect((component as any).isWidgetActive('draft-id')).toBe(true);
      expect((component as any).isWidgetActive('live-id')).toBe(false);
    });

    it('isWidgetActive: should use live myItems when NOT customizing', () => {
      (component as any).isCustomizing.set(false);
      mockDashService.myItems.set([{ id: 'live-id' }] as any);

      expect((component as any).isWidgetActive('live-id')).toBe(true);
      expect((component as any).isWidgetActive('draft-id')).toBe(false);
    });
  });

  describe('Feature Actions', () => {
    it('onWidgetRefresh: should dispatch exchange rate refresh actions', () => {
      component.onWidgetRefresh();

      expect(mockStore.dispatch).toHaveBeenCalledWith(clearExchangeRates());
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        loadExchangeRates({ baseCurrency: 'USD' }),
      );
    });

    it('onWidgetAdd: should navigate to accounts product page', () => {
      component.onWidgetAdd();
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/bank/products/accounts',
      ]);
    });

    it('onPaginationChange: should update transaction filters and reload', () => {
      component.onPaginationChange(50);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        TransactionActions.updateFilters({ filters: { pageLimit: 50 } }),
      );
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        TransactionActions.loadTransactions({ forceRefresh: true }),
      );
    });

    it('Birthday Logic: should link to birthday service state and dismissal', () => {
      component.onBirthdayDismiss();
      expect(mockBirthdayLogic.dismiss).toHaveBeenCalled();

      mockBirthdayLogic.isModalVisible.set(true);
      expect((component as any).isBirthdayVisible()).toBe(true);
    });
  });

  describe('Specific Logic Coverage', () => {
    it('onFoldWidget: should update accountsHidden signal when item type is "accounts"', () => {
      const accountsWidget = { id: 'acc-1', type: 'accounts', isHidden: false };
      mockDashService.myItems.set([accountsWidget]);

      component.onFoldWidget(false, 'acc-1');

      expect(component['accountsHidden']()).toBe(true);

      component.onFoldWidget(true, 'acc-1');
      expect(component['accountsHidden']()).toBe(false);
    });

    it('pageTitle & pageSubtitle: should return translated strings via computed signals', () => {
      expect((component as any).pageTitle()).toBe('dashboard.page.title');
      expect((component as any).pageSubtitle()).toBe('dashboard.page.subtitle');
    });

    it('openCustomization: should populate draftSelection and set isCustomizing to true', () => {
      const items = [{ id: 'w1' }, { id: 'w2' }];
      mockDashService.myItems.set(items);

      component.openCustomization();

      expect((component as any).draftSelection()).toEqual(['w1', 'w2']);
      expect((component as any).isCustomizing()).toBe(true);
    });
  });
});
