import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Observable, of, throwError } from 'rxjs';
import {
  loadCategories,
  loadProviders,
  autoSelectProviderAfterLoad,
  checkBill,
  proceedPayment,
  confirmPayment,
} from './paybill.effects';
import { PaybillService } from '../services/paybill/paybill-service';
import { PaybillActions } from './paybill.actions';
import { BillDetails, PaybillProvider } from '../models/paybill.model';
import * as fromSelectors from './paybill.selectors';

describe('PaybillEffects', () => {
  let actions$: Observable<Action>;
  let store: MockStore;
  let serviceMock: {
    getCategories: ReturnType<typeof vi.fn>;
    getProviders: ReturnType<typeof vi.fn>;
    checkBill: ReturnType<typeof vi.fn>;
    payBill: ReturnType<typeof vi.fn>;
    verifyPayment: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    serviceMock = {
      getCategories: vi.fn(),
      getProviders: vi.fn(),
      checkBill: vi.fn(),
      payBill: vi.fn(),
      verifyPayment: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: PaybillService, useValue: serviceMock },
      ],
    });

    store = TestBed.inject(MockStore);
  });

  describe('loadCategories', () => {
    it('should dispatch loadCategoriesSuccess on successful API call', () => {
      TestBed.runInInjectionContext(() => {
        const categories = [
          {
            id: '1',
            name: 'Test',
            icon: '',
            description: 'Test description',
            providers: [],
            servicesQuantity: 0,
          },
        ];

        serviceMock.getCategories.mockReturnValue(of(categories));
        actions$ = of(PaybillActions.loadCategories());

        loadCategories().subscribe((action) => {
          expect(action).toEqual(
            PaybillActions.loadCategoriesSuccess({ categories }),
          );
        });
      });
    });

    it('should dispatch loadCategoriesFailure on API error', () => {
      TestBed.runInInjectionContext(() => {
        serviceMock.getCategories.mockReturnValue(
          throwError(() => ({ message: 'Unauthorized' })),
        );

        actions$ = of(PaybillActions.loadCategories());

        loadCategories().subscribe((action) => {
          expect(action).toEqual(
            PaybillActions.loadCategoriesFailure({ error: 'Unauthorized' }),
          );
        });
      });
    });
  });

  describe('loadProviders', () => {
    it('should dispatch loadProvidersSuccess on successful API call', () => {
      TestBed.runInInjectionContext(() => {
        const providers: PaybillProvider[] = [
          {
            id: 'p1',
            name: 'P1',
            categoryId: 'utilities',
            serviceName: 'Test Service',
          },
        ];

        serviceMock.getProviders.mockReturnValue(of(providers));
        actions$ = of(
          PaybillActions.selectCategory({ categoryId: 'utilities' }),
        );

        loadProviders().subscribe((action) => {
          expect(action).toEqual(
            PaybillActions.loadProvidersSuccess({ providers }),
          );
          expect(serviceMock.getProviders).toHaveBeenCalledWith('utilities');
        });
      });
    });
  });

  describe('autoSelectProviderAfterLoad', () => {
    it('should dispatch selectProvider if providerId exists in store after load', () => {
      TestBed.runInInjectionContext(() => {
        store.overrideSelector(fromSelectors.selectSelectedProviderId, 'p1');

        const providers: PaybillProvider[] = [
          { id: 'p1', name: 'P1', categoryId: 'cat1', serviceName: 'S1' },
        ];

        actions$ = of(PaybillActions.loadProvidersSuccess({ providers }));

        autoSelectProviderAfterLoad().subscribe((action) => {
          expect(action).toEqual(
            PaybillActions.selectProvider({ providerId: 'p1' }),
          );
        });
      });
    });
  });

  describe('checkBill', () => {
    it('should dispatch checkBillSuccess on success', () => {
      TestBed.runInInjectionContext(() => {
        const details: BillDetails = {
          valid: true,
          accountHolder: 'John Doe',
          amountDue: 100,
          address: 'Test St',
          dueDate: '2026-01-01',
          isExactAmount: false,
        };

        serviceMock.checkBill.mockReturnValue(of(details));
        actions$ = of(
          PaybillActions.checkBill({ serviceId: 's1', accountNumber: 'a1' }),
        );

        checkBill().subscribe((action) => {
          expect(action).toEqual(PaybillActions.checkBillSuccess({ details }));
        });
      });
    });

    it('should dispatch checkBillFailure on error', () => {
      TestBed.runInInjectionContext(() => {
        serviceMock.checkBill.mockReturnValue(
          throwError(() => ({ message: 'Verification Failed' })),
        );

        actions$ = of(
          PaybillActions.checkBill({ serviceId: 's1', accountNumber: 'a1' }),
        );

        checkBill().subscribe((action) => {
          expect(action).toEqual(
            PaybillActions.checkBillFailure({ error: 'Verification Failed' }),
          );
        });
      });
    });
  });

  describe('proceedPayment', () => {
    it('should set step to OTP if amount >= 50 and challenge exists', () => {
      TestBed.runInInjectionContext(() => {
        const response = {
          verify: { challengeId: 'c1' },
          transferType: 'BillPayment',
        };
        serviceMock.payBill.mockReturnValue(of(response));

        actions$ = of(
          PaybillActions.proceedPayment({
            payload: {
              amount: 100,
              serviceId: 's1',
              senderAccountId: 'acc1',
              identification: { accountNumber: '1' },
            },
          }),
        );

        proceedPayment().subscribe((action) => {
          expect(action).toEqual(
            PaybillActions.setPaymentStep({ step: 'OTP' }),
          );
        });
      });
    });
  });

  describe('confirmPayment', () => {
    it('should set step to SUCCESS on successful verification', () => {
      TestBed.runInInjectionContext(() => {
        serviceMock.verifyPayment.mockReturnValue(of({}));
        actions$ = of(
          PaybillActions.confirmPayment({
            payload: { challengeId: 'c1', code: '1111' },
          }),
        );

        confirmPayment().subscribe((action) => {
          expect(action).toEqual(
            PaybillActions.setPaymentStep({ step: 'SUCCESS' }),
          );
        });
      });
    });
  });
});
