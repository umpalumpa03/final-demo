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