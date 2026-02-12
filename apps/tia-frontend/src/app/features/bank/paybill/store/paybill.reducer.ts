import { createReducer, on } from '@ngrx/store';
import { PaybillActions, TemplatesPageActions } from './paybill.actions';
import { initialPaybillState } from './paybill.state';
import { PaybillProvider } from '../components/paybill-main/shared/models/paybill.model';

export const paybillReducer = createReducer(
  initialPaybillState,

  on(PaybillActions.loadCategories, (state) => ({
    ...state,
    loading: state.categories.length === 0,
    error: null,
  })),

  on(PaybillActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
    loading: false,
  })),

  on(PaybillActions.selectProvider, (state, { providerId }) => {
    const provider = state.providers.find(
      (p) => p.id.toLowerCase() === providerId.toLowerCase(),
    );

    return {
      ...state,
      selectedProviderId: providerId,
      selectedProvider: provider || null,
    };
  }),

  on(PaybillActions.selectCategory, (state, { categoryId }) => ({
    ...state,
    selectedCategoryId: categoryId,
    selectedProviderId: null,
    selectedProvider: null,
    providers: [],
    filteredProviders: [],
    loading: true,
    error: null,
  })),
  on(PaybillActions.loadProvidersSuccess, (state, { providers }) => {
    const filtered = state.selectedProviderId
      ? providers.filter((p) => p.parentId === state.selectedProviderId)
      : providers.filter((p) => !p.parentId);

    return {
      ...state,
      providers,
      filteredProviders: [filtered],
      loading: false,
    };
  }),

  on(PaybillActions.loadProvidersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(PaybillActions.clearSelection, (state) => ({
    ...state,
    selectedCategoryId: null,
    selectedProviderId: null,
    selectedProvider: null,
    verifiedDetails: null,
    providers: [],
    paymentPayload: null,
    challengeId: null,
    filteredProviders: [],
    paymentDetails: null,
    currentLevel: 0,
    error: null,
    selectedSenderAccountId: null,
  })),

  on(TemplatesPageActions.clearPaymentDetails, (state) => ({
    ...state,
    paymentDetails: null,
  })),

  on(PaybillActions.checkBill, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PaybillActions.checkBillSuccess, (state, { details }) => ({
    ...state,
    verifiedDetails: details,
    loading: false,
    error: details.valid ? null : (details.error ?? 'Invalid account'),
  })),

  on(PaybillActions.checkBillFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(PaybillActions.setPaymentPayload, (state, { data }) => ({
    ...state,
    paymentPayload: data,
    selectedSenderAccountId:
      data.senderAccountId || state.selectedSenderAccountId,
  })),

  on(PaybillActions.proceedPayment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(PaybillActions.proceedPaymentSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    challengeId: response.verify?.challengeId ?? null,
  })),

  on(PaybillActions.clearError, (state) => ({
    ...state,
    error: null,
  })),

  on(PaybillActions.proceedPaymentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TemplatesPageActions.loadTemplateGroups, (state) => ({
    ...state,
    loading: state.templateGroups.length === 0,
    error: null,
  })),

  on(
    TemplatesPageActions.loadTemplateGroupsSuccess,
    (state, { templateGroups }) => ({
      ...state,
      templateGroups,
      loading: false,
    }),
  ),

  on(TemplatesPageActions.loadTemplateGroupsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(PaybillActions.confirmPayment, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),

  on(PaybillActions.confirmPaymentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
  })),

  on(
    PaybillActions.addNotification,
    (state, { notificationType, message }) => ({
      ...state,
      notifications: [
        ...state.notifications,
        { id: Date.now().toString(), notificationType, message },
      ],
    }),
  ),

  on(PaybillActions.dismissNotification, (state, { id }) => ({
    ...state,
    notifications: state.notifications.filter((n) => n.id !== id),
  })),

  on(
    PaybillActions.clearAllNotifications,
    PaybillActions.selectCategory,
    PaybillActions.selectProvider,
    (state) => ({
      ...state,
      notifications: [],
      error: null,
    }),
  ),

  on(TemplatesPageActions.loadTemplates, (state) => ({
    ...state,
    loading: state.templates.length === 0,
    error: null,
  })),

  on(TemplatesPageActions.loadTemplatesSuccess, (state, { templates }) => ({
    ...state,
    templates,
    loading: false,
  })),

  on(TemplatesPageActions.loadTemplatesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(TemplatesPageActions.createTemplatesGroups, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    TemplatesPageActions.createTemplatesGroupsSuccess,
    (state, { templateGroup }) => ({
      ...state,
      loading: false,
      templateGroups: [templateGroup, ...state.templateGroups],
    }),
  ),

  on(TemplatesPageActions.createTemplatesGroupsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TemplatesPageActions.deleteTemplate, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    TemplatesPageActions.deleteTemplateSuccess,
    (state, { message, templateId }) => ({
      ...state,
      loading: false,
      error: null,
      templates: state.templates.filter((t) => t.id !== templateId),
      selectedItems: state.selectedItems.filter(
        (item) => item.id !== templateId,
      ),
    }),
  ),
  on(TemplatesPageActions.deleteTemplateFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(PaybillActions.resetPaymentForm, (state) => ({
    ...state,
    verifiedDetails: null,
    error: null,
    challengeId: null,
    paymentDetails: null,
  })),

  on(PaybillActions.setTransactionProvider, (state, { provider }) => ({
    ...state,
    selectedProvider: provider,
    selectedProviderId: provider.id,
    selectedCategoryId: state.selectedCategoryId || provider.categoryId || null,
  })),

  on(PaybillActions.loadPaymentDetails, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(PaybillActions.loadPaymentDetailsSuccess, (state, { details }) => ({
    ...state,
    paymentDetails: details,
    loading: false,
    error: null,
  })),

  on(PaybillActions.loadPaymentDetailsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
  })),

  on(TemplatesPageActions.renameTemplate, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TemplatesPageActions.renameTemplateSuccess, (state, { template }) => ({
    ...state,
    loading: false,
    error: null,
    templates: state.templates.map((item) => {
      if (item.id === template.id) {
        return {
          ...item,
          nickname: template.nickname,
        };
      }
      return item;
    }),
  })),

  on(TemplatesPageActions.renameTemplateFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TemplatesPageActions.deleteTemplateGroup, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TemplatesPageActions.deleteTemplateGroupSuccess, (state, { groupId }) => ({
    ...state,
    loading: false,
    error: null,
    templateGroups: state.templateGroups.filter((t) => t.id !== groupId),
    templates: state.templates.map((item) => {
      if (item.groupId === groupId) {
        return {
          ...item,
          groupId: null,
        };
      }
      return item;
    }),
  })),

  on(TemplatesPageActions.renameTemplateGroupFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TemplatesPageActions.renameTemplateGroup, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    TemplatesPageActions.renameTemplateGroupSuccess,
    (state, { templateGroup }) => ({
      ...state,
      loading: false,
      error: null,
      templateGroups: state.templateGroups.map((item) => {
        if (item.id === templateGroup.id) {
          return {
            ...item,
            groupName: templateGroup.groupName,
          };
        }
        return item;
      }),
    }),
  ),

  on(TemplatesPageActions.moveTemplate, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    TemplatesPageActions.moveTemplateSuccess,
    (state, { groupId, templateId }) => ({
      ...state,
      loading: false,
      error: null,
      templates: state.templates.map((item) => {
        if (item.id === templateId) {
          return {
            ...item,
            groupId,
          };
        }
        return item;
      }),
    }),
  ),

  on(TemplatesPageActions.moveTemplateFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TemplatesPageActions.selectProvider, (state, { providerId, level }) => ({
    ...state,
    selectedProviderId: providerId,
    currentLevel: level,
    loading: true,
  })),

  on(
    TemplatesPageActions.loadChildProvidersSuccess,
    (state, { providers, level }) => {
      const currentLevels = state.filteredProviders || [];

      let newFilteredProviders: PaybillProvider[][];

      if (providers.length === 0) {
        newFilteredProviders = currentLevels.slice(0, level);
      } else {
        const levelsBefore = currentLevels.slice(0, level);
        newFilteredProviders = [...levelsBefore, providers];
      }

      return {
        ...state,
        filteredProviders: newFilteredProviders,
        loading: false,
        selectedProvider: null,
      };
    },
  ),

  on(TemplatesPageActions.loadChildProvidersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TemplatesPageActions.createTemplate, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TemplatesPageActions.createTemplateSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    templates: [...state.templates, payload],
  })),

  on(TemplatesPageActions.addCheckedItems, (state, { selectedItems }) => ({
    ...state,
    selectedItems,
  })),

  on(TemplatesPageActions.setDistributedAmount, (state, { amount }) => ({
    ...state,
    distributedAmount: amount,
  })),
  on(TemplatesPageActions.setTotalAmount, (state, { amount }) => ({
    ...state,
    totalAmount: amount,
  })),

  on(TemplatesPageActions.clearPaymentInfo, (state) => ({
    ...state,
    totalAmount: 0,
    distributedAmount: 0,
    selectedItems: [],
  })),
);
