import { TestBed } from '@angular/core/testing';
import { PaybillMainFacade } from './paybill-main-facade';
import { Store } from '@ngrx/store';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { signal, WritableSignal } from '@angular/core';
import { Subject } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { PaybillActions } from '../../../store/paybill.actions';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';

describe('PaybillMainFacade', () => {
  let service: PaybillMainFacade;
  let routerEvents$: Subject<any>;
  let mockStore: any;
  let mockRouter: any;

  let storeSignals: { [key: string]: WritableSignal<any> };

  beforeEach(() => {
    routerEvents$ = new Subject();

    storeSignals = {
      selectActiveCategory: signal(null),
      selectActiveProvider: signal(null),
      selectPaymentPayload: signal(null),
      selectVerifiedDetails: signal(null),
      selectCategories: signal([]),
      selectLoading: signal(false),
      selectChallengeId: signal(null),
      selectCurrentStep: signal('DETAILS'),
      selectGelAccountOptions: signal([]),
    };

    mockStore = {
      dispatch: vi.fn(),

      selectSignal: vi.fn((selector: any) => {
        return signal(null);
      }),
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

    (service as any).activeCategory = storeSignals.selectActiveCategory;
    (service as any).storeActiveProvider = storeSignals.selectActiveProvider;
    (service as any).paymentPayload = storeSignals.selectPaymentPayload;
    (service as any).categories = storeSignals.selectCategories;
    (service as any).challengeId = storeSignals.selectChallengeId;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should dispatch loadAccounts on init', () => {
      service.init();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        AccountsActions.loadAccounts(),
      );
      expect(service.searchQuery()).toBe('');
    });
  });

  describe('Computed Logic: Active Provider & URL', () => {
    it('should resolve activeProvider from URL if present in category', () => {
      mockRouter.url = '/bank/paybill/123';
      routerEvents$.next(
        new NavigationEnd(1, '/bank/paybill/123', '/bank/paybill/123'),
      );

      const provider123 = { id: '123', name: 'Test Provider' };
      storeSignals.selectActiveCategory.set({
        id: 'cat1',
        providers: [provider123],
      });

      expect(service.selectedParentId()).toBe('123');
      expect(service.activeProvider()).toEqual(provider123);
    });

    it('should fallback to storeActiveProvider if URL has no ID', () => {
      mockRouter.url = '/bank/paybill/pay';
      routerEvents$.next(
        new NavigationEnd(1, '/bank/paybill/pay', '/bank/paybill/pay'),
      );

      const storeProvider = { id: '999', name: 'Store Provider' };
      storeSignals.selectActiveProvider.set(storeProvider);

      expect(service.activeProvider()).toEqual(storeProvider);
    });
  });

  describe('Search & Filtering Logic', () => {
    it('should filter providers and include parents recursively', () => {
      const providers = [
        { id: '1', name: 'Grandparent' },
        { id: '2', name: 'Parent', parentId: '1' },
        { id: '3', name: 'Child', parentId: '2' },
        { id: '4', name: 'Unrelated' },
      ];

      storeSignals.selectActiveCategory.set({ id: 'cat1', providers });

      service.setSearchQuery('child');

      const filtered = service.filteredProviders();

      const resultIds = filtered.map((p: any) => p.id);
      expect(resultIds).toContain('1');
      expect(resultIds).not.toContain('4');
    });
  });

  describe('Categories', () => {
    it('should format categories with UI config', () => {
      storeSignals.selectCategories.set([
        { id: 'utility', name: 'Utility', providers: [1, 2] },
      ]);

      const formatted = service.formattedCategories();
      expect(formatted[0].iconBgColor).toBeDefined();
      expect(formatted[0].count).toBe(2);
    });

    it('should filter categories by search query', () => {
      storeSignals.selectCategories.set([
        { id: '1', name: 'Apple' },
        { id: '2', name: 'Banana' },
      ]);

      service.setSearchQuery('app');
      const formatted = service.formattedCategories();

      expect(formatted.length).toBe(1);
      expect(formatted[0].name).toBe('Apple');
    });
  });

  describe('Payment Actions', () => {
    it('should dispatch checkBill on verifyAccount', () => {
      const provider = { id: 'p1' };
      storeSignals.selectActiveProvider.set(provider);

      mockRouter.url = '/bank/paybill/mobile';

      service.verifyAccount('5551234');

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PaybillActions.checkBill({
          serviceId: 'p1',
          identification: { phoneNumber: '5551234' },
        }),
      );
    });

    it('should dispatch setTransactionProvider and navigate on proceedToPayment', () => {
      const provider = { id: 'p1' };
      storeSignals.selectActiveProvider.set(provider);

      service.proceedToPayment(100, 'account123');

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PaybillActions.setTransactionProvider({ provider }),
      );
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PaybillActions.setPaymentStep({ step: 'CONFIRM' }),
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/bank/paybill/pay/confirm-payment',
      ]);
    });
  });

  describe('Navigation Helpers', () => {
    it('should navigate correctly in selectParentId', () => {
      mockRouter.url = '/bank/paybill/pay';
      service.selectParentId('child-id');

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
        '/bank/paybill/pay/child-id',
      );
    });

    it('should reset flow and navigate to dashboard', () => {
      service.resetFlow();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PaybillActions.clearSelection(),
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/paybill/pay']);
    });

    it('should backToDetails', () => {
      service.backToDetails();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PaybillActions.clearAllNotifications(),
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['bank/paybill/pay']);
    });
  });
});
