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
    cardDetailsLoading: true,
    cardDetailsError: null,
  })),
  on(CardsActions.loadCardDetailsSuccess, (state, { cardId, details }) => ({
    ...state,
    cardDetails: {
      ...state.cardDetails,
      [cardId]: details,
    },
    cardDetailsLoading: false,
    cardDetailsError: null,
  })),
  on(CardsActions.loadCardDetailsFailure, (state, { error }) => ({
    ...state,
    cardDetailsLoading: false,
    cardDetailsError: error,
  })),
  on(CardsActions.loadCardCreationData, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(
    CardsActions.loadCardCreationDataSuccess,
    (state, { designs, categories, types }) => ({
      ...state,
      designs,
      categories,
      types,
      loading: false,
      error: null,
    }),
  ),
  on(CardsActions.loadCardCreationDataFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(CardsActions.createCard, (state) => ({
    ...state,
    isCreating: true,
    createError: null,
  })),

  on(CardsActions.createCardFailure, (state, { error }) => ({
    ...state,
    isCreating: false,
    createError: error,
  })),
  on(CardsActions.openCreateCardModal, (state) => ({
    ...state,
    isCreateModalOpen: true,
  })),
  on(CardsActions.closeCreateCardModal, (state) => ({
    ...state,
    isCreateModalOpen: false,
    createError: null,
  })),
  on(CardsActions.createCardSuccess, (state) => ({
    ...state,
    isCreating: false,
    createError: null,
    isCreateModalOpen: false,
    showSuccessAlert: true,
  })),
  on(CardsActions.hideSuccessAlert, (state) => ({
    ...state,
    showSuccessAlert: false,
  })),

  on(CardsActions.openCardDetailsModal, (state, { cardId }) => ({
    ...state,
    isCardDetailsModalOpen: true,
    selectedCardIdForModal: cardId,
  })),
  on(CardsActions.closeCardDetailsModal, (state) => ({
    ...state,
    isCardDetailsModalOpen: false,
    selectedCardIdForModal: null,
  })),

  on(CardsActions.loadCardTransactions, (state) => ({
    ...state,
    cardTransactionsLoading: true,
    cardTransactionsError: null,
  })),

  on(
    CardsActions.loadCardTransactionsSuccess,
    (state, { cardId, transactions, total }) => ({
      ...state,
      cardTransactions: {
        ...state.cardTransactions,
        [cardId]: transactions,
      },
      cardTransactionsTotalCount: {
        ...state.cardTransactionsTotalCount,
        [cardId]: total,
      },
      cardTransactionsLoading: false,
      cardTransactionsError: null,
    }),
  ),

  on(CardsActions.loadCardTransactionsFailure, (state, { error }) => ({
    ...state,
    cardTransactionsLoading: false,
    cardTransactionsError: error,
  })),
  on(CardsActions.clearCardTransactionsError, (state) => ({
    ...state,
    cardTransactionsError: null,
  })),

  on(CardsActions.loadCardAccountsSuccess, (state, { accounts }) => ({
  ...state,
  accounts,
  loading: false,
  error: null,
  cardImagesLoading: true,
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
  cardImagesLoading: false, 
})),
on(CardsActions.loadCardImagesComplete, (state) => ({
  ...state,
  cardImagesLoading: false,
})),
);
