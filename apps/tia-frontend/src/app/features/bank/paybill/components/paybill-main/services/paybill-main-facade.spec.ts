import { TestBed } from '@angular/core/testing';
import { PaybillMainFacade } from './paybill-main-facade';
import { Store } from '@ngrx/store';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { signal, WritableSignal } from '@angular/core';
import { Subject, of } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { PaybillActions } from '../../../store/paybill.actions';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';

describe('PaybillMainFacade', () => {
  let service: PaybillMainFacade;
  let mockStore: any;
  let mockRouter: any;
  let routerEvents$: Subject<any>;

  const storeSignals = {
    currentStep: signal('DETAILS'),
    paymentPayload: signal<any>(null),
    activeCategory: signal<any>(null),
    storeActiveProvider: signal<any>(null),
    categories: signal<any[]>([]),
    verifiedDetails: signal(null),
    loading: signal(false),
    challengeId: signal<string | null>(null),
    storeAccounts: signal([]),
  };

  beforeEach(() => {
    routerEvents$ = new Subject();

    mockStore = {
      dispatch: vi.fn(),

      selectSignal: vi.fn((selector) => {
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

    (service as any).currentStep = storeSignals.currentStep;
    (service as any).paymentPayload = storeSignals.paymentPayload;
    (service as any).activeCategory = storeSignals.activeCategory;
    (service as any).storeActiveProvider = storeSignals.storeActiveProvider;
    (service as any).categories = storeSignals.categories;
    (service as any).verifiedDetails = storeSignals.verifiedDetails;
    (service as any).isLoading = storeSignals.loading;
    (service as any).challengeId = storeSignals.challengeId;
    (service as any).storeAccounts = storeSignals.storeAccounts;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load accounts and clear search on init', () => {
      service.setSearchQuery('old query');
      service.init();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        AccountsActions.loadAccounts(),
      );
      expect(service.searchQuery()).toBe('');
    });
  });

  describe('Computed Logic', () => {
    it('should determine isFormView based on provider.isFinal', () => {
      storeSignals.activeCategory.set({
        id: 'util',
        providers: [
          { id: '1', isFinal: true },
          { id: '2', isFinal: false },
        ],
      });

      mockRouter.url = '/bank/paybill/util/1';
      routerEvents$.next(new NavigationEnd(1, '/bank/paybill/util/1', '/url'));

      expect(service.selectedParentId()).toBe('1');
      expect(service.isFormView()).toBe(true);

      mockRouter.url = '/bank/paybill/util/2';
      routerEvents$.next(new NavigationEnd(2, '/bank/paybill/util/2', '/url'));

      expect(service.selectedParentId()).toBe('2');
      expect(service.isFormView()).toBe(false);
    });

    it('should format categories and filter by search query', () => {
      storeSignals.categories.set([
        { id: 'cat1', name: 'Utilities', providers: [1, 2] },
        { id: 'cat2', name: 'Internet', providers: [] },
      ]);

      const allCats = service.formattedCategories();
      expect(allCats.length).toBe(2);
      expect(allCats[0].count).toBe(2);
      expect(allCats[0].iconBgColor).toBeDefined();

      service.setSearchQuery('net');
      const filteredCats = service.formattedCategories();
      expect(filteredCats.length).toBe(1);
      expect(filteredCats[0].name).toBe('Internet');
    });

    it('should filter providers recursively based on search', () => {
      const providers = [
        { id: '1', name: 'Grandparent' },
        { id: '2', name: 'Parent', parentId: '1' },
        { id: '3', name: 'Child', parentId: '2' },
        { id: '4', name: 'Unrelated' },
      ];
      storeSignals.activeCategory.set({ id: 'cat', providers });

      service.setSearchQuery('child');

      service.setSearchQuery('xyz');
      expect(service.filteredProviders().length).toBe(0);
    });
  });

  describe('Actions & Navigation', () => {
    it('should navigateByUrl when selectParentId is called', () => {
      service.selectParentId('child-123');

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith(
        '/bank/paybill/pay/child-123',
      );
    });

    it('should dispatch selectCategory action', () => {
      service.selectCategory('cat-1');
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PaybillActions.selectCategory({ categoryId: 'cat-1' }),
      );
    });

    it('should dispatch selectProvider action', () => {
      service.selectProvider('prov-1');
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PaybillActions.selectProvider({ providerId: 'prov-1' }),
      );
    });

    it('should confirm payment (dispatch + navigate)', () => {
      const provider = { id: 'prov-1' };
      const payload = { amount: 50, identification: {} };

      storeSignals.storeActiveProvider.set(provider);
      storeSignals.paymentPayload.set(payload);
      service.selectedSenderAccountId.set('sender-1');

      service.confirmPayment();

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PaybillActions.proceedPayment({
          payload: {
            serviceId: 'prov-1',
            identification: payload.identification,
            amount: 50,
            senderAccountId: 'sender-1',
          },
        }),
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/bank/paybill/pay/otp-verification',
      ]);
    });

    it('should verify OTP', () => {
      storeSignals.challengeId.set('chal-123');
      service.verifyOtp('123456');

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PaybillActions.confirmPayment({
          payload: { challengeId: 'chal-123', code: '123456' },
        }),
      );
    });

    it('should reset flow', () => {
      service.resetFlow();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PaybillActions.clearSelection(),
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/paybill/pay']);
    });

    it('should clear selection and navigate in resetFlow', () => {
      service.resetFlow();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PaybillActions.clearSelection(),
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/paybill/pay']);
    });

    it('should dispatch resetPaymentForm', () => {
      service.resetPaymentForm();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PaybillActions.resetPaymentForm(),
      );
    });

    it('should navigate to dashboard in resetToDashboard', () => {
      service.resetToDashboard();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/bank/dashboard']);
    });

    it('should clear notifications and navigate back in backToDetails', () => {
      service.backToDetails();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PaybillActions.clearAllNotifications(),
      );
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PaybillActions.setPaymentStep({ step: 'DETAILS' }),
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['bank/paybill/pay']);
    });

    it('should return empty array if no provider or payload', () => {
      storeSignals.storeActiveProvider.set(null);
      storeSignals.paymentPayload.set(null);
      expect(service.successSummaryItems()).toEqual([]);
    });

    it('should return items when provider and payload exist', () => {
      storeSignals.storeActiveProvider.set({ id: 'p1', name: 'Provider 1' });
      storeSignals.paymentPayload.set({
        amount: 100,
        identification: { accountNumber: '123' },
      });

      const items = service.successSummaryItems();
      expect(items).toBeDefined();

      expect(Array.isArray(items)).toBe(true);
    });

    it('should execute the recursive while loop when a search matches a nested child', () => {
      const providers = [
        { id: 'parent-1', name: 'Utility Group', isFinal: false },
        {
          id: 'child-1',
          name: 'Water Bill',
          parentId: 'parent-1',
          isFinal: true,
        },
        { id: 'unrelated', name: 'Other', isFinal: true },
      ];

      storeSignals.activeCategory.set({ id: 'utilities', providers });

      service.setSearchQuery('Water');

      const result = service.filteredProviders();

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('parent-1');
    });
  });
});
