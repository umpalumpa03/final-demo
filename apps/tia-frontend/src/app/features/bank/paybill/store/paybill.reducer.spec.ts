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
      notifications: [{ id: '1', notificationType: 'info', message: 'test' }] as any,
      error: 'old error',
    };
    const action = PaybillActions.selectCategory({ categoryId: 'CAT1' });
    const result = paybillReducer(state, action);

    expect(result.selectedCategoryId).toBe('CAT1');
    expect(result.selectedProviderId).toBeNull();
    expect(result.providers).toEqual([]);
    expect(result.loading).toBe(true);
    expect(result.notifications).toEqual([]);
    expect(result.error).toBeNull();
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
      const state = { 
        ...initialPaybillState, 
        providers,
        notifications: [{ id: '1', notificationType: 'info', message: 'test' }] as any,
        error: 'old error',
      };
      const action = PaybillActions.selectProvider({ providerId: 'P1' });
      const result = paybillReducer(state, action);

      expect(result.selectedProviderId).toBe('P1');
      expect(result.selectedProvider).toEqual(providers[0]);
      expect(result.notifications).toEqual([]);
      expect(result.error).toBeNull();
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

    it('checkBillSuccess: should set details and clear error if valid', () => {
      const details = { valid: true, firstName: 'John' } as any;
      const state = { ...initialPaybillState, loading: true, error: 'err' };
      const action = PaybillActions.checkBillSuccess({ details });
      const result = paybillReducer(state, action);
      
      expect(result.verifiedDetails).toEqual(details);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('checkBillSuccess: should set error if invalid', () => {
      const details = { valid: false, error: 'Invalid account number' } as any;
      const action = PaybillActions.checkBillSuccess({ details });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.verifiedDetails).toBe(details);
      expect(result.error).toBe('Invalid account number');
    });

    it('checkBillSuccess: should use default error message when error is not provided', () => {
      const details = { valid: false } as any;
      const action = PaybillActions.checkBillSuccess({ details });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.error).toBe('Invalid account');
    });

    it('checkBillFailure: should set error', () => {
      const action = PaybillActions.checkBillFailure({ error: 'Account not found' });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.error).toBe('Account not found');
      expect(result.loading).toBe(false);
    });
  });

  describe('Payment Processing', () => {
    it('setPaymentPayload: should update payload and senderAccountId', () => {
      const data = { amount: 100, senderAccountId: 'ACC123' } as any;
      const action = PaybillActions.setPaymentPayload({ data });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.paymentPayload).toBe(data);
      expect(result.selectedSenderAccountId).toBe('ACC123');
    });

    it('setPaymentPayload: should preserve existing senderAccountId if not provided', () => {
      const state = { ...initialPaybillState, selectedSenderAccountId: 'EXISTING' };
      const data = { amount: 100 } as any;
      const action = PaybillActions.setPaymentPayload({ data });
      const result = paybillReducer(state, action);
      expect(result.selectedSenderAccountId).toBe('EXISTING');
    });

    it('proceedPayment: should set loading true', () => {
      const action = PaybillActions.proceedPayment({ payload: {} as any });
      const result = paybillReducer(initialPaybillState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('proceedPaymentSuccess: should handle missing challengeId gracefully', () => {
      const response = { verify: null } as any;
      const action = PaybillActions.proceedPaymentSuccess({ response });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.challengeId).toBeNull();
      expect(result.loading).toBe(false);
    });

    it('proceedPaymentSuccess: should set challengeId when present', () => {
      const response = { verify: { challengeId: 'CHAL123' } } as any;
      const action = PaybillActions.proceedPaymentSuccess({ response });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.challengeId).toBe('CHAL123');
    });

    it('proceedPaymentFailure: should set error', () => {
      const action = PaybillActions.proceedPaymentFailure({
        error: 'Insufficent funds',
      });
      const result = paybillReducer(initialPaybillState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Insufficent funds');
    });

    it('confirmPayment: should set loading and clear error', () => {
      const state = { ...initialPaybillState, error: 'err' };
      const action = PaybillActions.confirmPayment({
        payload: {} as any,
      });
      const result = paybillReducer(state, action);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('confirmPaymentFailure: should set error', () => {
      const action = PaybillActions.confirmPaymentFailure({ error: 'Confirmation failed' });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(false);
      expect(result.error).toBe('Confirmation failed');
    });

    it('loadPaymentDetails: should set loading true', () => {
      const action = PaybillActions.loadPaymentDetails({
        serviceId: 'mock-service-id',
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(true);
    });

    it('loadPaymentDetailsSuccess: should set payment details', () => {
      const details = { amount: 500, reference: 'REF123' } as any;
      const action = PaybillActions.loadPaymentDetailsSuccess({ details });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.paymentDetails).toBe(details);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });

    it('loadPaymentDetailsFailure: should set error', () => {
      const action = PaybillActions.loadPaymentDetailsFailure({ error: 'Failed to load' });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(false);
      expect(result.error).toBe('Failed to load');
    });

    it('clearPaymentDetails: should nullify the details', () => {
      const state = { ...initialPaybillState, paymentDetails: { x: 1 } as any };
      const action = TemplatesPageActions.clearPaymentDetails();
      const result = paybillReducer(state, action);
      expect(result.paymentDetails).toBeNull();
    });

    it('resetPaymentForm: should clear payment related state', () => {
      const state = {
        ...initialPaybillState,
        verifiedDetails: { valid: true } as any,
        error: 'some error',
        challengeId: 'CHAL123',
        paymentDetails: { amount: 100 } as any,
      };
      const action = PaybillActions.resetPaymentForm();
      const result = paybillReducer(state, action);
      
      expect(result.verifiedDetails).toBeNull();
      expect(result.error).toBeNull();
      expect(result.challengeId).toBeNull();
      expect(result.paymentDetails).toBeNull();
    });
  });

  describe('Templates', () => {
    it('loadTemplates: should set loading true when templates are empty', () => {
      const action = TemplatesPageActions.loadTemplates();
      const result = paybillReducer(initialPaybillState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
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

    it('createTemplate: should set loading true', () => {
      const action = TemplatesPageActions.createTemplate({
        payload: {} as any,
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
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
      expect(result.loading).toBe(false);
    });

    it('deleteTemplate: should set loading true', () => {
      const action = TemplatesPageActions.deleteTemplate({
        templateId: 't1',
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('deleteTemplateSuccess: should remove template from list and selectedItems', () => {
      const state = {
        ...initialPaybillState,
        templates: [
          { id: 't1', nickname: 'First' },
          { id: 't2', nickname: 'Second' },
        ] as any,
        selectedItems: [
          { id: 't1', nickname: 'First' },
          { id: 't2', nickname: 'Second' },
        ] as any,
      };
      const action = TemplatesPageActions.deleteTemplateSuccess({
        templateId: 't1',
        message: 'Deleted',
      });
      const result = paybillReducer(state, action);
      
      expect(result.templates).toHaveLength(1);
      expect(result.templates[0].id).toBe('t2');
      expect(result.selectedItems).toHaveLength(1);
      expect(result.selectedItems[0].id).toBe('t2');
      expect(result.loading).toBe(false);
    });

    it('deleteTemplateFailure: should set error', () => {
      const action = TemplatesPageActions.deleteTemplateFailure({
        error: 'Delete failed',
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(false);
      expect(result.error).toBe('Delete failed');
    });

    it('renameTemplate: should set loading true', () => {
      const action = TemplatesPageActions.renameTemplate({
        templateId: 't1',
        nickname: 'New Name',
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('renameTemplateSuccess: should update template nickname', () => {
      const state = {
        ...initialPaybillState,
        templates: [
          { id: 't1', nickname: 'Original' },
          { id: 't2', nickname: 'Other' },
        ] as any,
      };
      const action = TemplatesPageActions.renameTemplateSuccess({
        template: { id: 't1', nickname: 'Updated' } as any,
      });
      const result = paybillReducer(state, action);
      
      expect(result.templates[0].nickname).toBe('Updated');
      expect(result.templates[1].nickname).toBe('Other');
      expect(result.loading).toBe(false);
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

    it('renameTemplateFailure: should set error', () => {
      const action = TemplatesPageActions.renameTemplateFailure({
        error: 'Rename failed',
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(false);
      expect(result.error).toBe('Rename failed');
    });

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
      expect(result.templates.find((t) => t.id === 't2')?.groupId).toBe('other');
      expect(result.loading).toBe(false);
    });

    it('moveTemplateFailure: should set error', () => {
      const action = TemplatesPageActions.moveTemplateFailure({
        error: 'Move failed',
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(false);
      expect(result.error).toBe('Move failed');
    });
  });

  describe('Template Groups', () => {
    it('loadTemplateGroups: should set loading true when groups are empty', () => {
      const action = TemplatesPageActions.loadTemplateGroups();
      const result = paybillReducer(initialPaybillState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('loadTemplateGroups: should not set loading if groups exist', () => {
      const state = {
        ...initialPaybillState,
        templateGroups: [{ id: 'g1' }] as any,
      };
      const action = TemplatesPageActions.loadTemplateGroups();
      const result = paybillReducer(state, action);

      expect(result.loading).toBe(false);
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

    it('createTemplatesGroups: should set loading true', () => {
      const action = TemplatesPageActions.createTemplatesGroups({
        groupName: 'New Group',
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('createTemplatesGroupsSuccess: should add new group to the list', () => {
      const state = {
        ...initialPaybillState,
        templateGroups: [{ id: 'g1', groupName: 'Existing' }] as any,
      };
      const newGroup = { id: 'g2', groupName: 'New Group' } as any;
      const action = TemplatesPageActions.createTemplatesGroupsSuccess({
        templateGroup: newGroup,
      });

      const result = paybillReducer(state, action);
      expect(result.templateGroups).toHaveLength(2);
      expect(result.templateGroups[0].id).toBe('g2');
      expect(result.loading).toBe(false);
    });

    it('createTemplatesGroupsFailure: should set error', () => {
      const action = TemplatesPageActions.createTemplatesGroupsFailure({
        error: 'Create failed',
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(false);
      expect(result.error).toBe('Create failed');
    });

    it('deleteTemplateGroup: should set loading true', () => {
      const action = TemplatesPageActions.deleteTemplateGroup({
        groupId: 'g1',
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('deleteTemplateGroupSuccess: should remove group and update templates', () => {
      const state = {
        ...initialPaybillState,
        templateGroups: [
          { id: 'group-123', groupName: 'ToDelete' },
          { id: 'group-456', groupName: 'Keep' },
        ] as any,
        templates: [
          { id: 'temp-1', groupId: 'group-123' },
          { id: 'temp-2', groupId: 'group-456' },
        ] as any,
      };

      const action = TemplatesPageActions.deleteTemplateGroupSuccess({
        groupId: 'group-123',
      });
      const result = paybillReducer(state, action);

      expect(result.templateGroups).toHaveLength(1);
      expect(result.templateGroups[0].id).toBe('group-456');

      const temp1 = result.templates.find((t) => t.id === 'temp-1');
      expect(temp1?.groupId).toBeNull();

      const temp2 = result.templates.find((t) => t.id === 'temp-2');
      expect(temp2?.groupId).toBe('group-456');

      expect(result.loading).toBe(false);
    });

    it('renameTemplateGroup: should set loading true', () => {
      const action = TemplatesPageActions.renameTemplateGroup({
        groupId: 'g1',
        groupName: 'New Name',
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('renameTemplateGroupSuccess: should update group name', () => {
      const state = {
        ...initialPaybillState,
        templateGroups: [
          { id: 'g1', groupName: 'Original' },
          { id: 'g2', groupName: 'Other' },
        ] as any,
      };
      const action = TemplatesPageActions.renameTemplateGroupSuccess({
        templateGroup: { id: 'g1', groupName: 'Updated' } as any,
      });

      const result = paybillReducer(state, action);
      expect(result.templateGroups[0].groupName).toBe('Updated');
      expect(result.templateGroups[1].groupName).toBe('Other');
      expect(result.loading).toBe(false);
    });

    it('renameTemplateGroupFailure: should set error', () => {
      const action = TemplatesPageActions.renameTemplateGroupFailure({
        error: 'Rename failed',
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(false);
      expect(result.error).toBe('Rename failed');
    });
  });

  describe('Provider Hierarchy', () => {
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

    it('loadChildProvidersSuccess: should append providers to a new level when they exist', () => {
      const providers = [{ id: 'level2_p1' }] as any;
      const state = {
        ...initialPaybillState,
        filteredProviders: [[{ id: 'level1' }]] as any,
      };
      const action = TemplatesPageActions.loadChildProvidersSuccess({
        providers,
        level: 1,
      });
      const result = paybillReducer(state, action);

      expect(result.filteredProviders.length).toBe(2);
      expect(result.filteredProviders[1]).toEqual(providers);
      expect(result.loading).toBe(false);
      expect(result.selectedProvider).toBeNull();
    });

    it('loadChildProvidersSuccess: should trim levels when providers array is empty', () => {
      const state = {
        ...initialPaybillState,
        filteredProviders: [
          [{ id: 'level1' }],
          [{ id: 'level2' }],
          [{ id: 'level3' }],
        ] as any,
      };
      const action = TemplatesPageActions.loadChildProvidersSuccess({
        providers: [],
        level: 1,
      });
      const result = paybillReducer(state, action);

      expect(result.filteredProviders.length).toBe(1);
      expect(result.filteredProviders[0]).toEqual([{ id: 'level1' }]);
    });

    it('loadChildProvidersFailure: should set error', () => {
      const action = TemplatesPageActions.loadChildProvidersFailure({
        error: 'Failed to load children',
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(false);
      expect(result.error).toBe('Failed to load children');
    });
  });

  describe('Notifications', () => {
    it('addNotification: should add notification to the list', () => {
      const state = {
        ...initialPaybillState,
        notifications: [{ id: '1', notificationType: 'info', message: 'Existing' }] as any,
      };
      const action = PaybillActions.addNotification({
        notificationType: 'error',
        message: 'New notification',
      });
      const result = paybillReducer(state, action);

      expect(result.notifications).toHaveLength(2);
      expect(result.notifications[1].notificationType).toBe('error');
      expect(result.notifications[1].message).toBe('New notification');
    });

    it('dismissNotification: should remove notification by id', () => {
      const state = {
        ...initialPaybillState,
        notifications: [
          { id: '1', notificationType: 'info', message: 'First' },
          { id: '2', notificationType: 'error', message: 'Second' },
        ] as any,
      };
      const action = PaybillActions.dismissNotification({ id: '1' });
      const result = paybillReducer(state, action);

      expect(result.notifications).toHaveLength(1);
      expect(result.notifications[0].id).toBe('2');
    });

    it('clearAllNotifications: should clear all notifications', () => {
      const state = {
        ...initialPaybillState,
        notifications: [
          { id: '1', notificationType: 'info', message: 'First' },
          { id: '2', notificationType: 'error', message: 'Second' },
        ] as any,
        error: 'old error',
      };
      const action = PaybillActions.clearAllNotifications();
      const result = paybillReducer(state, action);

      expect(result.notifications).toEqual([]);
      expect(result.error).toBeNull();
    });
  });

  describe('Bulk Payment Operations', () => {
    it('addCheckedItems: should update the selectedItems list', () => {
      const mockItems = [{ id: '123', nickname: 'Electric Bill' }] as any;
      const action = TemplatesPageActions.addCheckedItems({
        selectedItems: mockItems,
      });

      const result = paybillReducer(initialPaybillState, action);

      expect(result.selectedItems).toEqual(mockItems);
      expect(result.selectedItems.length).toBe(1);
    });

    it('setDistributedAmount: should update distributed amount', () => {
      const action = TemplatesPageActions.setDistributedAmount({ amount: 1500 });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.distributedAmount).toBe(1500);
    });

    it('setTotalAmount: should update total amount', () => {
      const action = TemplatesPageActions.setTotalAmount({ amount: 3000 });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.totalAmount).toBe(3000);
    });

    it('clearPaymentInfo: should reset payment amounts and selected items', () => {
      const state = {
        ...initialPaybillState,
        totalAmount: 5000,
        distributedAmount: 3000,
        selectedItems: [{ id: '1' }] as any,
      };
      const action = TemplatesPageActions.clearPaymentInfo();
      const result = paybillReducer(state, action);

      expect(result.totalAmount).toBe(0);
      expect(result.distributedAmount).toBe(0);
      expect(result.selectedItems).toEqual([]);
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

    it('payManyBills: should set loading true', () => {
      const action = TemplatesPageActions.payManyBills({ payload: {} as any });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(true);
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

    it('payManyBillsFailure: should set error message', () => {
      const action = TemplatesPageActions.payManyBillsFailure({
        error: 'Payment processing failed',
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(false);
      expect(result.message).toBe('Payment processing failed');
    });

    it('setFormValid: should update form validity state', () => {
      const action = TemplatesPageActions.setFormValid({ isValid: true });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.isFormValid).toBe(true);
      expect(result.loading).toBe(false);
    });

    it('checkBillForTemplateFailure: should set error message', () => {
      const action = TemplatesPageActions.checkBillForTemplateFailure({
        error: 'Validation failed',
      });
      const result = paybillReducer(initialPaybillState, action);
      expect(result.loading).toBe(false);
      expect(result.message).toBe('Validation failed');
    });
  });

  describe('State Management', () => {
    it('clearSelection: should reset all selection-related state', () => {
      const state = {
        ...initialPaybillState,
        selectedCategoryId: 'CAT1',
        selectedProviderId: 'PROV1',
        selectedProvider: { id: 'PROV1' } as any,
        verifiedDetails: { valid: true } as any,
        providers: [{ id: 'PROV1' }] as any,
        paymentPayload: { amount: 100 } as any,
        challengeId: 'CHAL123',
        filteredProviders: [[{ id: 'PROV1' }]] as any,
        paymentDetails: { amount: 100 } as any,
        currentLevel: 2,
        error: 'some error',
        selectedSenderAccountId: 'ACC123',
      };

      const action = PaybillActions.clearSelection();
      const result = paybillReducer(state, action);

      expect(result.selectedCategoryId).toBeNull();
      expect(result.selectedProviderId).toBeNull();
      expect(result.selectedProvider).toBeNull();
      expect(result.verifiedDetails).toBeNull();
      expect(result.providers).toEqual([]);
      expect(result.paymentPayload).toBeNull();
      expect(result.challengeId).toBeNull();
      expect(result.filteredProviders).toEqual([]);
      expect(result.paymentDetails).toBeNull();
      expect(result.currentLevel).toBe(0);
      expect(result.error).toBeNull();
      expect(result.selectedSenderAccountId).toBeNull();
    });

    it('clearError: should clear error state', () => {
      const state = { ...initialPaybillState, error: 'Some error' };
      const action = PaybillActions.clearError();
      const result = paybillReducer(state, action);
      expect(result.error).toBeNull();
    });

    it('setTransactionProvider: should set provider and related IDs', () => {
      const provider = {
        id: 'PROV123',
        categoryId: 'CAT456',
      } as any;
      const action = PaybillActions.setTransactionProvider({ provider });
      const result = paybillReducer(initialPaybillState, action);

      expect(result.selectedProvider).toBe(provider);
      expect(result.selectedProviderId).toBe('PROV123');
      expect(result.selectedCategoryId).toBe('CAT456');
    });

    it('setTransactionProvider: should preserve existing categoryId if not provided', () => {
      const state = { ...initialPaybillState, selectedCategoryId: 'EXISTING_CAT' };
      const provider = { id: 'PROV123' } as any;
      const action = PaybillActions.setTransactionProvider({ provider });
      const result = paybillReducer(state, action);

      expect(result.selectedCategoryId).toBe('EXISTING_CAT');
    });
  });
});