import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PaybillState } from './paybill.state';

export const selectPaybillState =
  createFeatureSelector<PaybillState>('paybill');

export const selectCategories = createSelector(
  selectPaybillState,
  (state) => state.categories,
);

export const selectSelectedCategoryId = createSelector(
  selectPaybillState,
  (state) => state.selectedCategoryId,
);

export const selectSelectedProviderId = createSelector(
  selectPaybillState,
  (state) => state.selectedProviderId,
);

export const selectActiveCategory = createSelector(
  selectCategories,
  selectSelectedCategoryId,
  (categories, selectedId) =>
    categories.find((c) => c.id === selectedId) ?? null,
);

export const selectActiveProvider = createSelector(
  selectActiveCategory,
  selectSelectedProviderId,
  (activeCategory, selectedProviderId) => {
    if (!activeCategory || !selectedProviderId) return null;
    return (
      activeCategory.providers.find((p) => p.id === selectedProviderId) ?? null
    );
  },
);
