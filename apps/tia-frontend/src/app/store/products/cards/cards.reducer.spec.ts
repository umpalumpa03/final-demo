import { describe, it, expect } from 'vitest';
import { cardsReducer } from './cards.reducer';
import { initialCardsState } from './cards.state';
import * as CardsActions from './cards.actions';

describe('CardsReducer', () => {
  it('should set loading true on loadCardAccounts', () => {
    const state = cardsReducer(
      initialCardsState,
      CardsActions.loadCardAccounts(),
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should set accounts on loadCardAccountsSuccess', () => {
    const mockAccounts = [
      {
        id: 'acc-1',
        iban: 'GE123',
        name: 'Main',
        balance: 1000,
        currency: 'GEL',
        status: 'ACTIVE',
        cardIds: ['card-1'],
        openedAt: '2024-01-01',
      },
    ];
    const state = cardsReducer(
      { ...initialCardsState, loading: true },
      CardsActions.loadCardAccountsSuccess({ accounts: mockAccounts }),
    );
    expect(state.accounts).toEqual(mockAccounts);
    expect(state.loading).toBe(false);
  });

  it('should set error on loadCardAccountsFailure', () => {
    const state = cardsReducer(
      initialCardsState,
      CardsActions.loadCardAccountsFailure({ error: 'Error' }),
    );
    expect(state.error).toBe('Error');
    expect(state.loading).toBe(false);
  });

  it('should add image on loadCardImageSuccess', () => {
    const state = cardsReducer(
      initialCardsState,
      CardsActions.loadCardImageSuccess({
        cardId: 'card-1',
        imageBase64: 'base64_abc',
      }),
    );
    expect(state.cardImages['card-1']).toBe('base64_abc');
  });

  it('should set cardDetailsLoading on loadCardDetails', () => {
    const state = cardsReducer(
      initialCardsState,
      CardsActions.loadCardDetails({ cardId: 'card-1' }),
    );
    expect(state.cardDetailsLoading).toBe(true);
    expect(state.cardDetailsError).toBeNull();
  });

  it('should add details on loadCardDetailsSuccess', () => {
    const mockDetails = {
      id: 'card-1',
      accountId: 'acc-1',
      type: 'DEBIT' as const,
      network: 'VISA' as const,
      design: 'blue',
      cardName: 'My Card',
      status: 'ACTIVE' as const,
      allowOnlinePayments: true,
      allowInternational: true,
      allowAtm: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };
    const state = cardsReducer(
      initialCardsState,
      CardsActions.loadCardDetailsSuccess({
        cardId: 'card-1',
        details: mockDetails,
      }),
    );
    expect(state.cardDetails['card-1']).toEqual(mockDetails);
    expect(state.cardDetailsLoading).toBe(false);
  });

  it('should set cardDetailsError on loadCardDetailsFailure', () => {
    const state = cardsReducer(
      initialCardsState,
      CardsActions.loadCardDetailsFailure({
        cardId: 'card-1',
        error: 'Detail failed',
      }),
    );
    expect(state.cardDetailsError).toBe('Detail failed');
    expect(state.cardDetailsLoading).toBe(false);
  });

  it('should set loading on loadCardCreationData', () => {
    const state = cardsReducer(
      initialCardsState,
      CardsActions.loadCardCreationData(),
    );
    expect(state.loading).toBe(true);
  });

  it('should set creation data on loadCardCreationDataSuccess', () => {
    const mockData = {
      designs: [{ id: 'blue', designName: 'Blue', uri: 'uri1' }],
      categories: [{ value: 'DEBIT' as const, displayName: 'Debit' }],
      types: [{ value: 'VISA' as const, displayName: 'Visa' }],
    };
    const state = cardsReducer(
      initialCardsState,
      CardsActions.loadCardCreationDataSuccess(mockData),
    );
    expect(state.designs).toEqual(mockData.designs);
    expect(state.loading).toBe(false);
  });

  it('should set error on loadCardCreationDataFailure', () => {
    const state = cardsReducer(
      initialCardsState,
      CardsActions.loadCardCreationDataFailure({ error: 'Failed' }),
    );
    expect(state.error).toBe('Failed');
    expect(state.loading).toBe(false);
  });

  it('should set isCreating on createCard', () => {
    const state = cardsReducer(
      initialCardsState,
      CardsActions.createCard({
        request: {
          accountId: 'acc-1',
          design: 'blue',
          cardName: 'Test',
          cardCategory: 'DEBIT',
          cardType: 'VISA',
        },
      }),
    );
    expect(state.isCreating).toBe(true);
    expect(state.createError).toBeNull();
  });

  it('should close modal and show alert on createCardSuccess', () => {
    const state = cardsReducer(
      { ...initialCardsState, isCreating: true, isCreateModalOpen: true },
      CardsActions.createCardSuccess(),
    );
    expect(state.isCreating).toBe(false);
    expect(state.isCreateModalOpen).toBe(false);
    expect(state.showSuccessAlert).toBe(true);
  });

  it('should set createError on createCardFailure', () => {
    const state = cardsReducer(
      { ...initialCardsState, isCreating: true },
      CardsActions.createCardFailure({ error: 'Create failed' }),
    );
    expect(state.isCreating).toBe(false);
    expect(state.createError).toBe('Create failed');
  });

  it('should open modal on openCreateCardModal', () => {
    const state = cardsReducer(
      initialCardsState,
      CardsActions.openCreateCardModal(),
    );
    expect(state.isCreateModalOpen).toBe(true);
  });

  it('should close modal and clear error on closeCreateCardModal', () => {
    const state = cardsReducer(
      { ...initialCardsState, isCreateModalOpen: true, createError: 'err' },
      CardsActions.closeCreateCardModal(),
    );
    expect(state.isCreateModalOpen).toBe(false);
    expect(state.createError).toBeNull();
  });

  it('should hide success alert on hideSuccessAlert', () => {
    const state = cardsReducer(
      { ...initialCardsState, showSuccessAlert: true },
      CardsActions.hideSuccessAlert(),
    );
    expect(state.showSuccessAlert).toBe(false);
  });
  it('should open card details modal', () => {
    const state = cardsReducer(
      initialCardsState,
      CardsActions.openCardDetailsModal({ cardId: 'card-1' }),
    );
    expect(state.isCardDetailsModalOpen).toBe(true);
    expect(state.selectedCardIdForModal).toBe('card-1');
  });

  it('should close card details modal', () => {
    const state = cardsReducer(
      {
        ...initialCardsState,
        isCardDetailsModalOpen: true,
        selectedCardIdForModal: 'card-1',
      },
      CardsActions.closeCardDetailsModal(),
    );
    expect(state.isCardDetailsModalOpen).toBe(false);
    expect(state.selectedCardIdForModal).toBeNull();
  });
});
it('should handle card transactions actions', () => {
  let state = cardsReducer(
    initialCardsState,
    CardsActions.loadCardTransactions({ cardId: 'card-1' }),
  );
  expect(state.cardTransactionsLoading).toBe(true);

  const transactions = [{ id: 'tx-1' }] as any[];
  state = cardsReducer(
    state,
    CardsActions.loadCardTransactionsSuccess({
      cardId: 'card-1',
      transactions,
      total: 5,
    }),
  );
  expect(state.cardTransactions['card-1']).toEqual(transactions);
  expect(state.cardTransactionsTotalCount['card-1']).toBe(5);
  expect(state.cardTransactionsLoading).toBe(false);

  state = cardsReducer(
    initialCardsState,
    CardsActions.loadCardTransactionsFailure({ cardId: 'card-1', error: 'Failed' }),
  );
  expect(state.cardTransactionsError).toBe('Failed');
  expect(state.cardTransactionsLoading).toBe(false);
});
it('should set cardImagesLoading on loadCardAccountsSuccess', () => {
  const mockAccounts = [
    {
      id: 'acc-1',
      iban: 'GE123',
      name: 'Main',
      balance: 1000,
      currency: 'GEL',
      status: 'ACTIVE',
      cardIds: ['card-1'],
      openedAt: '2024-01-01',
    },
  ];
  const state = cardsReducer(
    initialCardsState,
    CardsActions.loadCardAccountsSuccess({ accounts: mockAccounts }),
  );
  expect(state.cardImagesLoading).toBe(true);
});

it('should set cardImagesLoading false on loadCardImagesComplete', () => {
  const state = cardsReducer(
    { ...initialCardsState, cardImagesLoading: true },
    CardsActions.loadCardImagesComplete(),
  );
  expect(state.cardImagesLoading).toBe(false);
});
it('should set isUpdatingCardName on updateCardName', () => {
  const state = cardsReducer(
    initialCardsState,
    CardsActions.updateCardName({ cardId: 'card-1', cardName: 'New Name' })
  );
  expect(state.isUpdatingCardName).toBe(true);
  expect(state.updateCardNameError).toBeNull();
});

it('should update card name on updateCardNameSuccess', () => {
  const state = cardsReducer(
    {
      ...initialCardsState,
      cardDetails: {
        'card-1': {
          id: 'card-1',
          accountId: 'acc-1',
          type: 'DEBIT' as const,
          network: 'VISA' as const,
          design: 'blue',
          cardName: 'Old Name',
          status: 'ACTIVE' as const,
          allowOnlinePayments: true,
          allowInternational: true,
          allowAtm: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      },
    },
    CardsActions.updateCardNameSuccess({ cardId: 'card-1', cardName: 'New Name' })
  );
  expect(state.cardDetails['card-1'].cardName).toBe('New Name');
  expect(state.isUpdatingCardName).toBe(false);
});

it('should set error on updateCardNameFailure', () => {
  const state = cardsReducer(
    initialCardsState,
    CardsActions.updateCardNameFailure({ cardId: 'card-1', error: 'Failed' })
  );
  expect(state.updateCardNameError).toBe('Failed');
  expect(state.isUpdatingCardName).toBe(false);
});