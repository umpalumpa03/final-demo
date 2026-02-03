import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router, provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PaybillMain } from './paybill-main';
import { PaybillActions } from '../../../store/paybill.actions';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import * as PAYBILL_SELECTORS from '../../../store/paybill.selectors';
import { TranslateModule } from '@ngx-translate/core';

describe('PaybillMain', () => {
  let component: PaybillMain;
  let fixture: ComponentFixture<PaybillMain>;
  let store: MockStore;
  let router: Router;

  const mockProvider = { id: 'p1', name: 'Provider 1', isFinal: true };
  const mockCategory = {
    id: 'UTILITIES',
    name: 'Utilities',
    providers: [
      { id: 'parent_1', name: 'Folder', isFinal: false },
      { id: 'child_1', name: 'Bill', isFinal: true, parentId: 'parent_1' },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillMain, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [
            {
              selector: PAYBILL_SELECTORS.selectCategories,
              value: [mockCategory],
            },
            {
              selector: PAYBILL_SELECTORS.selectActiveCategory,
              value: mockCategory,
            },
            {
              selector: PAYBILL_SELECTORS.selectActiveProvider,
              value: mockProvider,
            },
            { selector: PAYBILL_SELECTORS.selectCurrentStep, value: 'DETAILS' },
            { selector: PAYBILL_SELECTORS.selectVerifiedDetails, value: null },
            { selector: PAYBILL_SELECTORS.selectLoading, value: false },
            { selector: PAYBILL_SELECTORS.selectPaymentPayload, value: null },
            { selector: PAYBILL_SELECTORS.selectChallengeId, value: null },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(PaybillMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Identification Routing Logic', () => {
    it('should resolve phoneNumber key for mobile routes', () => {
      vi.spyOn(router, 'url', 'get').mockReturnValue(
        '/bank/paybill/mobile-recharge',
      );
      expect(component.identificationKey()).toBe('phoneNumber');
    });

    it('should resolve propertyCode key and inject tenantId for rent routes', () => {
      vi.spyOn(router, 'url', 'get').mockReturnValue(
        '/bank/paybill/rent-payment',
      );
      expect(component.identificationKey()).toBe('propertyCode');

      const spy = vi.spyOn(store, 'dispatch');
      component.onVerifyAccount({ value: 'PROP123' });

      expect(spy).toHaveBeenCalledWith(
        PaybillActions.checkBill({
          serviceId: 'p1',
          identification: {
            propertyCode: 'PROP123',
            tenantId: '09876543210',
          },
        }),
      );
    });

    it('should fallback to accountNumber for unknown routes', () => {
      vi.spyOn(router, 'url', 'get').mockReturnValue('/bank/paybill/other');
      expect(component.identificationKey()).toBe('accountNumber');
    });
  });

  describe('Hierarchical Provider Navigation', () => {
    it('should update selectedParentId when a non-final provider is selected', () => {
      component.onProviderSelected('parent_1');
      expect(component.selectedParentId()).toBe('parent_1');
      expect(component.isRootProviderView()).toBe(false);
    });

    it('should dispatch selectProvider when a final provider is selected', () => {
      const spy = vi.spyOn(store, 'dispatch');
      component.onProviderSelected('child_1');
      expect(spy).toHaveBeenCalledWith(
        PaybillActions.selectProvider({ providerId: 'child_1' }),
      );
    });

    it('should navigate back up the tree when onProviderListBack is called', () => {
      component.onProviderSelected('parent_1');
      expect(component.selectedParentId()).toBe('parent_1');

      component.onProviderListBack();
      expect(component.selectedParentId()).toBeNull();
    });
  });

  describe('Payment Flow Handlers', () => {
    it('should dispatch setPaymentPayload and move to confirm step', () => {
      const spy = vi.spyOn(store, 'dispatch');
      component.onProceedToPayment({ value: '123', amount: 50 });

      expect(spy).toHaveBeenCalledWith(
        PaybillActions.setPaymentPayload({
          data: {
            identification: { accountNumber: '123' },
            amount: 50,
          },
        }),
      );
      expect(spy).toHaveBeenCalledWith(
        PaybillActions.setPaymentStep({ step: 'CONFIRM' }),
      );
    });

    it('should dispatch proceedPayment on final confirm if sender is selected', () => {
      const spy = vi.spyOn(store, 'dispatch');
      const mockPayload = {
        identification: { accountNumber: '123' },
        amount: 50,
      };

      store.overrideSelector(
        PAYBILL_SELECTORS.selectPaymentPayload,
        mockPayload,
      );
      store.refreshState();

      component.selectedSenderAccountId.set('ACC_001');
      component.onFinalConfirm();

      expect(spy).toHaveBeenCalledWith(
        PaybillActions.proceedPayment({
          payload: {
            serviceId: 'p1',
            identification: mockPayload.identification,
            amount: 50,
            senderAccountId: 'ACC_001',
          },
        }),
      );
    });
  });

  describe('Navigation Methods', () => {
    it('onResetFlow should clear selection and navigate to root', () => {
      const spy = vi.spyOn(store, 'dispatch');
      const navSpy = vi.spyOn(router, 'navigate');

      component.onResetFlow();

      expect(spy).toHaveBeenCalledWith(PaybillActions.clearSelection());
      expect(navSpy).toHaveBeenCalledWith(['/bank/paybill/pay']);
    });

    it('onGoDashboard should navigate to dashboard', () => {
      const navSpy = vi.spyOn(router, 'navigate');
      component.onGoDashboard();
      expect(navSpy).toHaveBeenCalledWith(['/bank/dashboard']);
    });
  });

  describe('Computed UI Mappings', () => {
    it('should format categories with UI config colors', () => {
      const formatted = component.formattedCategories();
      expect(formatted.length).toBe(1);
      expect(formatted[0].iconBgColor).toBeDefined();
    });

    it('should return null for activeCategoryUI if no category is selected', () => {
      store.overrideSelector(PAYBILL_SELECTORS.selectActiveCategory, null);
      store.refreshState();
      expect(component.activeCategoryUI()).toBeNull();
    });

    it('should dispatch selectCategory action when a category is selected', () => {
      const spy = vi.spyOn(store, 'dispatch');
      const categoryId = 'UTILITIES';

      component.selectCategory(categoryId);

      expect(spy).toHaveBeenCalledWith(
        PaybillActions.selectCategory({ categoryId }),
      );
    });

    it('should dispatch selectProvider action when a provider is selected', () => {
      const spy = vi.spyOn(store, 'dispatch');
      const providerId = 'magti_01';

      component.selectProvider(providerId);

      expect(spy).toHaveBeenCalledWith(
        PaybillActions.selectProvider({ providerId }),
      );
    });

    it('should update the selectedSenderAccountId signal when an account is selected', () => {
      const accountId = 'GE12TB0000000000000000';

      component.onAccountSelected(accountId);

      expect(component.selectedSenderAccountId()).toBe(accountId);
    });
  });

  describe('Navigation and Step Management', () => {
    it('onBackToDetails should clear notifications, reset step, and navigate to the base pay route', () => {
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      const navSpy = vi.spyOn(router, 'navigate');

      component.onBackToDetails();

      expect(dispatchSpy).toHaveBeenCalledWith(
        PaybillActions.clearAllNotifications(),
      );

      expect(dispatchSpy).toHaveBeenCalledWith(
        PaybillActions.setPaymentStep({ step: 'DETAILS' }),
      );

      expect(navSpy).toHaveBeenCalledWith(['bank/paybill/pay']);
    });
  });
});
