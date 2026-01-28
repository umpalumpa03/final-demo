import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PaybillState } from '../models/paybill.model';
import { Breadcrumb } from '@tia/shared/lib/navigation/models/breadcrumbs.model';

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

export const selectProviders = createSelector(
  selectPaybillState,
  (state) => state.providers,
);

export const selectActiveCategory = createSelector(
  selectCategories,
  selectSelectedCategoryId,
  selectProviders,
  (categories, selectedId, providers) => {
    if (!selectedId) return null;

    const category = categories.find(
      (c) => c.id.toLowerCase() === selectedId.toLowerCase(),
    );

    return category ? { ...category, providers } : null;
  },
);

export const selectActiveProvider = createSelector(
  selectPaybillState,
  selectProviders,
  (state, providers) => {
    if (state.selectedProvider) {
      return state.selectedProvider;
    }

    if (state.selectedProviderId && providers && providers.length > 0) {
      const found = providers.find(
        (p) => p.id.toLowerCase() === state.selectedProviderId!.toLowerCase(),
      );
      return found || null;
    }

    return null;
  },
);

export const selectPaybillBreadcrumbs = createSelector(
  selectActiveCategory,
  selectActiveProvider,
  selectSelectedCategoryId,
  (category, provider, selectedCategoryId) => {
    const base: Breadcrumb[] = [{ label: 'Paybill', route: '/bank/paybill' }];

    if (selectedCategoryId?.toUpperCase() === 'TEMPLATES') {
      base.push({ label: 'Templates', route: '' });
      return base;
    }

    if (category) {
      base.push({
        label: category.name,
        route: provider ? `/bank/paybill/${category.id.toLowerCase()}` : '',
      });
    }

    if (provider) {
      const label = provider.serviceName || provider.name || '';
      base.push({ label, route: '' });
    }

    return base;
  },
);

export const selectLoading = createSelector(
  selectPaybillState,
  (state) => state.loading,
);

export const selectVerifiedDetails = createSelector(
  selectPaybillState,
  (state) => state.verifiedDetails
);
