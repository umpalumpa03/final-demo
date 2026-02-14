import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  Mocked,
  afterEach,
} from 'vitest';

import { PaybillEffect } from './paybill.effects';
import { PaybillActions, TemplatesPageActions } from './paybill.actions';
import { PaybillService } from '../services/paybill/paybill-service';
import { PaybillTemplatesService } from '../components/paybill-templates/services/paybill-templates-service';
import {
  selectCategories,
  selectCategoriesLoaded,
  selectNotifications,
  selectPaymentPayload,
  selectProviders,
  selectSelectedCategoryId,
  selectSelectedProviderId,
  selectTemplatesGroup,
  selectTemplatesLoaded,
} from './paybill.selectors';
import { initialPaybillState } from './paybill.state';
import {
  PaybillPayload,
  ProceedPaymentResponse,
} from '../components/paybill-main/shared/models/paybill.model';
import { selectTransactionToRepeat } from 'apps/tia-frontend/src/app/store/transactions/transactions.selector';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { TransactionActions } from 'apps/tia-frontend/src/app/store/transactions/transactions.actions';

describe('PaybillEffect (Refactored)', () => {
  let actions$: Observable<Action>;
  let effects: PaybillEffect;
  let store: MockStore;
  let paybillService: Mocked<PaybillService>;
  let paybillTemplatesService: Mocked<PaybillTemplatesService>;
  let router: Mocked<Router>;
  let alertService: Mocked<AlertService>;
  let translate: Mocked<TranslateService>;

  beforeEach(() => {
    const paybillServiceMock = {
      getCategories: vi.fn(),
      getProviders: vi.fn(),
      checkBill: vi.fn(),
      payBill: vi.fn(),
      verifyPayment: vi.fn(),
      getPaymentDetails: vi.fn(),
      createTemplate: vi.fn(),
    };

    const templatesServiceMock = {
      getAllTemplateGroups: vi.fn(),
      getAllTemplates: vi.fn(),
      createTemplateGroups: vi.fn(),
      deleteTemplate: vi.fn(),
      renameTemplate: vi.fn(),
      deleteGroup: vi.fn(),
      renameGroup: vi.fn(),
      removeTemplateFromGroup: vi.fn(),
      addTemplateToGroup: vi.fn(),
      payManyBills: vi.fn(),
    };

    const routerMock = {
      navigate: vi.fn(),
      events: of(),
      url: '/bank/paybill/pay',
    };

    const alertServiceMock = { success: vi.fn(), error: vi.fn() };
    const translateMock = {
      instant: vi.fn((key: string) => key),
    };

    TestBed.configureTestingModule({
      providers: [
        PaybillEffect,
        provideMockActions(() => actions$),

        provideMockStore({
          initialState: { paybill: initialPaybillState },
        }),
        { provide: PaybillService, useValue: paybillServiceMock },
        { provide: PaybillTemplatesService, useValue: templatesServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: AlertService, useValue: alertServiceMock },
        { provide: TranslateService, useValue: translateMock },
      ],
    });

    effects = TestBed.inject(PaybillEffect);
    store = TestBed.inject(MockStore);
    paybillService = TestBed.inject(PaybillService) as any;
    paybillTemplatesService = TestBed.inject(PaybillTemplatesService) as any;
    router = TestBed.inject(Router) as any;
    alertService = TestBed.inject(AlertService) as any;
    translate = TestBed.inject(TranslateService) as any;

    store.overrideSelector(selectCategoriesLoaded, false);
    store.overrideSelector(selectTemplatesLoaded, false);
    store.overrideSelector(selectTemplatesGroup, []);
    store.overrideSelector(selectSelectedProviderId, null);
    store.overrideSelector(selectPaymentPayload, null);
    store.overrideSelector(selectNotifications, []);
    store.overrideSelector(selectProviders, []);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('Happy Paths (Success)', () => {
    it('loadCategories$: should dispatch Success on API success', () => {
      const categories = [{ id: '1', name: 'Cat' }] as any;
      paybillService.getCategories.mockReturnValue(of(categories));
      actions$ = of(PaybillActions.loadCategories());

      store.overrideSelector(selectCategoriesLoaded, false);

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
      store.overrideSelector(selectTemplatesGroup, []);

      effects.loadTemplateGroups$.subscribe((action) => {
        expect(action).toEqual(
          TemplatesPageActions.loadTemplateGroupsSuccess({ templateGroups }),
        );
      });
    });

    it('loadTemplates$: should dispatch Success on API success', () => {
      const templates = [{ id: 't1' }] as any;
      paybillTemplatesService.getAllTemplates.mockReturnValue(of(templates));
      actions$ = of(TemplatesPageActions.loadTemplates());
      store.overrideSelector(selectTemplatesLoaded, false);

      effects.loadTemplates$.subscribe((action) => {
        expect(action).toEqual(
          TemplatesPageActions.loadTemplatesSuccess({ templates }),
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
      store.overrideSelector(selectCategoriesLoaded, false);

      effects.loadCategories$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.loadCategoriesFailure({ error: 'API Error' }),
        );
      });
    });

    it('loadProviders$: should dispatch Failure on API throw', () => {
      paybillService.getProviders.mockReturnValue(
        throwError(() => new Error('Provider Error')),
      );
      actions$ = of(PaybillActions.selectCategory({ categoryId: '123' }));

      effects.loadProviders$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.loadProvidersFailure({ error: 'Provider Error' }),
        );
      });
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
  });

  describe('Verification & Payment Flow', () => {
    it('confirmPayment$: should navigate and emit success actions on success', () => {
      paybillService.verifyPayment.mockReturnValue(
        of({ success: true, message: 'Verified' }),
      );
      actions$ = of(
        PaybillActions.confirmPayment({
          payload: { challengeId: '1', code: '1' },
        }),
      );

      const results: any[] = [];
      effects.confirmPayment$.subscribe((a) => results.push(a));

      expect(router.navigate).toHaveBeenCalledWith([
        '/bank/paybill/pay/payment-success',
      ]);
      expect(results).toContainEqual(PaybillActions.confirmPaymentSuccess());
      expect(results).toContainEqual(
        TransactionActions.loadTransactions({ forceRefresh: true }),
      );
    });

    it('confirmPayment$: should dispatch confirmPaymentFailure on business failure', () => {
      paybillService.verifyPayment.mockReturnValue(
        of({ success: false, message: 'Invalid OTP' }),
      );
      actions$ = of(PaybillActions.confirmPayment({ payload: {} as any }));

      effects.confirmPayment$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.confirmPaymentFailure({
            error: 'Invalid OTP',
          }),
        );
      });
    });

    it('proceedPaymentSuccess$: should navigate to OTP if amount > 50', () => {
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

      effects.proceedPaymentSuccess$.subscribe(() => {});

      expect(router.navigate).toHaveBeenCalledWith([
        '/bank/paybill/pay/otp-verification',
      ]);
    });

    it('proceedPaymentSuccess$: should auto-confirm if amount <= 50', () => {
      store.overrideSelector(selectPaymentPayload, {
        amount: 20,
      } as PaybillPayload);

      const response: ProceedPaymentResponse = {
        verify: { challengeId: 'id-123', method: 'SMS' },
        transferType: 'INTERNAL',
      };

      actions$ = of(PaybillActions.proceedPaymentSuccess({ response }));

      effects.proceedPaymentSuccess$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.confirmPayment({
            payload: { challengeId: 'id-123', code: '6767' },
          }),
        );
      });
    });
  });

  describe('Template Management', () => {
    it('createTemplatesGroup$: should dispatch Success', () => {
      const mockGroup = { id: 'G1', name: 'Utility' } as any;
      paybillTemplatesService.createTemplateGroups.mockReturnValue(
        of(mockGroup),
      );

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

    it('deleteTemplates$: should dispatch Success', () => {
      paybillTemplatesService.deleteTemplate.mockReturnValue(
        of({ message: 'Deleted' }),
      );
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

    it('renameTemplates$: should dispatch Success', () => {
      const updatedTemplate = { id: 'T1', nickname: 'New' } as any;
      paybillTemplatesService.renameTemplate.mockReturnValue(
        of(updatedTemplate),
      );
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

    it('moveTemplate$: should remove then add to group (Move Success)', () => {
      paybillTemplatesService.removeTemplateFromGroup.mockReturnValue(of());
      paybillTemplatesService.addTemplateToGroup.mockReturnValue(of());

      actions$ = of(
        TemplatesPageActions.moveTemplate({ groupId: 'G1', templateId: 'T1' }),
      );

      effects.moveTemplate$.subscribe((action) => {
        expect(action).toEqual(
          TemplatesPageActions.moveTemplateSuccess({
            message: 'Item moved successfully',
            groupId: 'G1',
            templateId: 'T1',
          }),
        );
      });
    });

    it('moveTemplate$: should only remove if groupId is null', () => {
      paybillTemplatesService.removeTemplateFromGroup.mockReturnValue(of());

      actions$ = of(
        TemplatesPageActions.moveTemplate({ groupId: null, templateId: 'T1' }),
      );

      effects.moveTemplate$.subscribe((action) => {
        expect(action).toEqual(
          TemplatesPageActions.moveTemplateSuccess({
            message: 'Item removed successfully',
            groupId: null,
            templateId: 'T1',
          }),
        );
      });
    });
  });

  describe('Check Bill Logic', () => {
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

  describe('Notification Mapping', () => {
    it('actionSuccess$: should call alertService.success', () => {
      actions$ = of(PaybillActions.confirmPaymentSuccess());

      effects.actionSuccess$.subscribe();

      expect(alertService.success).toHaveBeenCalled();
    });

    it('actionFailure$: should call alertService.error for failure actions', () => {
      const error = 'Global Error';

      actions$ = of(TemplatesPageActions.loadTemplatesFailure({ error }));

      effects.actionFailure$.subscribe();

      expect(alertService.error).toHaveBeenCalled();
    });
  });

  describe('Create Template', () => {
    it('createTemplate$: should dispatch success', () => {
      const response = { message: 'Created' };
      paybillService.createTemplate.mockReturnValue(of(response));
      actions$ = of(
        TemplatesPageActions.createTemplate({
          serviceId: '1',
          identification: {} as any,
          nickname: 'nick',
        }),
      );

      effects.createTemplate$.subscribe((action) => {
        expect(action).toEqual(
          TemplatesPageActions.createTemplateSuccess({
            payload: response,
            message: 'Created',
          }),
        );
      });
    });
  });

  describe('checkBillAndCreateTemplate$', () => {
    it('should create template on successful bill check', () => {
      paybillService.checkBill.mockReturnValue(of({ valid: true } as any));

      actions$ = of(
        TemplatesPageActions.checkBillForTemplate({
          serviceId: 'S1',
          identification: {} as any,
          nickname: 'MyTemplate',
        }),
      );

      effects.checkBillAndCreateTemplate$.subscribe((action) => {
        expect(action).toEqual(
          TemplatesPageActions.createTemplate({
            nickname: 'MyTemplate',
            serviceId: 'S1',
            identification: {} as any,
          }),
        );
      });
    });

    it('should dispatch failure when bill check returns invalid', () => {
      paybillService.checkBill.mockReturnValue(
        of({ valid: false, error: 'Invalid bill' } as any),
      );

      actions$ = of(
        TemplatesPageActions.checkBillForTemplate({
          serviceId: 'S1',
          identification: {} as any,
          nickname: 'MyTemplate',
        }),
      );

      effects.checkBillAndCreateTemplate$.subscribe((action) => {
        expect(action).toEqual(
          TemplatesPageActions.checkBillForTemplateFailure({
            error: 'Invalid bill',
          }),
        );
      });
    });
  });

  describe('loadChildProviders$', () => {
    it('should load payment details when NO children exist', () => {
      store.overrideSelector(selectProviders, [{ id: 'P1' }] as any);

      actions$ = of(
        TemplatesPageActions.selectProvider({ providerId: 'P1', level: 0 }),
      );

      const results: any[] = [];
      effects.loadChildProviders$.subscribe((action) => {
        results.push(action);
      });

      expect(results).toHaveLength(3);
      expect(results[1]).toEqual(
        PaybillActions.loadPaymentDetails({ serviceId: 'P1' }),
      );
    });

    it('should only load child providers when children exist', () => {
      const allProviders = [
        { id: 'P1', parentId: null },
        { id: 'P2', parentId: 'P1' },
      ] as any;
      store.overrideSelector(selectProviders, allProviders);

      actions$ = of(
        TemplatesPageActions.selectProvider({ providerId: 'P1', level: 0 }),
      );

      const results: any[] = [];
      effects.loadChildProviders$.subscribe((action) => {
        results.push(action);
      });

      expect(results).toHaveLength(1);
    });
  });

  describe('loadPaymentDetails$', () => {
    it('should dispatch success on load', () => {
      const details = { serviceId: 'S1', fields: [] } as any;
      paybillService.getPaymentDetails.mockReturnValue(of(details));
      actions$ = of(PaybillActions.loadPaymentDetails({ serviceId: 'S1' }));

      effects.loadPaymentDetails$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.loadPaymentDetailsSuccess({ details }),
        );
      });
    });

    it('should dispatch failure on error', () => {
      paybillService.getPaymentDetails.mockReturnValue(
        throwError(() => new Error('Load failed')),
      );
      actions$ = of(PaybillActions.loadPaymentDetails({ serviceId: 'S1' }));

      effects.loadPaymentDetails$.subscribe((action) => {
        expect(action).toEqual(
          PaybillActions.loadPaymentDetailsFailure({ error: 'Load failed' }),
        );
      });
    });
  });
  describe('renameTemplateGroup$', () => {
    it('should dispatch success on rename', () => {
      const response = { id: 'G1', name: 'New Name' } as any;
      paybillTemplatesService.renameGroup.mockReturnValue(of(response));
      actions$ = of(
        TemplatesPageActions.renameTemplateGroup({
          groupId: 'G1',
          groupName: 'New Name',
        }),
      );

      effects.renameTemplateGroup$.subscribe((action) => {
        expect(action).toEqual(
          TemplatesPageActions.renameTemplateGroupSuccess({
            templateGroup: response,
            groupId: 'G1',
            message: 'Group name has been changed',
          }),
        );
      });
    });

    it('should dispatch failure on error', () => {
      paybillTemplatesService.renameGroup.mockReturnValue(
        throwError(() => new Error('Rename failed')),
      );
      actions$ = of(
        TemplatesPageActions.renameTemplateGroup({
          groupId: 'G1',
          groupName: 'New',
        }),
      );

      effects.renameTemplateGroup$.subscribe((action) => {
        expect(action).toEqual(
          TemplatesPageActions.renameTemplateGroupFailure({
            error: 'Rename failed',
          }),
        );
      });
    });
  });
  describe('deleteTemplateGroup$', () => {
    it('should dispatch success on delete', () => {
      paybillTemplatesService.deleteGroup.mockReturnValue(
        of({ message: 'Deleted' }),
      );
      actions$ = of(
        TemplatesPageActions.deleteTemplateGroup({ groupId: 'G1' }),
      );

      effects.deleteTemplateGroup$.subscribe((action) => {
        expect(action).toEqual(
          TemplatesPageActions.deleteTemplateGroupSuccess({
            message: 'Deleted',
            groupId: 'G1',
          }),
        );
      });
    });

    it('should dispatch failure on error', () => {
      paybillTemplatesService.deleteGroup.mockReturnValue(
        throwError(() => new Error('Delete failed')),
      );
      actions$ = of(
        TemplatesPageActions.deleteTemplateGroup({ groupId: 'G1' }),
      );

      effects.deleteTemplateGroup$.subscribe((action) => {
        expect(action).toEqual(
          TemplatesPageActions.deleteTemplateGroupFailure({
            error: 'Delete failed',
          }),
        );
      });
    });

    it('should use default "utilities" category if provider not found', () => {
      const mockTransaction = {
        amount: 50,
        meta: { serviceId: 'unknown-service', identification: '123' },
      };

      store.overrideSelector(selectTransactionToRepeat, mockTransaction as any);
      store.overrideSelector(selectCategories, []);

      actions$ = of(PaybillActions.initRepeatProcess());

      effects.hydrateFromRepeatTransaction$.subscribe();

      expect(router.navigate).toHaveBeenCalledWith([
        '/bank/paybill/pay',
        'utilities',
        'unknown-service',
      ]);
    });
  });

  describe('Hydrate and Child Provider Branches', () => {
    it('loadChildProviders$: should only dispatch loadChildProvidersSuccess if children exist', () => {
      const allProviders = [
        { id: 'PARENT', parentId: null },
        { id: 'CHILD', parentId: 'PARENT' },
      ] as any;

      store.overrideSelector(selectProviders, allProviders);

      actions$ = of(
        TemplatesPageActions.selectProvider({ providerId: 'PARENT', level: 0 }),
      );

      const results: any[] = [];
      effects.loadChildProviders$.subscribe((action) => results.push(action));

      expect(results).toHaveLength(1);
      expect(results[0].type).toBe(
        TemplatesPageActions.loadChildProvidersSuccess.type,
      );
    });

    it('getErrorMessage: should handle error.error.message structure', () => {
      const complexError = { error: { message: 'Deep Error' } };
      paybillService.getCategories.mockReturnValue(
        throwError(() => complexError),
      );

      actions$ = of(PaybillActions.loadCategories());

      effects.loadCategories$.subscribe((action: any) => {
        expect(action.error).toBe('Deep Error');
      });
    });
  });

  it('should dispatch payManyBillsSuccess and reload transactions', () => {
    const response = { success: true } as any;
    paybillTemplatesService.payManyBills.mockReturnValue(of(response));
    actions$ = of(TemplatesPageActions.payManyBills({ payments: [] }));

    const results: any[] = [];
    effects.payManyBill$.subscribe((a) => results.push(a));

    expect(results).toContainEqual(
      TemplatesPageActions.payManyBillsSuccess({ response }),
    );
    expect(results).toContainEqual(
      TransactionActions.loadTransactions({ forceRefresh: true }),
    );
  });

  it('should dispatch checkBillForTemplateFailure on API error', () => {
    const errorResponse = { error: 'Bulk payment failed' };
    paybillTemplatesService.payManyBills.mockReturnValue(
      throwError(() => errorResponse),
    );

    actions$ = of(TemplatesPageActions.payManyBills({ payments: [] }));

    effects.payManyBill$.subscribe((action) => {
      expect(action).toEqual(
        TemplatesPageActions.checkBillForTemplateFailure({
          error: 'Bulk payment failed',
        }),
      );
    });
  });

  it('moveTemplate$: should only remove if groupId is null', () => {
    paybillTemplatesService.removeTemplateFromGroup.mockReturnValue(of());

    actions$ = of(
      TemplatesPageActions.moveTemplate({ groupId: null, templateId: 'T1' }),
    );

    effects.moveTemplate$.subscribe((action) => {
      expect(action).toEqual(
        TemplatesPageActions.moveTemplateSuccess({
          message: 'Item removed successfully',
          groupId: null,
          templateId: 'T1',
        }),
      );
      expect(paybillTemplatesService.addTemplateToGroup).not.toHaveBeenCalled();
    });
  });

  describe('moveTemplate$', () => {
    const mockTemplate = {
      id: 'T1',
      nickname: 'Test',
      serviceId: 'S1',
      identification: {},
    } as any;

    it('should only remove from group when groupId is null (Branch A)', () => {
      paybillTemplatesService.removeTemplateFromGroup.mockReturnValue(
        of(mockTemplate),
      );

      actions$ = of(
        TemplatesPageActions.moveTemplate({ groupId: null, templateId: 'T1' }),
      );

      const results: any[] = [];
      effects.moveTemplate$.subscribe((action) => results.push(action));

      expect(results[0]).toEqual(
        TemplatesPageActions.moveTemplateSuccess({
          message: 'Item removed successfully',
          groupId: null,
          templateId: 'T1',
        }),
      );
      expect(paybillTemplatesService.addTemplateToGroup).not.toHaveBeenCalled();
    });

    it('should remove and then add when groupId is provided (Branch B)', () => {
      paybillTemplatesService.removeTemplateFromGroup.mockReturnValue(
        of(mockTemplate),
      );
      paybillTemplatesService.addTemplateToGroup.mockReturnValue(
        of(mockTemplate),
      );

      actions$ = of(
        TemplatesPageActions.moveTemplate({ groupId: 'G1', templateId: 'T1' }),
      );

      const results: any[] = [];
      effects.moveTemplate$.subscribe((action) => results.push(action));

      expect(results[0]).toEqual(
        TemplatesPageActions.moveTemplateSuccess({
          message: 'Item moved successfully',
          groupId: 'G1',
          templateId: 'T1',
        }),
      );
      expect(paybillTemplatesService.addTemplateToGroup).toHaveBeenCalledWith(
        'G1',
        'T1',
      );
    });

    it('should handle errors in the chain (Branch C)', () => {
      const errorResponse = { message: 'Move failed' };
      paybillTemplatesService.removeTemplateFromGroup.mockReturnValue(
        throwError(() => errorResponse),
      );

      actions$ = of(
        TemplatesPageActions.moveTemplate({ groupId: 'G1', templateId: 'T1' }),
      );

      const results: any[] = [];
      effects.moveTemplate$.subscribe((action) => results.push(action));

      expect(results[0]).toEqual(
        PaybillActions.loadPaymentDetailsFailure({
          error: 'Move failed',
        }),
      );
    });
  });
});
