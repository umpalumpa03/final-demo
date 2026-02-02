import { describe, it, expect } from 'vitest';
import { cardsReducer } from './cards.reducer';
import { initialCardsState } from './cards.state';
import * as CardsActions from './cards.actions';

describe('CardsReducer', () => {
  it('should set accounts on loadCardAccountsSuccess', () => {
    const mockAccounts = [
      { id: 'acc-1', iban: 'GE123', name: 'Main', balance: 1000, currency: 'GEL', status: 'ACTIVE', cardIds: ['card-1'], openedAt: '2024-01-01' },
    ];
    const action = CardsActions.loadCardAccountsSuccess({ accounts: mockAccounts });
    const state = cardsReducer(initialCardsState, action);

    expect(state.accounts).toEqual(mockAccounts);
    expect(state.loading).toBe(false);
  });

  it('should set error on loadCardAccountsFailure', () => {
    const action = CardsActions.loadCardAccountsFailure({ error: 'Error message' });
    const state = cardsReducer(initialCardsState, action);

    expect(state.error).toBe('Error message');
  });

  it('should add card details on loadCardDetailsSuccess', () => {
    const mockDetails = {
      id: 'card-1', accountId: 'acc-1', type: 'DEBIT' as const, network: 'VISA' as const,
      design: 'blue', cardName: 'My Card', status: 'ACTIVE' as const,
      allowOnlinePayments: true, allowInternational: true, allowAtm: true,
      createdAt: '2024-01-01', updatedAt: '2024-01-01',
    };
    const action = CardsActions.loadCardDetailsSuccess({ cardId: 'card-1', details: mockDetails });
    const state = cardsReducer(initialCardsState, action);

    expect(state.cardDetails['card-1']).toEqual(mockDetails);
  });

  it('should set creation data on loadCardCreationDataSuccess', () => {
    const mockData = {
      designs: [{ id: 'blue', designName: 'Blue', uri: 'uri1' }],
      categories: [{ value: 'DEBIT' as const, displayName: 'Debit' }],
      types: [{ value: 'VISA' as const, displayName: 'Visa' }],
    };
    const action = CardsActions.loadCardCreationDataSuccess(mockData);
    const state = cardsReducer(initialCardsState, action);

    expect(state.designs).toEqual(mockData.designs);
    expect(state.loading).toBe(false);
  });

  it('should close modal and show success alert on createCardSuccess', () => {
    const action = CardsActions.createCardSuccess();
    const state = cardsReducer(initialCardsState, action);

    expect(state.isCreateModalOpen).toBe(false);
    expect(state.showSuccessAlert).toBe(true);
  });

  it('should open modal on openCreateCardModal', () => {
    const action = CardsActions.openCreateCardModal();
    const state = cardsReducer(initialCardsState, action);

    expect(state.isCreateModalOpen).toBe(true);
  });
});