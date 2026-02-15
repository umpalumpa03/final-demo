import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, Routes } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import {
  TranslateModule,
  TranslateLoader,
  TranslateFakeLoader,
} from '@ngx-translate/core';

import { PaybillMain } from '../../components/paybill-main/container/paybill-main';
import { PaybillConfirmPaymentContainer } from '../../components/paybill-main/components/paybill-confirm-payment/container/paybill-confirm-payment-container';
import { PaybillOtpVerificationContainer } from '../../components/paybill-main/components/paybill-otp-verification/container/paybill-otp-verification-container';
import { PaybillSuccessContainer } from '../../components/paybill-main/components/paybill-success/container/paybill-success-container';
import { PaybillMainFacade } from '../../components/paybill-main/services/paybill-main-facade';
import { PaybillActions } from '../../store/paybill.actions';

const routes: Routes = [
  {
    path: 'paybill',
    component: PaybillMain,
    children: [
      { path: 'confirm', component: PaybillConfirmPaymentContainer },
      { path: 'otp', component: PaybillOtpVerificationContainer },
      { path: 'success', component: PaybillSuccessContainer },
    ],
  },
];

describe('Integration: Paybill Payment Flow', () => {
  let harness: RouterTestingHarness;
  let store: any;
  let mockFacade: any;

  beforeEach(async () => {
    mockFacade = {
      init: vi.fn(),
      clearRepeatTransaction: vi.fn(),
      setSearchQuery: vi.fn(),
      isRootProviderView: signal(false),
      showSearch: signal(false),
      isLoading: signal(false),

      activeCategory: signal({ id: 'cat-1', name: 'Utilities' }),
      selectedParentId: signal<string | null>(null),

      activeProvider: signal({ id: 'prov-1', name: 'Gas Utility' }),
      paymentPayload: signal({ amount: 50, identification: '99887766' }),
      verifiedDetails: signal({ name: 'Giorgi Burduladze', valid: true }),
      selectedSenderAccountId: signal('acc-456'),
      activeCategoryUI: signal({
        iconBgColor: '#E0F2FE',
        iconBgPath: 'assets/gas.svg',
      }),
      storeAccounts: signal([]),
      challengeId: signal('otp-session-123'),

      backToDetails: vi.fn(),
      resetFlow: vi.fn(),
      resetToDashboard: vi.fn(),
    };

    const mockStore = {
      dispatch: vi.fn(),
      selectSignal: vi.fn().mockReturnValue(signal('acc-456')),
    };

    await TestBed.configureTestingModule({
      imports: [
        PaybillMain,
        PaybillConfirmPaymentContainer,
        PaybillOtpVerificationContainer,
        PaybillSuccessContainer,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
        }),
      ],
      providers: [
        provideRouter(routes),
        { provide: PaybillMainFacade, useValue: mockFacade },
        { provide: Store, useValue: mockStore },
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    harness = await RouterTestingHarness.create();
  });

  describe('Step 1: Confirm Payment', () => {
    it('should dispatch proceedPayment action when user confirms', async () => {
      await harness.navigateByUrl('/paybill/confirm');
      harness.detectChanges();

      const instance = harness.fixture.debugElement.query(
        By.directive(PaybillConfirmPaymentContainer),
      ).componentInstance;

      instance.confirmPayment();

      expect(store.dispatch).toHaveBeenCalledWith(
        PaybillActions.proceedPayment({
          payload: {
            serviceId: 'prov-1',
            identification: '99887766',
            amount: 50,
            senderAccountId: 'acc-456',
          },
        }),
      );
    });
  });

  describe('Step 2: OTP Verification', () => {
    it('should dispatch confirmPayment action when OTP is verified', async () => {
      await harness.navigateByUrl('/paybill/otp');
      harness.detectChanges();

      const instance = harness.fixture.debugElement.query(
        By.directive(PaybillOtpVerificationContainer),
      ).componentInstance;

      instance.verifyOtp('123456');

      expect(store.dispatch).toHaveBeenCalledWith(
        PaybillActions.confirmPayment({
          payload: { challengeId: 'otp-session-123', code: '123456' },
        }),
      );
    });
  });

  describe('Step 3: Success', () => {
    it('should render success summary and handle dashboard navigation', async () => {
      await harness.navigateByUrl('/paybill/success');
      harness.detectChanges();

      const instance = harness.fixture.debugElement.query(
        By.directive(PaybillSuccessContainer),
      ).componentInstance;

      instance.onGoDashboard();
      expect(mockFacade.resetToDashboard).toHaveBeenCalled();

      instance.onPayAnother();
      expect(mockFacade.resetFlow).toHaveBeenCalled();
    });
  });
});
