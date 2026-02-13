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

  describe('Templates', () => {
    it('loadTemplates: should set loading true', () => {
      const action = TemplatesPageActions.loadTemplates();
      const result = paybillReducer(initialPaybillState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('loadTemplatesSuccess: should set templates', () => {
      const templates = [{ id: 't1', name: 'Template 1' }] as any;
      const action = TemplatesPageActions.loadTemplatesSuccess({ templates });
      const result = paybillReducer(initialPaybillState, action);

      expect(result.templates).toEqual(templates);
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
  });

  describe('Template Groups', () => {
    it('loadTemplateGroups: should set loading true', () => {
      const action = TemplatesPageActions.loadTemplateGroups();
      const result = paybillReducer(initialPaybillState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('loadTemplateGroupsSuccess: should set templateGroups', () => {
      const templateGroups = [{ id: 'g1', name: 'Group 1' }] as any;
      const action = TemplatesPageActions.loadTemplateGroupsSuccess({
        templateGroups,
      });
      const result = paybillReducer(initialPaybillState, action);

      expect(result.templateGroups).toEqual(templateGroups);
      expect(result.loading).toBe(false);
    });

    it('loadTemplateGroupsFailure: should set error', () => {
      const action = TemplatesPageActions.loadTemplateGroupsFailure({
        error: 'Load failed',
      });
      const result = paybillReducer(initialPaybillState, action);

      expect(result.error).toBe('Load failed');
      expect(result.loading).toBe(false);
    });
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

  it('should handle checkBillFailure', () => {
    const result = paybillReducer(
      initialPaybillState,
      PaybillActions.checkBillFailure({ error: 'Account not found' }),
    );
    expect(result.error).toBe('Account not found');
    expect(result.loading).toBe(false);
  });

  it('should handle proceedPaymentFailure', () => {
    const result = paybillReducer(
      initialPaybillState,
      PaybillActions.proceedPaymentFailure({ error: 'Insufficent funds' }),
    );
    expect(result.error).toBe('Insufficent funds');
    expect(result.loading).toBe(false);
  });

  it('should handle loadTemplatesFailure', () => {
    const result = paybillReducer(
      initialPaybillState,
      TemplatesPageActions.loadTemplatesFailure({ error: 'Auth failed' }),
    );
    expect(result.error).toBe('Auth failed');
    expect(result.loading).toBe(false);
  });

  describe('Select stuff', () => {
    it('selectProvider: should handle case-insensitive matching', () => {
      const providers = [{ id: 'UTILITY_ID', name: 'Test' }] as any;
      const state = { ...initialPaybillState, providers };
      const action = PaybillActions.selectProvider({
        providerId: 'utility_id',
      });
      const result = paybillReducer(state, action);

      expect(result.selectedProvider?.id).toBe('UTILITY_ID');
      expect(result.selectedProviderId).toBe('utility_id');
    });

    it('loadProvidersFailure: should stop loading and set error', () => {
      const action = PaybillActions.loadProvidersFailure({
        error: 'Server Down',
      });
      const result = paybillReducer(initialPaybillState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Server Down');
    });

    it('confirmPaymentFailure: should map error to state and stop loading', () => {
      const action = PaybillActions.confirmPaymentFailure({
        error: 'Invalid OTP',
      });
      const result = paybillReducer(initialPaybillState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Invalid OTP');
    });

    it('clearError: should set error to null', () => {
      const state = { ...initialPaybillState, error: 'Discard me' };
      const result = paybillReducer(state, PaybillActions.clearError());
      expect(result.error).toBeNull();
    });
  });

  describe('Notification Actions', () => {
    it('addNotification: should append a new notification with a timestamp ID', () => {
      const action = PaybillActions.addNotification({
        notificationType: 'success',
        message: 'Saved Successfully',
      });
      const result = paybillReducer(initialPaybillState, action);

      expect(result.notifications.length).toBe(1);
      expect(result.notifications[0].message).toBe('Saved Successfully');
      expect(result.notifications[0].id).toBeDefined();
    });

    it('dismissNotification: should remove the specific notification by ID', () => {
      const state = {
        ...initialPaybillState,
        notifications: [
          { id: '1', message: 'First', notificationType: 'info' },
          { id: '2', message: 'Second', notificationType: 'info' },
        ] as any,
      };
      const action = PaybillActions.dismissNotification({ id: '1' });
      const result = paybillReducer(state, action);

      expect(result.notifications.length).toBe(1);
      expect(result.notifications[0].id).toBe('2');
    });

    it('clearAllNotifications: should empty the notifications array', () => {
      const state = {
        ...initialPaybillState,
        notifications: [{ id: '1' }] as any,
        error: 'Some error',
      };

      const action = PaybillActions.clearAllNotifications();
      const result = paybillReducer(state, action);

      expect(result.notifications).toEqual([]);
      expect(result.error).toBeNull();
    });
  });

  describe('Template Management', () => {
    it('createTemplatesGroupsSuccess: should add new group to existing list', () => {
      const existingGroups = [{ id: 'g1' }] as any;
      const newGroup = { id: 'g2' } as any;
      const state = { ...initialPaybillState, templateGroups: existingGroups };

      const action = TemplatesPageActions.createTemplatesGroupsSuccess({
        templateGroup: newGroup,
      });
      const result = paybillReducer(state, action);

      expect(result.templateGroups.length).toBe(2);
      expect(result.templateGroups).toContain(newGroup);
      expect(result.loading).toBe(false);
    });
  });

  describe('Payment Form & Transaction Sync', () => {
    it('resetPaymentForm: should clear verification and step but keep provider', () => {
      const state = {
        ...initialPaybillState,
        verifiedDetails: { amount: 10 } as any,
        selectedProviderId: 'p1',
      };
      const action = PaybillActions.resetPaymentForm();
      const result = paybillReducer(state, action);

      expect(result.verifiedDetails).toBeNull();
      expect(result.selectedProviderId).toBe('p1');
    });

    it('setTransactionProvider: should set provider and try to infer category', () => {
      const provider = { id: 'p1', categoryId: 'CAT_LPG' } as any;
      const action = PaybillActions.setTransactionProvider({ provider });
      const result = paybillReducer(initialPaybillState, action);

      expect(result.selectedProvider).toEqual(provider);
      expect(result.selectedProviderId).toBe('p1');
      expect(result.selectedCategoryId).toBe('CAT_LPG');
    });

    it('clearSelection: should fully reset the paybill state machine', () => {
      const state = {
        ...initialPaybillState,
        selectedProviderId: 'p1',
        paymentPayload: { acc: '123' } as any,
      };
      const action = PaybillActions.clearSelection();
      const result = paybillReducer(state, action);

      expect(result.selectedProviderId).toBeNull();
      expect(result.paymentPayload).toBeNull();
      expect(result.providers).toEqual([]);
    });
  });

  describe('Additional Edge Cases', () => {
    it('checkBillSuccess: should set error if details object is invalid', () => {
      const details = { valid: false, error: 'Database mismatch' } as any;
      const action = PaybillActions.checkBillSuccess({ details });
      const result = paybillReducer(initialPaybillState, action);

      expect(result.error).toBe('Database mismatch');
      expect(result.loading).toBe(false);
    });

    it('checkBillSuccess: should provide default error message if details invalid and no error string provided', () => {
      const details = { valid: false } as any;
      const action = PaybillActions.checkBillSuccess({ details });
      const result = paybillReducer(initialPaybillState, action);

      expect(result.error).toBe('Invalid account');
    });
  });
  it('deleteTemplates: should set loading true', () => {
    const action = TemplatesPageActions.deleteTemplate({ templateId: 't1' });
    const result = paybillReducer(initialPaybillState, action);

    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('deleteTemplatesFailure: should set error and stop loading', () => {
    const action = TemplatesPageActions.deleteTemplateFailure({
      error: 'Delete Failed',
    });
    const result = paybillReducer(initialPaybillState, action);

    expect(result.loading).toBe(false);
    expect(result.error).toBe('Delete Failed');
  });

  describe('Paybill Reducer - State Modifications', () => {
    describe('Template Management Success', () => {
      it('deleteTemplateSuccess: should remove the template from the list', () => {
        const state = {
          ...initialPaybillState,
          templates: [{ id: 't1' }, { id: 't2' }] as any,
        };
        const action = TemplatesPageActions.deleteTemplateSuccess({
          templateId: 't1',
          message: 'Deleted',
        });
        const result = paybillReducer(state, action);

        expect(result.templates.length).toBe(1);
        expect(result.templates[0].id).toBe('t2');
        expect(result.loading).toBe(false);
      });

      it('renameTemplateSuccess: should update the nickname of the specific template', () => {
        const state = {
          ...initialPaybillState,
          templates: [
            { id: 't1', nickname: 'Old Name' },
            { id: 't2', nickname: 'Stay Same' },
          ] as any,
        };
        const updatedTemplate = { id: 't1', nickname: 'New Name' } as any;
        const action = TemplatesPageActions.renameTemplateSuccess({
          template: updatedTemplate,
        });
        const result = paybillReducer(state, action);

        expect(result.templates.find((t) => t.id === 't1')?.nickname).toBe(
          'New Name',
        );
        expect(result.templates.find((t) => t.id === 't2')?.nickname).toBe(
          'Stay Same',
        );
      });

      it('renameTemplateFailure: should stop loading and set error', () => {
        const action = TemplatesPageActions.renameTemplateFailure({
          error: 'Rename Error',
        });
        const result = paybillReducer(initialPaybillState, action);
        expect(result.error).toBe('Rename Error');
        expect(result.loading).toBe(false);
      });
    });

    describe('Template Group Management Success', () => {
      it('renameTemplateGroup: should set loading true', () => {
        const action = TemplatesPageActions.renameTemplateGroup({
          groupId: '1',
          groupName: 'n',
        });
        const result = paybillReducer(initialPaybillState, action);
        expect(result.loading).toBe(true);
      });
    });

    describe('Payment Details', () => {
      it('loadPaymentDetailsSuccess: should set details object', () => {
        const details = { amount: 500 } as any;
        const action = PaybillActions.loadPaymentDetailsSuccess({ details });
        const result = paybillReducer(initialPaybillState, action);

        expect(result.paymentDetails).toBe(details);
        expect(result.loading).toBe(false);
      });

      it('loadPaymentDetailsFailure: should set error', () => {
        const action = PaybillActions.loadPaymentDetailsFailure({
          error: 'Fail',
        });
        const result = paybillReducer(initialPaybillState, action);
        expect(result.error).toBe('Fail');
      });
    });
    it('renameTemplateGroupFailure: should handle failure and stop loading', () => {
      const action = TemplatesPageActions.renameTemplateGroupFailure({
        error: 'Group Rename Fail',
      });
      const result = paybillReducer(initialPaybillState, action);

      expect(result.error).toBe('Group Rename Fail');
      expect(result.loading).toBe(false);
    });

    it('loadTemplateGroupsFailure: should handle API error', () => {
      const action = TemplatesPageActions.loadTemplateGroupsFailure({
        error: 'Server Error',
      });
      const result = paybillReducer(initialPaybillState, action);

      expect(result.error).toBe('Server Error');
      expect(result.loading).toBe(false);
    });

    it('createTemplatesGroups: should set loading true', () => {
      const action = TemplatesPageActions.createTemplatesGroups({
        groupName: 'test',
        templateIds: [],
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(true);
    });

    it('createTemplatesGroupsFailure: should handle error', () => {
      const action = TemplatesPageActions.createTemplatesGroupsFailure({
        error: 'Create error',
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.error).toBe('Create error');
      expect(result.loading).toBe(false);
    });
  });
  it('should update the name of the correct group in the list', () => {
    const initialStateWithGroups = {
      ...initialPaybillState,
      templateGroups: [
        { id: 'group-1', groupName: 'Old Name' },
        { id: 'group-2', groupName: 'Other' },
      ] as any,
    };

    const action = TemplatesPageActions.renameTemplateGroupSuccess({
      templateGroup: { id: 'group-1', groupName: 'New Name' },
      groupId: 'group-1',
      message: 'Success',
    } as any);

    const result = paybillReducer(initialStateWithGroups, action);

    expect(
      result.templateGroups.find((g) => g.id === 'group-1')?.groupName,
    ).toBe('New Name');
    expect(result.loading).toBe(false);
  });

  it('should remove the group and ungroup its templates on deleteTemplateGroupSuccess', () => {
    const initialState = {
      ...initialPaybillState,
      templateGroups: [
        { id: 'group-123', groupName: 'Utilities' },
        { id: 'group-456', groupName: 'Other' },
      ] as any,
      templates: [
        { id: 'temp-1', nickname: 'Electric', groupId: 'group-123' },
        { id: 'temp-2', nickname: 'Water', groupId: 'group-456' },
      ] as any,
    };

    const action = TemplatesPageActions.deleteTemplateGroupSuccess({
      groupId: 'group-123',
    } as any);

    const result = paybillReducer(initialState, action);
    expect(result.templateGroups.length).toBe(1);
    expect(
      result.templateGroups.find((g) => g.id === 'group-123'),
    ).toBeUndefined();

    const temp1 = result.templates.find((t) => t.id === 'temp-1');
    expect(temp1?.groupId).toBeNull();

    const temp2 = result.templates.find((t) => t.id === 'temp-2');
    expect(temp2?.groupId).toBe('group-456');

    expect(result.loading).toBe(false);
  });

  describe('Template Movement & Creation', () => {
    it('moveTemplate: should set loading true', () => {
      const action = TemplatesPageActions.moveTemplate({
        templateId: 't1',
        groupId: 'g1',
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(true);
    });

    it('moveTemplateSuccess: should update the groupId of a specific template', () => {
      const state = {
        ...initialPaybillState,
        templates: [
          { id: 't1', groupId: 'old' },
          { id: 't2', groupId: 'other' },
        ] as any,
      };
      const action = TemplatesPageActions.moveTemplateSuccess({
        templateId: 't1',
        groupId: 'new-group',
      } as any);

      const result = paybillReducer(state, action);
      const moved = result.templates.find((t) => t.id === 't1');
      expect(moved?.groupId).toBe('new-group');
      expect(result.templates.find((t) => t.id === 't2')?.groupId).toBe(
        'other',
      );
    });

    it('createTemplateSuccess: should add new template to the list', () => {
      const state = {
        ...initialPaybillState,
        templates: [{ id: 't1' }] as any,
      };
      const newTemplate = { id: 't2', nickname: 'New' } as any;
      const action = TemplatesPageActions.createTemplateSuccess({
        payload: newTemplate,
        message: 'Success',
      } as any);

      const result = paybillReducer(state, action);
      expect(result.templates).toHaveLength(2);
      expect(result.templates[1].id).toBe('t2');
    });
  });

  describe('Complex UI Interactions', () => {
    it('TemplatesPageActions.selectProvider: should update level and set loading', () => {
      const action = TemplatesPageActions.selectProvider({
        providerId: 'p1',
        level: 2,
      });
      const result = paybillReducer(initialPaybillState, action);

      expect(result.selectedProviderId).toBe('p1');
      expect(result.currentLevel).toBe(2);
      expect(result.loading).toBe(true);
    });

    it('loadTemplates: should not set loading true if templates already exist', () => {
      const state = {
        ...initialPaybillState,
        templates: [{ id: 't1' }] as any,
      };
      const action = TemplatesPageActions.loadTemplates();
      const result = paybillReducer(state, action);

      expect(result.loading).toBe(false);
    });
  });

  it('addCheckedItems: should update the selectedItems list', () => {
    const mockItems = [{ id: '123', nickname: 'Electric Bill' }] as any;
    const action = TemplatesPageActions.addCheckedItems({
      selectedItems: mockItems,
    });

    const result = paybillReducer(initialPaybillState, action);

    expect(result.selectedItems).toEqual(mockItems);
    expect(result.selectedItems.length).toBe(1);
  });

  it('checkBillSuccess: should update verifiedDetails and clear loading when valid', () => {
    const details = { valid: true, firstName: 'John' } as any;
    const state = { ...initialPaybillState, loading: true };
    const action = PaybillActions.checkBillSuccess({ details });

    const result = paybillReducer(state, action);

    expect(result.verifiedDetails).toEqual(details);
    expect(result.loading).toBe(false);
    expect(result.error).toBeNull();
  });

  it('renameTemplateSuccess: should return state unchanged if template ID not found', () => {
    const state = {
      ...initialPaybillState,
      templates: [{ id: 't1', nickname: 'Original' }] as any,
    };
    const action = TemplatesPageActions.renameTemplateSuccess({
      template: { id: 'non-existent', nickname: 'New' } as any,
    });
    const result = paybillReducer(state, action);
    expect(result.templates[0].nickname).toBe('Original');
  });
  describe('Payment & Verification Edge Cases', () => {
    it('confirmPayment: should set loading and clear error', () => {
      const state = { ...initialPaybillState, error: 'err' };
      const action = PaybillActions.confirmPayment({
        payload: {} as any,
      });
      const result = paybillReducer(state, action);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('clearPaymentDetails: should nullify the details', () => {
      const state = { ...initialPaybillState, paymentDetails: { x: 1 } as any };
      const action = TemplatesPageActions.clearPaymentDetails();
      const result = paybillReducer(state, action);
      expect(result.paymentDetails).toBeNull();
    });

    it('loadPaymentDetails: should set loading true', () => {
      const action = PaybillActions.loadPaymentDetails({
        serviceId: 'mock-service-id',
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(true);
    });

    it('checkBill: should set loading true and clear error', () => {
      const state = { ...initialPaybillState, error: 'fail' };
      const action = PaybillActions.checkBill({
        serviceId: 'test-service',
        identification: {} as any,
      });
      const result = paybillReducer(state, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  it('setPaymentsForm: should update the payments array in state', () => {
    const payments = [
      { templateId: 't1', amount: 500 },
      { templateId: 't2', amount: 1200 },
    ] as any;

    const action = TemplatesPageActions.setPaymentsForm({ payments });
    const result = paybillReducer(initialPaybillState, action);

    expect(result.paymentsForm).toEqual(payments);
    expect(result.paymentsForm.length).toBe(2);
  });

  it('setSenderId: should update selectedSenderAccountId', () => {
    const accountId = 'SENDER_123';
    const action = TemplatesPageActions.setSenderId({
      selectedSenderAccountId: accountId,
    });

    const result = paybillReducer(initialPaybillState, action);

    expect(result.selectedSenderAccountId).toBe(accountId);
  });

  it('payManyBillsSuccess: should stop loading and set challengeId from response', () => {
    const response = {
      verify: { challengeId: 'challenge-xyz' },
    } as any;

    const state = { ...initialPaybillState, loading: true };
    const action = TemplatesPageActions.payManyBillsSuccess({ response });
    const result = paybillReducer(state, action);

    expect(result.loading).toBe(false);
    expect(result.challengeId).toBe('challenge-xyz');
  });

  it('payManyBillsSuccess: should handle null verify objects safely', () => {
    const response = { verify: null } as any;
    const action = TemplatesPageActions.payManyBillsSuccess({ response });
    const result = paybillReducer(initialPaybillState, action);

    expect(result.challengeId).toBeNull();
    expect(result.loading).toBe(false);
  });
});
