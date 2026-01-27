import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PaybillState } from '../models/paybill.model';

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
  selectProviders,
  selectSelectedProviderId,
  (providers, selectedProviderId) => {
    if (!providers || !selectedProviderId) return null;
    return providers.find((p) => p.serviceId === selectedProviderId) ?? null;
  },
);

export const selectPaybillBreadcrumbs = createSelector(
  selectActiveCategory,
  selectActiveProvider,
  (category, provider) => {
    const base = [{ label: 'Paybill', route: '/bank/paybill' }];

    if (category) {
      base.push({
        label: category.name,
        route: provider ? '/bank/paybill' : '',
      });
    }

    if (provider) {
      base.push({ label: provider.category, route: '' });
    }

    return base.map((crumb, index, arr) => ({
      ...crumb,
      route: index === arr.length - 1 ? '' : crumb.route,
    }));
  },
);
