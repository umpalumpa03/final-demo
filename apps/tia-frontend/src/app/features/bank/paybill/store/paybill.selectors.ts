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

export const selectTemplatesGroup = createSelector(
  selectPaybillState,
  (state) => state.templateGroups,
);

export const selectNotifications = createSelector(
  selectPaybillState,
  (state) => state.notifications,
);

export const selectTemplates = createSelector(
  selectPaybillState,
  (state) => state.templates,
);

export const selectTemplatesAsTreeItems = createSelector(
  selectTemplates,
  (templates) => {
    if (!templates?.length) return [];

    return templates.map((template, index) => ({
      id: template.id,
      title: template.nickname,
      subtitle: template.serviceId,
      groupId: template.groupId,
      icon: 'images/svg/paybill/favorite.svg',
      accountNumber: template.identification.accountNumber,
      order: index,
    }));
  },
);

export const selectTemplatesGroupWithConfigs = createSelector(
  selectTemplatesGroup,
  (groups) =>
    groups.map((group) => ({
      ...group,
      icon: 'images/svg/paybill/group.svg',
      expanded: group.templateCount > 0,
    })),
);

export const selectPaymentFields = createSelector(
  selectPaybillState,
  (state) => state.paymentDetails?.fields ?? []
);