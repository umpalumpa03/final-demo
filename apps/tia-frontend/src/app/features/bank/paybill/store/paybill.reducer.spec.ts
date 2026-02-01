import { describe, it, expect } from 'vitest';
import { paybillReducer } from './paybill.reducer';
import { initialPaybillState } from './paybill.state';
import { PaybillActions, TemplatesPageActions } from './paybill.actions';

describe('Paybill Reducer', () => {
  it('should return the initial state on unknown action', () => {
    const action = { type: 'Unknown' };
    const result = paybillReducer(initialPaybillState, action as any);
    expect(result).toBe(initialPaybillState);
  });

  describe('Categories', () => {
    it('loadCategories: should set loading true and clear error', () => {
      const state = { ...initialPaybillState, error: 'Old Error' };
      const action = PaybillActions.loadCategories();
      const result = paybillReducer(state, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('loadCategoriesSuccess: should set categories and stop loading', () => {
      const categories = [{ id: '1', name: 'Cat' }] as any;
      const action = PaybillActions.loadCategoriesSuccess({ categories });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.categories).toEqual(categories);
      expect(result.loading).toBe(false);
    });
  });

  it('selectCategory: should reset provider selection and set category ID', () => {
    const state = {
      ...initialPaybillState,
      selectedProviderId: 'p1',
      providers: [{ id: 'p1' }] as any,
    };
    const action = PaybillActions.selectCategory({ categoryId: 'CAT1' });
    const result = paybillReducer(state, action);

    expect(result.selectedCategoryId).toBe('CAT1');
    expect(result.selectedProviderId).toBeNull();
    expect(result.providers).toEqual([]);
    expect(result.loading).toBe(true);
  });

  describe('Providers', () => {
    it('loadProvidersSuccess: should update providers list', () => {
      const providers = [{ id: 'p1' }] as any;
      const action = PaybillActions.loadProvidersSuccess({ providers });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.providers).toEqual(providers);
      expect(result.loading).toBe(false);
    });

    it('loadProvidersFailure: should set error', () => {
      const action = PaybillActions.loadProvidersFailure({
        error: 'API Error',
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.error).toBe('API Error');
    });

    it('selectProvider: should find and set provider object if exists', () => {
      const providers = [{ id: 'p1', name: 'Found' }] as any;
      const state = { ...initialPaybillState, providers };
      const action = PaybillActions.selectProvider({ providerId: 'P1' });
      const result = paybillReducer(state, action);

      expect(result.selectedProviderId).toBe('P1');
      expect(result.selectedProvider).toEqual(providers[0]);
    });

    it('selectProvider: should set object to null if not found', () => {
      const state = { ...initialPaybillState, providers: [] };
      const action = PaybillActions.selectProvider({ providerId: 'Ghost' });
      const result = paybillReducer(state, action);

      expect(result.selectedProviderId).toBe('Ghost');
      expect(result.selectedProvider).toBeNull();
    });
  });

  describe('Check Bill', () => {
    it('checkBill: should set loading', () => {
      const action = PaybillActions.checkBill({
        serviceId: 's1',
        accountNumber: '123',
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(true);
    });

    it('checkBillSuccess: should set details and clear error if valid', () => {
      const details = { valid: true } as any;
      const action = PaybillActions.checkBillSuccess({ details });
      const result = paybillReducer(
        { ...initialPaybillState, error: 'err' },
        action,
      );
      expect(result.verifiedDetails).toBe(details);
      expect(result.error).toBeNull();
    });

    it('checkBillFailure: should set error', () => {
      const action = PaybillActions.checkBillFailure({ error: 'Net Error' });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.error).toBe('Net Error');
    });
  });

  describe('Payment Processing', () => {
    it('setPaymentStep: should update step', () => {
      const action = PaybillActions.setPaymentStep({ step: 'OTP' });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.currentStep).toBe('OTP');
    });

    it('setPaymentPayload: should update payload', () => {
      const data = { amount: 100 } as any;
      const action = PaybillActions.setPaymentPayload({ data });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.paymentPayload).toBe(data);
    });

    it('proceedPaymentSuccess: should handle missing challengeId gracefully', () => {
      const response = { verify: null } as any;
      const action = PaybillActions.proceedPaymentSuccess({ response });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.challengeId).toBeNull();
    });
  });

  it('loadTemplates: should set loading true', () => {
    const action = TemplatesPageActions.loadTemplates();
    const result = paybillReducer(initialPaybillState, action);

    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('loadTemplatesSuccess: should set templateGroups', () => {
    const templateGroups = [{ id: 'g1', name: 'Group 1' }] as any;
    const action = TemplatesPageActions.loadTemplatesSuccess({
      templateGroups,
    });
    const result = paybillReducer(initialPaybillState, action);

    expect(result.templateGroups).toEqual(templateGroups);
    expect(result.loading).toBe(false);
  });

  it('loadTemplatesFailure: should set error', () => {
    const action = TemplatesPageActions.loadTemplatesFailure({
      error: 'Load failed',
    });
    const result = paybillReducer(initialPaybillState, action);

    expect(result.error).toBe('Load failed');
    expect(result.loading).toBe(false);
  });

  it('proceedPayment: should set loading true', () => {
    const action = PaybillActions.proceedPayment({ payload: {} as any });
    const result = paybillReducer(initialPaybillState, action);

    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('proceedPaymentFailure: should set error', () => {
    const action = PaybillActions.proceedPaymentFailure({
      error: 'Payment failed',
    });
    const result = paybillReducer(initialPaybillState, action);

    expect(result.loading).toBe(false);
    expect(result.error).toBe('Payment failed');
  });
});
