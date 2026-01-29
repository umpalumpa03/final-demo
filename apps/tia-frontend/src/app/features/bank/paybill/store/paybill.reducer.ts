import { createReducer, on } from '@ngrx/store';
import { PaybillState } from '../models/paybill.model';
import { PaybillActions } from './paybill.actions';

export const initialPaybillState: PaybillState = {
  categories: [],
  selectedCategoryId: null,
  selectedProviderId: null,
  selectedProvider: null,
  loading: false,
  providers: [],
  error: null,
  verifiedDetails: null,
  currentStep: 'DETAILS',
  paymentPayload: null,
};

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
  on(PaybillActions.checkBill, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(PaybillActions.checkBillSuccess, (state, { details }) => ({
    ...state,
    verifiedDetails: details,
    loading: false,

    error: details.valid ? null : (details.error ?? null),
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
);
