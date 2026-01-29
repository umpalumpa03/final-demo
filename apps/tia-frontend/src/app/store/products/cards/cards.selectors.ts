import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CardsState } from './cards.state';
import { CardGroup } from '../../../features/bank/products/components/cards/models/card-group.model';

export const selectCardsState = createFeatureSelector<CardsState>('cards');

export const selectAllAccounts = createSelector(
  selectCardsState,
  (state) => state.accounts
);

export const selectCardImages = createSelector(
  selectCardsState,
  (state) => state.cardImages
);

export const selectCardDetails = createSelector(
  selectCardsState,
  (state) => state.cardDetails
);

export const selectLoading = createSelector(
  selectCardsState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectCardsState,
  (state) => state.error
);

export const selectCardGroups = createSelector(
  selectAllAccounts,
  selectCardImages,
  (accounts, cardImages): CardGroup[] => {
    return accounts.map((account) => ({
      account,
      cardImages: account.cardIds
        .filter((cardId) => cardImages[cardId])
        .map((cardId) => ({
          cardId,
          imageBase64: cardImages[cardId],
        })),
    }));
  }
);

export const selectAccountById = (accountId: string) =>
  createSelector(selectAllAccounts, (accounts) =>
    accounts.find((account) => account.id === accountId)
  );

export const selectCardDetailsByAccountId = (accountId: string) =>
  createSelector(
    selectAccountById(accountId),
    selectCardDetails,
    selectCardImages,
    (account, cardDetails, cardImages) => {
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
    }
  );