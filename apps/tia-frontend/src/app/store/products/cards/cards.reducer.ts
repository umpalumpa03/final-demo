import { createReducer, on } from '@ngrx/store';
import { initialCardsState } from './cards.state';
import * as CardsActions from './cards.actions';

export const cardsReducer = createReducer(
  initialCardsState,
  on(CardsActions.loadCardAccounts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CardsActions.loadCardAccountsSuccess, (state, { accounts }) => ({
    ...state,
    accounts,
    loading: false,
    error: null,
  })),
  on(CardsActions.loadCardAccountsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(CardsActions.loadCardImage, (state) => ({
    ...state,
  })),
  on(CardsActions.loadCardImageSuccess, (state, { cardId, imageBase64 }) => ({
    ...state,
    cardImages: {
      ...state.cardImages,
      [cardId]: imageBase64,
    },
  })),
  on(CardsActions.loadCardImageFailure, (state) => ({
    ...state,
  })),
  on(CardsActions.loadCardDetails, (state) => ({
    ...state,
  })),
  on(CardsActions.loadCardDetailsSuccess, (state, { cardId, details }) => ({
    ...state,
    cardDetails: {
      ...state.cardDetails,
      [cardId]: details,
    },
  })),
  on(CardsActions.loadCardDetailsFailure, (state) => ({
    ...state,
  })),
);
