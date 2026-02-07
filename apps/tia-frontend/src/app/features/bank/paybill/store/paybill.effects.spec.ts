import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi, Mocked, afterEach } from 'vitest';

import { PaybillEffect } from './paybill.effects';
import { PaybillActions, TemplatesPageActions } from './paybill.actions';
import { PaybillService } from '../services/paybill/paybill-service';
import { PaybillTemplatesService } from '../components/paybill-templates/services/paybill-templates-service';
import {
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

describe('PaybillEffect (Refactored)', () => {
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
    };

    const routerMock = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        PaybillEffect,
        provideMockActions(() => actions$),
        // FIXED: Wrap state in feature key 'paybill' to match selectors
        provideMockStore({ 
          initialState: { paybill: initialPaybillState } 
        }),
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

    // Default Overrides to prevent "undefined" errors in selectors
    store.overrideSelector(selectCategoriesLoaded, false);
    store.overrideSelector(selectTemplatesLoaded, false);
    store.overrideSelector(selectTemplatesGroup, false); // Assuming boolean based on filter
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

      // Override to ensure filter passes
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
      store.overrideSelector(selectTemplatesGroup, false);

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
    it('confirmPayment$: should emit success notification and navigate on success', () => {
      paybillService.verifyPayment.mockReturnValue(
        of({ success: true, message: 'Verified' }),
      );
      actions$ = of(
        PaybillActions.confirmPayment({
          payload: { challengeId: '1', code: '1' },
        }),
      );

      effects.confirmPayment$.subscribe((action) => {
        expect(router.navigate).toHaveBeenCalledWith(['/bank/paybill/pay/payment-success']);
        expect(action).toEqual(
          PaybillActions.addNotification({
            notificationType: 'success',
            message: 'OTP Verified Successfully',
          }),
        );
      });
    });

    it('confirmPayment$: should emit warning notification on business failure', () => {
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
      
      expect(router.navigate).toHaveBeenCalledWith(['/bank/paybill/pay/otp-verification']);
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
      paybillTemplatesService.createTemplateGroups.mockReturnValue(of(mockGroup));

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
      paybillTemplatesService.deleteTemplate.mockReturnValue(of({ message: 'Deleted' }));
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
      paybillTemplatesService.renameTemplate.mockReturnValue(of(updatedTemplate));
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
       paybillTemplatesService.removeTemplateFromGroup.mockReturnValue(of({}));
       paybillTemplatesService.addTemplateToGroup.mockReturnValue(of({}));
       
       actions$ = of(TemplatesPageActions.moveTemplate({ groupId: 'G1', templateId: 'T1' }));
       
       effects.moveTemplate$.subscribe((action) => {
         expect(action).toEqual(
           TemplatesPageActions.moveTemplateSuccess({
             message: 'Item moved successfully',
             groupId: 'G1',
             templateId: 'T1'
           })
         );
       });
    });

    it('moveTemplate$: should only remove if groupId is null', () => {
       paybillTemplatesService.removeTemplateFromGroup.mockReturnValue(of({}));
       
       actions$ = of(TemplatesPageActions.moveTemplate({ groupId: null, templateId: 'T1' }));
       
       effects.moveTemplate$.subscribe((action) => {
         expect(action).toEqual(
           TemplatesPageActions.moveTemplateSuccess({
             message: 'Item removed successfully',
             groupId: null,
             templateId: 'T1'
           })
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
    it('actionSuccess$: should map success actions to notifications', () => {
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
  
  describe('Create Template', () => {
      it('createTemplate$: should dispatch success', () => {
          const response = { message: 'Created' };
          paybillService.createTemplate.mockReturnValue(of(response));
          actions$ = of(TemplatesPageActions.createTemplate({ serviceId: '1', identification: {} as any, nickname: 'nick' }));
          
          effects.createTemplate$.subscribe(action => {
              expect(action).toEqual(
                  TemplatesPageActions.createTemplateSuccess({ 
                      payload: response, 
                      message: 'Created' 
                  })
              );
          });
      });
  });
});