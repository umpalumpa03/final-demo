import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Breadcrumb } from '@tia/shared/lib/navigation/models/breadcrumbs.model';
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
    if (!state) return null;

    if (state.selectedProvider) {
      return state.selectedProvider;
    }

    if (state.selectedProviderId && providers?.length) {
      const searchId = state.selectedProviderId.toLowerCase();
      return (
        providers.find((p) => {
          const pId = (p.id || p.categoryId)?.toLowerCase();
          return pId === searchId;
        }) ?? null
      );
    }

    return null;
  },
);

export const selectPaybillBreadcrumbs = createSelector(
  selectActiveCategory,
  selectActiveProvider,
  selectSelectedCategoryId,
  (category, provider, selectedCategoryId) => {
    const base: Breadcrumb[] = [
      { label: 'Paybill', route: '/bank/paybill/pay' },
    ];

    if (selectedCategoryId?.toUpperCase() === 'TEMPLATES') {
      base.push({ label: 'Templates', route: '' });
      return base;
    }

    if (category) {
      base.push({
        label: category.name,
        route: provider ? `/bank/paybill/pay/${category.id.toLowerCase()}` : '',
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
  (state) => state.verifiedDetails,
);

export const selectCurrentStep = createSelector(
  selectPaybillState,
  (state) => state.currentStep,
);

export const selectPaymentPayload = createSelector(
  selectPaybillState,
  (state) => state.paymentPayload,
);

export const selectChallengeId = createSelector(
  selectPaybillState,
  (state) => state.challengeId,
);

export const selectError = createSelector(
  selectPaybillState,
  (state) => state.error,
);

export const selectSuccessMessage = createSelector(
  selectPaybillState,
  (state) => state.successMessage,
);

export const selectTemplatesGroup = createSelector(
  selectPaybillState,
  (state) => state.templateGroups,
);
