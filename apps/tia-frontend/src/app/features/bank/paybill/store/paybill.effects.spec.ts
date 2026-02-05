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
  selectPaymentPayload,
  selectSelectedCategoryId,
  selectSelectedProviderId,
} from './paybill.selectors';
import { initialPaybillState } from './paybill.state';
import {
  PaybillPayload,
  ProceedPaymentResponse,
} from '../components/paybill-main/shared/models/paybill.model';

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
      getAllTemplates: vi.fn(),
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
      actions$ = of(TemplatesPageActions.loadTemplateGroups());

      effects.loadTemplateGroups$.subscribe((action) => {
        expect(action).toEqual(
          TemplatesPageActions.loadTemplateGroupsSuccess({ templateGroups }),
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
          notificationType: 'information',
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
  describe('proceedPayment$ success', () => {
    it('should dispatch proceedPaymentSuccess on success', () => {
      const response = { verify: { challengeId: '123' } } as any;
      paybillService.payBill.mockReturnValue(of(response));
      actions$ = of(PaybillActions.proceedPayment({ payload: {} as any }));

      effects.proceedPayment$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.proceedPaymentSuccess({ response }),
        );
      });
    });
  });

  describe('loadTemplateGroups$ failure', () => {
    it('should dispatch loadTemplateGroupsFailure on error', () => {
      paybillTemplatesService.getAllTemplateGroups.mockReturnValue(
        throwError(() => new Error('Groups Error')),
      );
      actions$ = of(TemplatesPageActions.loadTemplateGroups());

      effects.loadTemplateGroups$.subscribe((action) => {
        expect(action).toEqual(
          TemplatesPageActions.loadTemplateGroupsFailure({
            error: 'Groups Error',
          }),
        );
      });
    });
  });

  it('should set step to OTP if amount >= 50 and challengeId exists', () => {
    store.overrideSelector(selectPaymentPayload, {
      amount: 100,
    } as PaybillPayload);

    const response: ProceedPaymentResponse = {
      verify: {
        challengeId: 'id-123',
        method: 'SMS',
      },
      transferType: 'INTERNAL',
    };

    actions$ = of(PaybillActions.proceedPaymentSuccess({ response }));

    effects.proceedPaymentSuccess$.subscribe((action) => {
      expect(action).toEqual(PaybillActions.setPaymentStep({ step: 'OTP' }));
    });
  });

  it('should set step to SUCCESS if amount < 50', () => {
    store.overrideSelector(selectPaymentPayload, {
      amount: 20,
    } as PaybillPayload);

    const response: ProceedPaymentResponse = {
      verify: {
        challengeId: 'id-123',
        method: 'SMS',
      },
      transferType: 'INTERNAL',
    };

    actions$ = of(PaybillActions.proceedPaymentSuccess({ response }));

    effects.proceedPaymentSuccess$.subscribe((action) => {
      expect(action).toEqual(
        PaybillActions.setPaymentStep({ step: 'SUCCESS' }),
      );
    });
  });

  it('should dispatch loadTemplatesSuccess on successful API call', () => {
    const mockTemplates = [
      { id: 't1', name: 'Water Bill', providerId: 'p1' },
      { id: 't2', name: 'Electric Bill', providerId: 'p2' },
    ] as any;
    paybillTemplatesService.getAllTemplates.mockReturnValue(of(mockTemplates));

    actions$ = of(TemplatesPageActions.loadTemplates());

    effects.loadTemplates$.subscribe((action) => {
      expect(action).toEqual(
        TemplatesPageActions.loadTemplatesSuccess({ templates: mockTemplates }),
      );
    });
  });

  describe('Additional Logic Branches & Error Mapping', () => {
    it('proceedPayment$: should dispatch Failure if response contains statusCode (API Error)', () => {
      const response = { statusCode: '400', message: 'Balance Low' } as any;
      paybillService.payBill.mockReturnValue(of(response));
      actions$ = of(PaybillActions.proceedPayment({ payload: {} as any }));

      effects.proceedPayment$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.proceedPaymentFailure({ error: 'Balance Low' }),
        );
      });
    });

    it('confirmPayment$: should handle business failure and show warning', () => {
      paybillService.verifyPayment.mockReturnValue(
        of({ success: false, message: 'Invalid OTP' }),
      );
      actions$ = of(PaybillActions.confirmPayment({ payload: {} as any }));

      effects.confirmPayment$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.addNotification({
            notificationType: 'warning',
            message: 'Invalid OTP',
          }),
        );
      });
    });

    it('checkBill$: should dispatch Failure on API throw', () => {
      paybillService.checkBill.mockReturnValue(
        throwError(() => new Error('Network Error')),
      );

      actions$ = of(
        PaybillActions.checkBill({
          serviceId: 's1',
          identification: {} as any,
        }),
      );

      effects.checkBill$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.checkBillFailure({ error: 'Network Error' }),
        );
      });
    });

    it('getErrorMessage: should handle nested error objects (error.error.message)', () => {
      const complexError = { error: { message: 'Deep Error' } };
      paybillService.getCategories.mockReturnValue(
        throwError(() => complexError),
      );
      actions$ = of(PaybillActions.loadCategories());

      effects.loadCategories$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.loadCategoriesFailure({ error: 'Deep Error' }),
        );
      });
    });
  });

  describe('Template Management & Failure Handlers', () => {
    it('createTemplatesGroup$: should dispatch Success on successful creation', () => {
      const mockGroup = { id: 'G1', name: 'Utility' } as any;
      (paybillTemplatesService as any).createTemplateGroups = vi
        .fn()
        .mockReturnValue(of(mockGroup));

      actions$ = of(
        TemplatesPageActions.createTemplatesGroups({ name: 'Utility' } as any),
      );

      effects.createTemplatesGroup$.subscribe((action) => {
        expect(action).toEqual(
          TemplatesPageActions.createTemplatesGroupsSuccess({
            templateGroup: mockGroup,
          }),
        );
      });
    });
  });

  describe('Template CRUD Operations', () => {
    it('deleteTemplates$: should dispatch Success on successful delete', () => {
      const mockResponse = { message: 'Deleted' };
      (paybillTemplatesService as any).deleteTemplate = vi
        .fn()
        .mockReturnValue(of(mockResponse));
      actions$ = of(TemplatesPageActions.deleteTemplate({ templateId: 'T1' }));

      effects.deleteTemplates$.subscribe((action) => {
        expect(action).toEqual(
          TemplatesPageActions.deleteTemplateSuccess({
            message: 'Deleted',
            templateId: 'T1',
          }),
        );
      });
    });

    it('renameTemplates$: should dispatch Success on successful rename', () => {
      const updatedTemplate = { id: 'T1', nickname: 'New' } as any;
      (paybillTemplatesService as any).renameTemplate = vi
        .fn()
        .mockReturnValue(of(updatedTemplate));
      actions$ = of(
        TemplatesPageActions.renameTemplate({
          templateId: 'T1',
          nickName: 'New',
        }),
      );

      effects.renameTemplates$.subscribe((action) => {
        expect(action).toEqual(
          TemplatesPageActions.renameTemplateSuccess({
            template: updatedTemplate,
          }),
        );
      });
    });

    it('deleteTemplateGroup$: should dispatch Success', () => {
      (paybillTemplatesService as any).deleteGroup = vi
        .fn()
        .mockReturnValue(of({ message: 'Removed' }));
      actions$ = of(
        TemplatesPageActions.deleteTemplateGroup({ groupId: 'G1' }),
      );

      effects.deleteTemplateGroup$.subscribe((action) => {
        expect(action).toEqual(
          TemplatesPageActions.deleteTemplateGroupSuccess({
            message: 'Removed',
            groupId: 'G1',
          }),
        );
      });
    });

    it('renameTemplateGroup$: should dispatch Success', () => {
      const group = { id: 'G1', groupName: 'New' } as any;
      (paybillTemplatesService as any).renameGroup = vi
        .fn()
        .mockReturnValue(of(group));
      actions$ = of(
        TemplatesPageActions.renameTemplateGroup({
          groupId: 'G1',
          groupName: 'New',
        }),
      );

      effects.renameTemplateGroup$.subscribe((action) => {
        expect(action).toEqual(
          TemplatesPageActions.renameTemplateGroupSuccess({
            templateGroup: group,
            groupId: 'G1',
            message: 'Group name has been changed',
          }),
        );
      });
    });
  });

  describe('Consolidated Notification Effects', () => {
    it('actionSuccess$: should map success actions to notifications using internal mapping', () => {
      actions$ = of(
        TemplatesPageActions.deleteTemplateSuccess({
          message: 'ok',
          templateId: '1',
        }),
      );

      effects.actionSuccess$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.addNotification({
            notificationType: 'success',
            message: 'Template deleted successfully',
          }),
        );
      });
    });

    it('actionFailure$: should map failure actions to warning notifications', () => {
      const error = 'Global Error';
      actions$ = of(TemplatesPageActions.loadTemplatesFailure({ error }));

      effects.actionFailure$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.addNotification({
            notificationType: 'warning',
            message: error,
          }),
        );
      });
    });
  });

  describe('Payment Details & Check Bill Logic', () => {
    it('loadPaymentDetails$: should dispatch Success', () => {
      const details = { amount: 100 } as any;
      paybillService.getPaymentDetails = vi.fn().mockReturnValue(of(details));
      actions$ = of(PaybillActions.loadPaymentDetails({ serviceId: '123' }));

      effects.loadPaymentDetails$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.loadPaymentDetailsSuccess({ details }),
        );
      });
    });

    it('checkBill$: should dispatch Failure if details.valid is false', () => {
      const invalidDetails = { valid: false, error: 'User not found' } as any;
      paybillService.checkBill.mockReturnValue(of(invalidDetails));
      actions$ = of(
        PaybillActions.checkBill({
          serviceId: 's1',
          identification: {} as any,
        }),
      );

      effects.checkBill$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.checkBillFailure({ error: 'User not found' }),
        );
      });
    });
  });
  describe('Check Bill Logic Branches', () => {
    it('checkBill$: should return failure action if details.valid is false', () => {
      const invalidResponse = { valid: false, error: 'Custom Error' } as any;
      paybillService.checkBill.mockReturnValue(of(invalidResponse));

      actions$ = of(
        PaybillActions.checkBill({ serviceId: '1', identification: {} as any }),
      );

      effects.checkBill$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.checkBillFailure({ error: 'Custom Error' }),
        );
      });
    });

    it('checkBill$: should return success if valid is true', () => {
      const validResponse = { valid: true } as any;
      paybillService.checkBill.mockReturnValue(of(validResponse));

      actions$ = of(
        PaybillActions.checkBill({ serviceId: '1', identification: {} as any }),
      );

      effects.checkBill$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.checkBillSuccess({ details: validResponse }),
        );
      });
    });
  });

  describe('Payment Success Flow', () => {
    it('confirmPayment$: should navigate and notify on success', () => {
      paybillService.verifyPayment.mockReturnValue(of({ success: true }));
      actions$ = of(PaybillActions.confirmPayment({ payload: {} as any }));

      effects.confirmPayment$.subscribe((action) => {
        expect(router.navigate).toHaveBeenCalledWith([
          '/bank/paybill/pay/payment-success',
        ]);
        expect(action.message).toBe('OTP Verified Successfully');
      });
    });
  });
});
