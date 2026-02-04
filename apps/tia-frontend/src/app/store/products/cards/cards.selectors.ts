import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CardsState } from './cards.state';
import { CardGroup } from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/card-group.model';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import { CardDetail } from '@tia/shared/models/cards/card-detail.model';
import { CardDesign } from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/card-design.model';
import { CardCategory } from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/card-category.model';
import { CardType } from '../../../features/bank/products/components/cards/models/card-type.model';

export const selectCardsState = createFeatureSelector<CardsState>('cards');

export const selectAllAccounts = createSelector(
  selectCardsState,
  (state: CardsState): CardAccount[] => state.accounts,
);

export const selectCardImages = createSelector(
  selectCardsState,
  (state: CardsState): Record<string, string> => state.cardImages,
);

export const selectCardDetails = createSelector(
  selectCardsState,
  (state: CardsState): Record<string, CardDetail> => state.cardDetails,
);

export const selectLoading = createSelector(
  selectCardsState,
  (state: CardsState): boolean => state.loading,
);

export const selectError = createSelector(
  selectCardsState,
  (state: CardsState): string | null => state.error,
);

export const selectCardGroups = createSelector(
  selectAllAccounts,
  selectCardImages,
  (
    accounts: CardAccount[],
    cardImages: Record<string, string>,
  ): CardGroup[] => {
    return accounts.map((account) => ({
      account,
      cardImages: account.cardIds
        .filter((cardId) => cardImages[cardId])
        .map((cardId) => ({
          cardId,
          imageBase64: cardImages[cardId],
        })),
    }));
  },
);

export const selectAccountById = (accountId: string) =>
  createSelector(
    selectAllAccounts,
    (accounts: CardAccount[]): CardAccount | undefined =>
      accounts.find((account) => account.id === accountId),
  );

export const selectCardDetailsByAccountId = (accountId: string) =>
  createSelector(
    selectAccountById(accountId),
    selectCardDetails,
    selectCardImages,
    (
      account: CardAccount | undefined,
      cardDetails: Record<string, CardDetail>,
      cardImages: Record<string, string>,
    ) => {
      if (!account) {
        return [];
      }

      return account.cardIds
        .map((cardId) => ({
          cardId,
          details: cardDetails[cardId],
          imageBase64: cardImages[cardId],
        }))
        .filter((card) => card.details && card.imageBase64);
    },
  );

export const selectCardDetailsLoading = createSelector(
  selectCardsState,
  (state: CardsState): boolean => state.cardDetailsLoading,
);

export const selectCardDetailsError = createSelector(
  selectCardsState,
  (state: CardsState): string | null => state.cardDetailsError,
);

export const selectCardDetailById = (cardId: string) =>
  createSelector(
    selectCardDetails,
    selectCardImages,
    (
      cardDetails: Record<string, CardDetail>,
      cardImages: Record<string, string>,
    ) => {
      const details = cardDetails[cardId];
      const image = cardImages[cardId];

      if (!details || !image) return null;

      return {
        cardId,
        details,
        imageBase64: image,
      };
    },
  );

export const selectCardDesigns = createSelector(
  selectCardsState,
  (state: CardsState): CardDesign[] => state.designs,
);

export const selectCardCategories = createSelector(
  selectCardsState,
  (state: CardsState): CardCategory[] => state.categories,
);

export const selectCardTypes = createSelector(
  selectCardsState,
  (state: CardsState): CardType[] => state.types,
);

export const selectIsCreating = createSelector(
  selectCardsState,
  (state: CardsState): boolean => state.isCreating,
);

export const selectCreateError = createSelector(
  selectCardsState,
  (state: CardsState): string | null => state.createError,
);

export const selectIsCreateModalOpen = createSelector(
  selectCardsState,
  (state: CardsState): boolean => state.isCreateModalOpen,
);

export const selectCardCreationData = createSelector(
  selectCardDesigns,
  selectCardCategories,
  selectCardTypes,
  selectAllAccounts,
  (
    designs: CardDesign[],
    categories: CardCategory[],
    types: CardType[],
    accounts: CardAccount[],
  ) => ({
    designs,
    categories,
    types,
    accounts,
  }),
);
export const selectShowSuccessAlert = createSelector(
  selectCardsState,
  (state: CardsState): boolean => state.showSuccessAlert,
);
export const selectCardCreationDataLoading = createSelector(
  selectCardsState,
  (state: CardsState): boolean => state.loading,
);
export const selectIsCardDetailsModalOpen = createSelector(
  selectCardsState,
  (state: CardsState): boolean => state.isCardDetailsModalOpen,
);

export const selectSelectedCardIdForModal = createSelector(
  selectCardsState,
  (state: CardsState): string | null => state.selectedCardIdForModal,
);

export const selectCardDetailsModalData = createSelector(
  selectSelectedCardIdForModal,
  selectCardDetails,
  selectCardImages,
  selectAllAccounts,
  (
    cardId: string | null,
    cardDetails: Record<string, CardDetail>,
    cardImages: Record<string, string>,
    accounts: CardAccount[],
  ) => {
    if (!cardId) return null;

    const details = cardDetails[cardId];
    const image = cardImages[cardId];

    if (!details || !image) return null;

    const account = accounts.find((acc) => acc.id === details.accountId);

    return {
      cardId,
      details,
      imageBase64: image,
      account,
      currency: account?.currency ?? 'N/A',
      formattedBalance: account
        ? `${account.currency} ${account.balance.toLocaleString()}`
        : 'N/A',
      shouldShowCreditLimit: details.type === 'CREDIT' && !!details.creditLimit,
      formattedCreditLimit:
        account && details.creditLimit
          ? `${account.currency} ${details.creditLimit.toLocaleString()}`
          : 'N/A',
      isActiveStatus: details.status === 'ACTIVE',
    };
  },
);
