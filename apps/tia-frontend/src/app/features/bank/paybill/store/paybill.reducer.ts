import { createReducer, on } from '@ngrx/store';
import { PaybillActions, TemplatesPageActions } from './paybill.actions';
import { initialPaybillState } from './paybill.state';

export const paybillReducer = createReducer(
  initialPaybillState,

  on(PaybillActions.loadCategories, (state) => ({
    ...state,
    loading: true,
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
    loading: true,
    error: null,
  })),

  on(PaybillActions.loadProvidersSuccess, (state, { providers }) => ({
    ...state,
    providers,
    loading: false,
  })),

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
    currentStep: 'DETAILS',
    paymentPayload: null,
    challengeId: null,
  })),

  on(PaybillActions.checkBill, (state) => ({
    ...state,
    loading: true,
    error: null,
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

  on(PaybillActions.setPaymentStep, (state, { step }) => ({
    ...state,
    currentStep: step,
  })),

  on(PaybillActions.setPaymentPayload, (state, { data }) => ({
    ...state,
    paymentPayload: data,
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

  on(PaybillActions.clearSuccessMessage, (state) => ({
    ...state,
    successMessage: null,
  })),

  on(PaybillActions.proceedPaymentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TemplatesPageActions.loadTemplates, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    TemplatesPageActions.loadTemplatesSuccess,
    (state, { templateGroups }) => ({
      ...state,
      templateGroups,
      loading: false,
    }),
  ),

  on(TemplatesPageActions.loadTemplatesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(PaybillActions.confirmPayment, (state) => ({
    ...state,
    loading: true,
    error: null,
    successMessage: 'OTP verified successfully!',
  })),

  on(PaybillActions.confirmPaymentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
  })),
);
