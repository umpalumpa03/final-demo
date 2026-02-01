import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PaybillMain } from './paybill-main';
import { PaybillActions } from '../../../store/paybill.actions';
import { AccountsActions } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.actions';
import { selectCurrentAccounts } from 'apps/tia-frontend/src/app/store/products/accounts/accounts.selectors';
import * as PAYBILL_SELECTORS from '../../../store/paybill.selectors';

describe('PaybillMain', () => {
  let component: PaybillMain;
  let fixture: ComponentFixture<PaybillMain>;
  let store: MockStore;

  const mockProvider = { id: 'p1', name: 'Provider 1' };
  const mockPayload = { accountNumber: '12345678', amount: 100 };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillMain],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [
            { selector: PAYBILL_SELECTORS.selectCategories, value: [] },
            { selector: PAYBILL_SELECTORS.selectActiveCategory, value: null },
            { selector: PAYBILL_SELECTORS.selectActiveProvider, value: null },
            { selector: PAYBILL_SELECTORS.selectCurrentStep, value: 'DETAILS' },
            { selector: PAYBILL_SELECTORS.selectPaymentPayload, value: null },
            { selector: PAYBILL_SELECTORS.selectChallengeId, value: null },
            { selector: PAYBILL_SELECTORS.selectVerifiedDetails, value: null },
            { selector: PAYBILL_SELECTORS.selectLoading, value: false },
            { selector: selectCurrentAccounts, value: [] },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillMain);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should initialize and load accounts on init', () => {
    const spy = vi.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(AccountsActions.loadAccounts());
  });

  describe('Selection Handlers', () => {
    it('should dispatch selectCategory action', () => {
      const spy = vi.spyOn(store, 'dispatch');
      component.selectCategory('util-id');
      expect(spy).toHaveBeenCalledWith(
        PaybillActions.selectCategory({ categoryId: 'util-id' }),
      );
    });

    it('should dispatch selectProvider action', () => {
      const spy = vi.spyOn(store, 'dispatch');
      component.selectProvider('prov-id');
      expect(spy).toHaveBeenCalledWith(
        PaybillActions.selectProvider({ providerId: 'prov-id' }),
      );
    });
  });

  describe('Payment Process', () => {
    it('should dispatch checkBill when account is verified', () => {
      const spy = vi.spyOn(store, 'dispatch');
      store.overrideSelector(
        PAYBILL_SELECTORS.selectActiveProvider,
        mockProvider as any,
      );
      store.refreshState();

      component.onVerifyAccount({ accountNumber: '123' });
      expect(spy).toHaveBeenCalledWith(
        PaybillActions.checkBill({ serviceId: 'p1', accountNumber: '123' }),
      );
    });

    it('should dispatch setPaymentPayload and update step when proceeding', () => {
      const spy = vi.spyOn(store, 'dispatch');
      store.overrideSelector(
        PAYBILL_SELECTORS.selectActiveProvider,
        mockProvider as any,
      );
      store.refreshState();

      component.onProceedToPayment(mockPayload);
      expect(spy).toHaveBeenCalledWith(
        PaybillActions.setPaymentPayload({ data: mockPayload }),
      );
      expect(spy).toHaveBeenCalledWith(
        PaybillActions.setPaymentStep({ step: 'CONFIRM' }),
      );
    });

    it('should dispatch proceedPayment on final confirm when all data is present', () => {
      const spy = vi.spyOn(store, 'dispatch');
      store.overrideSelector(
        PAYBILL_SELECTORS.selectActiveProvider,
        mockProvider as any,
      );
      store.overrideSelector(
        PAYBILL_SELECTORS.selectPaymentPayload,
        mockPayload,
      );
      store.refreshState();

      component.onAccountSelected('account-abc');
      component.onFinalConfirm();

      expect(spy).toHaveBeenCalledWith(
        PaybillActions.proceedPayment({
          payload: {
            serviceId: 'p1',
            identification: { accountNumber: '12345678' },
            amount: 100,
            senderAccountId: 'account-abc',
          },
        }),
      );
    });

    it('should not dispatch proceedPayment if sender account is missing', () => {
      const spy = vi.spyOn(store, 'dispatch');
      store.overrideSelector(
        PAYBILL_SELECTORS.selectActiveProvider,
        mockProvider as any,
      );
      store.overrideSelector(
        PAYBILL_SELECTORS.selectPaymentPayload,
        mockPayload,
      );
      store.refreshState();

      component.onFinalConfirm();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('OTP Verification', () => {
    it('should dispatch confirmPayment if challengeId exists', () => {
      const spy = vi.spyOn(store, 'dispatch');
      store.overrideSelector(PAYBILL_SELECTORS.selectChallengeId, 'chal-123');
      store.refreshState();

      component.onOtpVerified('1111');
      expect(spy).toHaveBeenCalledWith(
        PaybillActions.confirmPayment({
          payload: { challengeId: 'chal-123', code: '1111' },
        }),
      );
    });
  });
});
