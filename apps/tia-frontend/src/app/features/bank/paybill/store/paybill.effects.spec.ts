import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi, Mocked } from 'vitest';

import { PaybillEffect } from './paybill.effects';
import { PaybillActions, TemplatesPageActions } from './paybill.actions';
import { PaybillService } from '../services/paybill/paybill-service';
import { PaybillTemplatesService } from '../components/paybill-templates/services/paybill-templates-service';
import {
  selectSelectedCategoryId,
  selectSelectedProviderId,
} from './paybill.selectors';

describe('PaybillEffect', () => {
  let actions$: Observable<Action>;
  let effects: PaybillEffect;
  let store: MockStore;
  let paybillService: Mocked<PaybillService>;
  let paybillTemplatesService: Mocked<PaybillTemplatesService>;
  let router: Mocked<Router>;

  beforeEach(() => {
    const paybillServiceMock = {
      getCategories: vi.fn(),
      getProviders: vi.fn(),
      checkBill: vi.fn(),
      payBill: vi.fn(),
      verifyPayment: vi.fn(),
    };

    const routerMock = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        PaybillEffect,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: PaybillService, useValue: paybillServiceMock },
        {
          provide: PaybillTemplatesService,
          useValue: { getAllTemplateGroups: vi.fn() },
        },
        { provide: Router, useValue: routerMock },
      ],
    });

    effects = TestBed.inject(PaybillEffect);
    store = TestBed.inject(MockStore);
    paybillService = TestBed.inject(PaybillService) as Mocked<PaybillService>;
    paybillTemplatesService = TestBed.inject(
      PaybillTemplatesService,
    ) as Mocked<PaybillTemplatesService>;

    router = TestBed.inject(Router) as Mocked<Router>;
  });

  describe('loadCategories$', () => {
    it('should dispatch loadCategoriesSuccess on success', () => {
      const categories = [{ id: '1', name: 'Utility' }] as any;
      paybillService.getCategories.mockReturnValue(of(categories));
      actions$ = of(PaybillActions.loadCategories());

      effects.loadCategories$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.loadCategoriesSuccess({ categories }),
        );
      });
    });

    it('should dispatch loadCategoriesFailure on error', () => {
      paybillService.getCategories.mockReturnValue(
        throwError(() => new Error('Server Error')),
      );
      actions$ = of(PaybillActions.loadCategories());

      effects.loadCategories$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.loadCategoriesFailure({ error: 'Server Error' }),
        );
      });
    });
  });

  describe('checkBill$', () => {
    it('should dispatch checkBillSuccess on success', () => {
      const details = { valid: true, amount: 100 } as any;
      paybillService.checkBill.mockReturnValue(of(details));
      actions$ = of(
        PaybillActions.checkBill({ serviceId: 's1', accountNumber: '123' }),
      );

      effects.checkBill$.subscribe((action) => {
        expect(action).toEqual(PaybillActions.checkBillSuccess({ details }));
      });
    });
  });

  describe('proceedPayment$', () => {
    it('should dispatch proceedPaymentSuccess on success', () => {
      const response = { verify: { challengeId: 'chal-1' } } as any;
      paybillService.payBill.mockReturnValue(of(response));
      actions$ = of(PaybillActions.proceedPayment({ payload: {} as any }));

      effects.proceedPayment$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.proceedPaymentSuccess({ response }),
        );
      });
    });
  });

  describe('handleProceedSuccess$', () => {
    it('should set step to OTP if challengeId exists', () => {
      const response = { verify: { challengeId: 'chal-1' } } as any;
      actions$ = of(PaybillActions.proceedPaymentSuccess({ response }));

      effects.handleProceedSuccess$.subscribe((action) => {
        expect(action).toEqual(PaybillActions.setPaymentStep({ step: 'OTP' }));
      });
    });

    it('should set step to SUCCESS if challengeId does not exist', () => {
      const response = { verify: null } as any;
      actions$ = of(PaybillActions.proceedPaymentSuccess({ response }));

      effects.handleProceedSuccess$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.setPaymentStep({ step: 'SUCCESS' }),
        );
      });
    });
  });

  describe('confirmPayment$', () => {
    it('should set step to SUCCESS on successful verification', () => {
      paybillService.verifyPayment.mockReturnValue(of({}));
      actions$ = of(PaybillActions.confirmPayment({ payload: {} as any }));

      effects.confirmPayment$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.setPaymentStep({ step: 'SUCCESS' }),
        );
      });
    });
  });

  describe('Navigation Effects', () => {
    it('should navigate to category path on selectCategory (not TEMPLATES)', () => {
      actions$ = of(PaybillActions.selectCategory({ categoryId: 'UTILITIES' }));

      effects.selectCategoryNavigation$.subscribe();

      expect(router.navigate).toHaveBeenCalledWith([
        '/bank/paybill/pay',
        'utilities',
      ]);
    });

    it('should NOT navigate on selectCategory if categoryId is TEMPLATES', () => {
      actions$ = of(PaybillActions.selectCategory({ categoryId: 'TEMPLATES' }));

      effects.selectCategoryNavigation$.subscribe();

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to provider path on selectProvider', () => {
      store.overrideSelector(selectSelectedCategoryId, 'utilities');
      actions$ = of(PaybillActions.selectProvider({ providerId: 'p1' }));

      effects.selectProviderNavigation$.subscribe();

      expect(router.navigate).toHaveBeenCalledWith([
        '/bank/paybill/pay',
        'utilities',
        'p1',
      ]);
    });

    it('should navigate to base pay path on clearSelection', () => {
      actions$ = of(PaybillActions.clearSelection());

      effects.clearSelectionNavigation$.subscribe();

      expect(router.navigate).toHaveBeenCalledWith(['/bank/paybill/pay']);
    });
  });

  it('should dispatch loadTemplatesSuccess on success', () => {
    const templateGroups = [{ id: 'g1' }] as any;
    paybillTemplatesService.getAllTemplateGroups.mockReturnValue(
      of(templateGroups),
    );
    actions$ = of(TemplatesPageActions.loadTemplates());

    effects.loadTemplateGroups$.subscribe((action) => {
      expect(action).toEqual(
        TemplatesPageActions.loadTemplatesSuccess({ templateGroups }),
      );
    });
  });

  it('should dispatch selectProvider if providerId exists', () => {
    store.overrideSelector(selectSelectedProviderId, 'p1');
    actions$ = of(
      PaybillActions.loadProvidersSuccess({ providers: [{ id: 'p1' }] as any }),
    );

    effects.autoSelectProviderAfterLoad$.subscribe((action) => {
      expect(action).toEqual(
        PaybillActions.selectProvider({ providerId: 'p1' }),
      );
    });
  });
});
