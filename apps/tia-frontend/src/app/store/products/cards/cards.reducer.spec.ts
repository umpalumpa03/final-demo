import { describe, it, expect } from 'vitest';
import { Action } from '@ngrx/store';
import { cardsReducer } from './cards.reducer';
import { initialCardsState } from './cards.state';
import * as CardsActions from './cards.actions';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import { CardDetail } from '@tia/shared/models/cards/card-detail.model';
import { CardDesign } from '@tia/shared/models/cards/card-design.model';
import { CardCategory } from '@tia/shared/models/cards/card-category.model';
import { CardType } from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/card-type.model';

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
    type: 'DEBIT' as const,
    network: 'VISA' as const,
    design: 'MIDNIGHT_GRADIENT',
    cardName: 'Main Visa',
    status: 'ACTIVE' as const,
    allowOnlinePayments: true,
    allowInternational: true,
    allowAtm: true,
    createdAt: '2026-01-18T01:10:50.948Z',
    updatedAt: '2026-01-18T01:10:50.948Z',
  };

  const mockDesigns: CardDesign[] = [
    { id: 'design-1', designName: 'Classic', uri: '/designs/classic.png' },
  ];
  const mockCategories: CardCategory[] = [
    { value: 'DEBIT' as const, displayName: 'Debit Card' },
  ];
  const mockTypes: CardType[] = [
    { value: 'VISA' as const, displayName: 'Visa' },
  ];

  it('should return initial state', () => {
    const action: Action = { type: 'UNKNOWN' };
    const state = cardsReducer(undefined, action);
    expect(state).toEqual(initialCardsState);
  });

  it('should handle loadCardAccounts', () => {
    const action = CardsActions.loadCardAccounts();
    const state = cardsReducer(initialCardsState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle loadCardAccountsSuccess', () => {
    const action = CardsActions.loadCardAccountsSuccess({
      accounts: mockAccounts,
    });
    const state = cardsReducer(initialCardsState, action);
    expect(state.accounts).toEqual(mockAccounts);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle loadCardAccountsFailure', () => {
    const action = CardsActions.loadCardAccountsFailure({ error: 'Error' });
    const state = cardsReducer(initialCardsState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error');
  });

  it('should handle loadCardImageSuccess', () => {
    const action = CardsActions.loadCardImageSuccess({
      cardId: 'card1',
      imageBase64: 'base64',
    });
    const state = cardsReducer(initialCardsState, action);
    expect(state.cardImages['card1']).toBe('base64');
  });

  it('should handle loadCardDetails', () => {
    const action = CardsActions.loadCardDetails({ cardId: 'card1' });
    const state = cardsReducer(initialCardsState, action);
    expect(state.cardDetailsLoading).toBe(true);
    expect(state.cardDetailsError).toBeNull();
  });

  it('should handle loadCardDetailsSuccess', () => {
    const action = CardsActions.loadCardDetailsSuccess({
      cardId: 'card1',
      details: mockCardDetail,
    });
    const state = cardsReducer(initialCardsState, action);
    expect(state.cardDetails['card1']).toEqual(mockCardDetail);
    expect(state.cardDetailsLoading).toBe(false);
    expect(state.cardDetailsError).toBeNull();
  });

  it('should handle loadCardDetailsFailure', () => {
    const action = CardsActions.loadCardDetailsFailure({
      cardId: 'card1',
      error: 'Error',
    });
    const state = cardsReducer(initialCardsState, action);
    expect(state.cardDetailsLoading).toBe(false);
    expect(state.cardDetailsError).toBe('Error');
  });

  it('should handle loadCardCreationData', () => {
    const action = CardsActions.loadCardCreationData();
    const state = cardsReducer(initialCardsState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle loadCardCreationDataSuccess', () => {
    const action = CardsActions.loadCardCreationDataSuccess({
      designs: mockDesigns,
      categories: mockCategories,
      types: mockTypes,
    });
    const state = cardsReducer(initialCardsState, action);
    expect(state.designs).toEqual(mockDesigns);
    expect(state.categories).toEqual(mockCategories);
    expect(state.types).toEqual(mockTypes);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle loadCardCreationDataFailure', () => {
    const action = CardsActions.loadCardCreationDataFailure({ error: 'Error' });
    const state = cardsReducer(initialCardsState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error');
  });

  it('should handle createCard', () => {
    const action = CardsActions.createCard({
      request: {
        accountId: 'acc1',
        design: 'design-1',
        cardName: 'My Card',
        cardCategory: 'DEBIT',
        cardType: 'VISA',
      },
    });
    const state = cardsReducer(initialCardsState, action);
    expect(state.isCreating).toBe(true);
    expect(state.createError).toBeNull();
  });

  it('should handle createCardSuccess', () => {
    const action = CardsActions.createCardSuccess();
    const state = cardsReducer(initialCardsState, action);
    expect(state.isCreating).toBe(false);
    expect(state.createError).toBeNull();
    expect(state.isCreateModalOpen).toBe(false);
    expect(state.showSuccessAlert).toBe(true);
  });

  it('should handle createCardFailure', () => {
    const action = CardsActions.createCardFailure({ error: 'Error' });
    const state = cardsReducer(initialCardsState, action);
    expect(state.isCreating).toBe(false);
    expect(state.createError).toBe('Error');
  });

  it('should handle openCreateCardModal', () => {
    const action = CardsActions.openCreateCardModal();
    const state = cardsReducer(initialCardsState, action);
    expect(state.isCreateModalOpen).toBe(true);
  });

  it('should handle closeCreateCardModal', () => {
    const action = CardsActions.closeCreateCardModal();
    const state = cardsReducer(initialCardsState, action);
    expect(state.isCreateModalOpen).toBe(false);
    expect(state.createError).toBeNull();
  });

  it('should handle hideSuccessAlert', () => {
    const action = CardsActions.hideSuccessAlert();
    const state = cardsReducer(initialCardsState, action);
    expect(state.showSuccessAlert).toBe(false);
  });
});
