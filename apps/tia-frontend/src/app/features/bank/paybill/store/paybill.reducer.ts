import { createReducer, on } from '@ngrx/store';
import { PaybillState } from '../models/paybill.model';
import { PaybillActions } from './paybill.actions';

export const initialPaybillState: PaybillState = {
  categories: [],
  selectedCategoryId: null,
  selectedProviderId: null,
  loading: false,
  error: null,
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

  on(PaybillActions.selectCategory, (state, { categoryId }) => ({
    ...state,
    selectedCategoryId: categoryId,
    selectedProviderId: null,
  })),

  on(PaybillActions.selectProvider, (state, { providerId }) => ({
    ...state,
    selectedProviderId: providerId,
  })),

  on(PaybillActions.clearSelection, (state) => ({
    ...state,
    selectedCategoryId: null,
    selectedProviderId: null,
  })),
);
