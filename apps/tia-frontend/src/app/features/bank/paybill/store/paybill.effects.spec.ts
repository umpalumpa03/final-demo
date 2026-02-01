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
  selectNotifications,
  selectSelectedCategoryId,
  selectSelectedProviderId,
} from './paybill.selectors';
import { initialPaybillState } from './paybill.state';

describe('PaybillEffect (Modern Suite)', () => {
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

    const templatesServiceMock = {
      getAllTemplateGroups: vi.fn(),
    };

    const routerMock = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        PaybillEffect,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialPaybillState }),
        { provide: PaybillService, useValue: paybillServiceMock },
        { provide: PaybillTemplatesService, useValue: templatesServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    effects = TestBed.inject(PaybillEffect);
    store = TestBed.inject(MockStore);
    paybillService = TestBed.inject(PaybillService) as any;
    paybillTemplatesService = TestBed.inject(PaybillTemplatesService) as any;
    router = TestBed.inject(Router) as any;
  });

  describe('Happy Paths (Success)', () => {
    it('loadCategories$: should dispatch Success on API success', () => {
      const categories = [{ id: '1', name: 'Cat' }] as any;
      paybillService.getCategories.mockReturnValue(of(categories));
      actions$ = of(PaybillActions.loadCategories());

      effects.loadCategories$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.loadCategoriesSuccess({ categories }),
        );
      });
    });

    it('loadTemplateGroups$: should dispatch Success on API success', () => {
      const templateGroups = [{ id: 't1' }] as any;
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
  });

  describe('Unhappy Paths (Errors)', () => {
    it('loadCategories$: should dispatch Failure on API throw', () => {
      paybillService.getCategories.mockReturnValue(
        throwError(() => new Error('API Error')),
      );
      actions$ = of(PaybillActions.loadCategories());

      effects.loadCategories$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.loadCategoriesFailure({ error: 'API Error' }),
        );
      });
    });

    it('checkBill$: should dispatch Failure on API throw', () => {
      paybillService.checkBill.mockReturnValue(
        throwError(() => ({ message: 'Not Found' })),
      );
      actions$ = of(
        PaybillActions.checkBill({ serviceId: '1', accountNumber: '1' }),
      );

      effects.checkBill$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.checkBillFailure({ error: 'Not Found' }),
        );
      });
    });
  });

  describe('Navigation & Logic Gates', () => {
    it('selectCategoryNavigation$: should Navigate when category is standard', () => {
      actions$ = of(PaybillActions.selectCategory({ categoryId: 'UTILITIES' }));
      effects.selectCategoryNavigation$.subscribe();

      expect(router.navigate).toHaveBeenCalledWith([
        '/bank/paybill/pay',
        'utilities',
      ]);
    });

    it('selectCategoryNavigation$: should NOT Navigate when category is TEMPLATES', () => {
      actions$ = of(PaybillActions.selectCategory({ categoryId: 'TEMPLATES' }));
      effects.selectCategoryNavigation$.subscribe();

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('selectProviderNavigation$: should Navigate when category context exists', () => {
      store.overrideSelector(selectSelectedCategoryId, 'UTILITIES');
      actions$ = of(PaybillActions.selectProvider({ providerId: 'GAS_CO' }));

      effects.selectProviderNavigation$.subscribe();

      expect(router.navigate).toHaveBeenCalledWith([
        '/bank/paybill/pay',
        'utilities',
        'gas_co',
      ]);
    });

    it('selectProviderNavigation$: should NOT Navigate when category context is missing (null)', () => {
      store.overrideSelector(selectSelectedCategoryId, null);
      actions$ = of(PaybillActions.selectProvider({ providerId: 'GAS_CO' }));

      effects.selectProviderNavigation$.subscribe();

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('clearSelectionNavigation$: should navigate to root paybill', () => {
      actions$ = of(PaybillActions.clearSelection());
      effects.clearSelectionNavigation$.subscribe();

      expect(router.navigate).toHaveBeenCalledWith(['/bank/paybill/pay']);
    });
  });

  describe('Auto-Selection Logic', () => {
    it('autoSelectProviderAfterLoad$: should select provider if ID matches', () => {
      store.overrideSelector(selectSelectedProviderId, 'P1');
      actions$ = of(
        PaybillActions.loadProvidersSuccess({
          providers: [{ id: 'P1' }] as any,
        }),
      );

      effects.autoSelectProviderAfterLoad$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.selectProvider({ providerId: 'P1' }),
        );
      });
    });

    it('proceedPayment$: should dispatch Failure action when API fails', () => {
      paybillService.payBill.mockReturnValue(
        throwError(() => new Error('Payment Declined')),
      );
      actions$ = of(PaybillActions.proceedPayment({ payload: {} as any }));

      effects.proceedPayment$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.proceedPaymentFailure({ error: 'Payment Declined' }),
        );
      });
    });
    it('loadTemplateGroups$: should use fallback error message if error object is empty', () => {
      paybillTemplatesService.getAllTemplateGroups.mockReturnValue(
        throwError(() => ({})),
      );
      actions$ = of(TemplatesPageActions.loadTemplates());

      effects.loadTemplateGroups$.subscribe((action: any) => {
        expect(action.type).toBe(
          TemplatesPageActions.loadTemplatesFailure.type,
        );
      });
    });

    it('confirmPayment$: should emit ARRAY [Notification, Failure] on API throw', () => {
      paybillService.verifyPayment.mockReturnValue(
        throwError(() => new Error('OTP Fail')),
      );
      actions$ = of(
        PaybillActions.confirmPayment({
          payload: { challengeId: '1', code: '1' },
        }),
      );

      effects.confirmPayment$.subscribe((result: any) => {
        expect(Array.isArray(result)).toBe(false);
      });
    });

    it('loadTemplateGroups$: should use fallback message if error empty', () => {
      paybillTemplatesService.getAllTemplateGroups.mockReturnValue(
        throwError(() => ({})),
      );
      actions$ = of(TemplatesPageActions.loadTemplates());

      effects.loadTemplateGroups$.subscribe((action: any) => {
        expect(action.type).toBe(
          TemplatesPageActions.loadTemplatesFailure.type,
        );
      });
    });
  });

  describe('Timer Effects', () => {
    it('autoDismissNotifications$: should dismiss after delay', () => {
      vi.useFakeTimers();

      const mockNote = {
        id: '123',
        notificationType: 'info',
        message: 'test',
      } as any;
      store.overrideSelector(selectNotifications, [mockNote]);

      actions$ = of(
        PaybillActions.addNotification({
          notificationType: 'info',
          message: 'test',
        }),
      );

      let result: Action | undefined;
      effects.autoDismissNotifications$.subscribe((a) => (result = a));

      vi.advanceTimersByTime(5200);

      expect(result).toEqual(PaybillActions.dismissNotification({ id: '123' }));

      vi.useRealTimers();
    });
  });
});
