import { createReducer, on } from '@ngrx/store';
import { PaybillCategory } from '../models/paybill.model';
import { initialPaybillState } from './paybill.state';
import { PaybillActions } from './paybill.actions';

export interface PaybillState {
  categories: PaybillCategory[];
  selectedCategoryId: string | null;
  loading: boolean;
}

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
