import { describe, it, expect } from 'vitest';
import { cardsReducer } from './cards.reducer';
import { initialCardsState, CardsState } from './cards.state';
import * as CardsActions from './cards.actions';
import { CardAccount } from '../../../features/bank/products/components/cards/models/card-account.model';
import { CardDetail } from '../../../features/bank/products/components/cards/models/card-detail.model';

describe('Cards Reducer', () => {
  const mockAccounts: CardAccount[] = [
    {
      id: 'acc1',
      iban: 'GE29TIA7890123456789012',
      name: 'Main GEL Account',
      balance: 4500000,
      currency: 'GEL',
      status: 'active',
      cardIds: ['card1'],
      openedAt: '2026-01-18T01:10:50.948Z',
    },
  ];

  const mockCardDetail: CardDetail = {
    id: 'card1',
    accountId: 'acc1',
    type: 'DEBIT',
    network: 'VISA',
    design: 'MIDNIGHT_GRADIENT',
    cardName: 'Main Visa',
    status: 'ACTIVE',
    allowOnlinePayments: true,
    allowInternational: true,
    allowAtm: true,
    createdAt: '2026-01-18T01:10:50.948Z',
    updatedAt: '2026-01-18T01:10:50.948Z',
  };

  const cardId = 'card1';
  const imageBase64 = 'data:image/svg+xml;base64,test';

  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = { type: 'Unknown' } as any;
      const state = cardsReducer(initialCardsState, action);
      expect(state).toBe(initialCardsState);
    });
  });

  describe('loadCardAccounts', () => {
    it('should set loading to true and clear error', () => {
      const action = CardsActions.loadCardAccounts();
      const state = cardsReducer(initialCardsState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('loadCardAccountsSuccess', () => {
    it('should populate accounts and set loading to false', () => {
      const action = CardsActions.loadCardAccountsSuccess({ accounts: mockAccounts });
      const state = cardsReducer(initialCardsState, action);

      expect(state.accounts).toEqual(mockAccounts);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('loadCardAccountsFailure', () => {
    it('should set error and loading to false', () => {
      const error = 'Error loading accounts';
      const action = CardsActions.loadCardAccountsFailure({ error });
      const state = cardsReducer(initialCardsState, action);

      expect(state.error).toBe(error);
      expect(state.loading).toBe(false);
    });
  });

  describe('loadCardImage', () => {
    it('should not modify state when loading image', () => {
      const action = CardsActions.loadCardImage({ cardId });
      const state = cardsReducer(initialCardsState, action);
      expect(state).toEqual(initialCardsState);
    });
  });

  describe('loadCardImageSuccess', () => {
    it('should add card image to state', () => {
      const action = CardsActions.loadCardImageSuccess({ cardId, imageBase64 });
      const state = cardsReducer(initialCardsState, action);
      expect(state.cardImages[cardId]).toBe(imageBase64);
    });

    it('should update existing card image', () => {
      const oldImage = 'old-image';
      const newImage = 'new-image';

      const stateWithImage: CardsState = {
        ...initialCardsState,
        cardImages: { [cardId]: oldImage },
      };

      const action = CardsActions.loadCardImageSuccess({ cardId, imageBase64: newImage });
      const state = cardsReducer(stateWithImage, action);
      expect(state.cardImages[cardId]).toBe(newImage);
    });
  });

  describe('loadCardImageFailure', () => {
    it('should not modify state on failure', () => {
      const error = 'Failed to load image';
      const action = CardsActions.loadCardImageFailure({ cardId, error });
      const state = cardsReducer(initialCardsState, action);
      expect(state).toEqual(initialCardsState);
    });
  });

  describe('loadCardDetails', () => {
    it('should not modify state when loading card details', () => {
      const action = CardsActions.loadCardDetails({ cardId });
      const state = cardsReducer(initialCardsState, action);
      expect(state).toEqual(initialCardsState);
    });
  });

  describe('loadCardDetailsSuccess', () => {
    it('should add card details to state', () => {
      const action = CardsActions.loadCardDetailsSuccess({ cardId, details: mockCardDetail });
      const state = cardsReducer(initialCardsState, action);
      expect(state.cardDetails[cardId]).toEqual(mockCardDetail);
    });

    it('should update existing card details', () => {
      const oldDetails: CardDetail = { ...mockCardDetail, cardName: 'Old Name' };
      const newDetails: CardDetail = { ...mockCardDetail, cardName: 'New Name' };

      const stateWithDetails: CardsState = {
        ...initialCardsState,
        cardDetails: { [cardId]: oldDetails },
      };

      const action = CardsActions.loadCardDetailsSuccess({ cardId, details: newDetails });
      const state = cardsReducer(stateWithDetails, action);
      expect(state.cardDetails[cardId]).toEqual(newDetails);
    });
  });

  describe('loadCardDetailsFailure', () => {
    it('should not modify state on failure', () => {
      const error = 'Failed to load card details';
      const action = CardsActions.loadCardDetailsFailure({ cardId, error });
      const state = cardsReducer(initialCardsState, action);
      expect(state).toEqual(initialCardsState);
    });
  });
});