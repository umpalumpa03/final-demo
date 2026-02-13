import { TestBed } from '@angular/core/testing';
import { PaybillMainFacade } from './paybill-main-facade';
import { Store } from '@ngrx/store';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { Subject } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { PaybillActions } from '../../../store/paybill.actions';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';

describe('PaybillMainFacade', () => {
  let service: PaybillMainFacade;
  let mockStore: any;
  let mockRouter: any;
  let routerEvents$: Subject<any>;

  const storeSignals = {
    paymentPayload: signal<any>(null),
    activeCategory: signal<any>(null),
    storeActiveProvider: signal<any>(null),
    categories: signal<any[]>([]),
    verifiedDetails: signal(null),
    loading: signal(false),
    challengeId: signal<string | null>(null),
    storeAccounts: signal([]),
    paymentFields: signal([]),
  };

  beforeEach(() => {
    routerEvents$ = new Subject();

    mockStore = {
      dispatch: vi.fn(),
      selectSignal: vi.fn(() => signal(null)),
    };

    mockRouter = {
      url: '/bank/paybill/pay',
      events: routerEvents$.asObservable(),
      navigate: vi.fn(),
      navigateByUrl: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        PaybillMainFacade,
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {} },
      ],
    });

    service = TestBed.inject(PaybillMainFacade);

    (service as any).paymentPayload = storeSignals.paymentPayload;
    (service as any).activeCategory = storeSignals.activeCategory;
    (service as any).storeActiveProvider = storeSignals.storeActiveProvider;
    (service as any).categories = storeSignals.categories;
    (service as any).verifiedDetails = storeSignals.verifiedDetails;
    (service as any).isLoading = storeSignals.loading;
    (service as any).challengeId = storeSignals.challengeId;
    (service as any).storeAccounts = storeSignals.storeAccounts;
    (service as any).paymentFields = storeSignals.paymentFields;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('init: should dispatch loadAccounts and reset searchQuery', () => {
    service.init();
    expect(service.searchQuery()).toBe('');
  });

  describe('Signal Logic & Branches', () => {
    it('activeProvider: should return store provider if URL segment is "pay"', () => {
      const mockStoreProvider = { id: 'store-p', name: 'Store' };
      storeSignals.storeActiveProvider.set(mockStoreProvider);

      mockRouter.url = '/bank/paybill/pay';
      routerEvents$.next(new NavigationEnd(1, mockRouter.url, '/url'));

      expect(service.activeProvider()).toEqual(mockStoreProvider);
    });

    it('activeProvider: should return URL provider if match is found in category', () => {
      const providerA = { id: 'prov-a', name: 'A' };
      storeSignals.activeCategory.set({ id: 'cat1', providers: [providerA] });

      mockRouter.url = '/bank/paybill/cat1/prov-a';
      routerEvents$.next(new NavigationEnd(1, mockRouter.url, '/url'));

      expect(service.activeProvider()).toEqual(providerA);
    });

    it('activeProvider: should fallback to store provider if URL provider ID is not found in category', () => {
      const mockStoreProvider = { id: 'store-p', name: 'Store' };
      storeSignals.storeActiveProvider.set(mockStoreProvider);
      storeSignals.activeCategory.set({ id: 'cat1', providers: [] });

      mockRouter.url = '/bank/paybill/cat1/ghost-id';
      routerEvents$.next(new NavigationEnd(1, mockRouter.url, '/url'));

      expect(service.activeProvider()).toEqual(mockStoreProvider);
    });

    it('activeCategoryUI: should return null if no category is active', () => {
      storeSignals.activeCategory.set(null);
      expect(service.activeCategoryUI()).toBeNull();
    });

    it('activeCategoryUI: should return UI config if category is active', () => {
      storeSignals.activeCategory.set({ id: 'UTILITIES' });

      const ui = service.activeCategoryUI();
      expect(ui).not.toBeNull();
    });

    it('showSearch: should be true when NOT in form view', () => {
      storeSignals.activeCategory.set({
        id: 'cat',
        providers: [{ id: '1', isFinal: false }],
      });
      mockRouter.url = '/bank/paybill/cat/1';
      routerEvents$.next(new NavigationEnd(1, mockRouter.url, '/url'));

      expect(service.showSearch()).toBe(true);
    });

    it('init: should dispatch selectCategory and selectProvider when URL contains category and provider', () => {
      mockRouter.url = '/bank/paybill/pay/utilities/gas-provider';

      service.init();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PaybillActions.selectCategory({ categoryId: 'utilities' }),
      );

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PaybillActions.selectProvider({ providerId: 'gas-provider' }),
      );
    });

    it('isRootProviderView: should be true when no sub-provider is selected', () => {
      mockRouter.url = '/bank/paybill/pay';
      routerEvents$.next(new NavigationEnd(1, mockRouter.url, '/url'));
      expect(service.isRootProviderView()).toBe(true);
    });
  });

  describe('Actions & Navigation', () => {
    it('setSearchQuery: should update the searchQuery signal', () => {
      service.setSearchQuery('test query');
      expect(service.searchQuery()).toBe('test query');
    });

    it('resetFlow: should clear selection and navigate to base URL', () => {
      service.resetFlow();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PaybillActions.clearSelection(),
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/paybill/pay']);
    });
  });
});
