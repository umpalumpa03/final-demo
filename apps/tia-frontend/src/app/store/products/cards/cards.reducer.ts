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
on(CardsActions.updateCardName, (state) => ({
  ...state,
  isUpdatingCardName: true,
  updateCardNameError: null,
})),

on(CardsActions.updateCardNameSuccess, (state, { cardId, cardName }) => ({
  ...state,
  cardDetails: {
    ...state.cardDetails,
    [cardId]: {
      ...state.cardDetails[cardId],
      cardName,
    },
  },
  isUpdatingCardName: false,
  updateCardNameError: null,
})),

on(CardsActions.updateCardNameFailure, (state, { error }) => ({
  ...state,
  isUpdatingCardName: false,
  updateCardNameError: error,
})),
on(CardsActions.requestCardOtp, (state) => ({
  ...state,
  otpLoading: true,
  otpError: null,
})),

on(CardsActions.requestCardOtpSuccess, (state, { challengeId }) => ({
  ...state,
  challengeId,
  otpLoading: false,
  otpError: null,
})),

on(CardsActions.requestCardOtpFailure, (state, { error }) => ({
  ...state,
  otpLoading: false,
  otpError: error,
})),

on(CardsActions.verifyCardOtp, (state) => ({
  ...state,
  otpLoading: true,
  otpError: null,
})),

on(CardsActions.verifyCardOtpSuccess, (state, { cardId, sensitiveData }) => ({
  ...state,
  cardSensitiveData: {
    ...state.cardSensitiveData,
    [cardId]: sensitiveData,
  },
  otpLoading: false,
  otpError: null,
  isOtpModalOpen: false,
  showOtpSuccessAlert: true,
})),

on(CardsActions.verifyCardOtpFailure, (state, { error }) => ({
  ...state,
  otpLoading: false,
  otpError: error,
  otpRemainingAttempts: state.otpRemainingAttempts - 1,
})),

on(CardsActions.openCardOtpModal, (state, { cardId }) => ({
  ...state,
  isOtpModalOpen: true,
  selectedCardIdForOtp: cardId,
  otpError: null,
})),

on(CardsActions.closeCardOtpModal, (state) => ({
  ...state,
  isOtpModalOpen: false,
  selectedCardIdForOtp: null,
  otpError: null,
  challengeId: null,
})),

on(CardsActions.clearCardSensitiveData, (state) => ({
  ...state,
  cardSensitiveData: {},
  showOtpSuccessAlert: false,
})),
on(CardsActions.showGlobalAlert, (state, { message, alertType }) => ({
  ...state,
  globalAlert: { message, alertType },
})),

on(CardsActions.hideGlobalAlert, (state) => ({
  ...state,
  globalAlert: null,
})),
on(CardsActions.openCardOtpModal, (state, { cardId }) => ({
  ...state,
  isOtpModalOpen: true,
  selectedCardIdForOtp: cardId,
  otpError: null,
  otpRemainingAttempts: 3,
})),

on(CardsActions.setCurrentCardIndex, (state, { cardIndex, accountId }) => ({
  ...state,
  currentCardIndex: cardIndex,
  currentAccountId: accountId,
})),

on(CardsActions.navigateToNextCard, (state) => {
  const account = state.accounts.find(acc => acc.id === state.currentAccountId);
  if (!account || account.cardIds.length === 0) return state;
  const maxIndex = account.cardIds.length - 1;
  const nextIndex = state.currentCardIndex >= maxIndex ? 0 : state.currentCardIndex + 1;
  return {
    ...state,
    currentCardIndex: nextIndex,
  };
}),

on(CardsActions.navigateToPreviousCard, (state) => {
  const account = state.accounts.find(acc => acc.id === state.currentAccountId);
  if (!account || account.cardIds.length === 0) return state;
  const maxIndex = account.cardIds.length - 1;
  const previousIndex = state.currentCardIndex <= 0 ? maxIndex : state.currentCardIndex - 1;
  return {
    ...state,
    currentCardIndex: previousIndex,
  };
}),

);
