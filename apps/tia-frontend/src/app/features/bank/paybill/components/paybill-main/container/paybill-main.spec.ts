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
