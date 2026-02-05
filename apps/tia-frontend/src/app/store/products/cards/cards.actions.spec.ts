import { describe, it, expect } from 'vitest';
import * as CardsActions from './cards.actions';
import { CardDetail } from '@tia/shared/models/cards/card-detail.model';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';


describe('Cards Actions', () => {
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

  describe('loadCardAccounts', () => {
    it('should create action', () => {
      const action = CardsActions.loadCardAccounts();
      expect(action.type).toBe('[Cards] Load Card Accounts');
    });
  });

  describe('loadCardAccountsSuccess', () => {
    it('should create action with accounts payload', () => {
      const action = CardsActions.loadCardAccountsSuccess({ accounts: mockAccounts });
      expect(action.type).toBe('[Cards] Load Card Accounts Success');
      expect(action.accounts).toEqual(mockAccounts);
    });
  });

  describe('loadCardAccountsFailure', () => {
    it('should create action with error payload', () => {
      const error = 'Error message';
      const action = CardsActions.loadCardAccountsFailure({ error });
      expect(action.type).toBe('[Cards] Load Card Accounts Failure');
      expect(action.error).toBe(error);
    });
  });

  describe('loadCardImage', () => {
    it('should create action with cardId payload', () => {
      const cardId = 'card1';
      const action = CardsActions.loadCardImage({ cardId });
      expect(action.type).toBe('[Cards] Load Card Image');
      expect(action.cardId).toBe(cardId);
    });
  });

  describe('loadCardImageSuccess', () => {
    it('should create action with cardId and imageBase64 payload', () => {
      const cardId = 'card1';
      const imageBase64 = 'data:image/svg+xml;base64,test';
      const action = CardsActions.loadCardImageSuccess({ cardId, imageBase64 });
      expect(action.type).toBe('[Cards] Load Card Image Success');
      expect(action.cardId).toBe(cardId);
      expect(action.imageBase64).toBe(imageBase64);
    });
  });

  describe('loadCardImageFailure', () => {
    it('should create action with cardId and error payload', () => {
      const cardId = 'card1';
      const error = 'Error message';
      const action = CardsActions.loadCardImageFailure({ cardId, error });
      expect(action.type).toBe('[Cards] Load Card Image Failure');
      expect(action.cardId).toBe(cardId);
      expect(action.error).toBe(error);
    });
  });

  describe('loadCardDetails', () => {
    it('should create action with cardId payload', () => {
      const cardId = 'card1';
      const action = CardsActions.loadCardDetails({ cardId });
      expect(action.type).toBe('[Cards] Load Card Details');
      expect(action.cardId).toBe(cardId);
    });
  });

  describe('loadCardDetailsSuccess', () => {
    it('should create action with cardId and details payload', () => {
      const cardId = 'card1';
      const action = CardsActions.loadCardDetailsSuccess({ cardId, details: mockCardDetail });
      expect(action.type).toBe('[Cards] Load Card Details Success');
      expect(action.cardId).toBe(cardId);
      expect(action.details).toEqual(mockCardDetail);
    });
  });

  describe('loadCardDetailsFailure', () => {
    it('should create action with cardId and error payload', () => {
      const cardId = 'card1';
      const error = 'Error message';
      const action = CardsActions.loadCardDetailsFailure({ cardId, error });
      expect(action.type).toBe('[Cards] Load Card Details Failure');
      expect(action.cardId).toBe(cardId);
      expect(action.error).toBe(error);
    });
  });
  it('should create openCardDetailsModal action', () => {
  const action = CardsActions.openCardDetailsModal({ cardId: 'card-1' });
  expect(action.type).toBe('[Cards] Open Card Details Modal');
  expect(action.cardId).toBe('card-1');
});

it('should create closeCardDetailsModal action', () => {
  const action = CardsActions.closeCardDetailsModal();
  expect(action.type).toBe('[Cards] Close Card Details Modal');
});
describe('card transactions actions', () => {
  it('should create loadCardTransactions action', () => {
    const action = CardsActions.loadCardTransactions({ cardId: 'card-1' });
    expect(action.type).toBe('[Cards] Load Card Transactions');
    expect(action.cardId).toBe('card-1');
  });

  it('should create loadCardTransactionsSuccess action', () => {
    const transactions = [{ id: 'tx-1' }] as any[];
    const action = CardsActions.loadCardTransactionsSuccess({
      cardId: 'card-1',
      transactions,
      total: 5,
    });
    expect(action.type).toBe('[Cards] Load Card Transactions Success');
    expect(action.transactions).toEqual(transactions);
    expect(action.total).toBe(5);
  });

  it('should create loadCardTransactionsFailure action', () => {
    const action = CardsActions.loadCardTransactionsFailure({
      cardId: 'card-1',
      error: 'Failed',
    });
    expect(action.type).toBe('[Cards] Load Card Transactions Failure');
    expect(action.error).toBe('Failed');
  });
  
});
describe('updateCardName actions', () => {
  it('should create updateCardName action', () => {
    const action = CardsActions.updateCardName({ cardId: 'card-1', cardName: 'New Name' });
    expect(action.type).toBe('[Cards] Update Card Name');
  });

  it('should create updateCardNameSuccess action', () => {
    const action = CardsActions.updateCardNameSuccess({ cardId: 'card-1', cardName: 'New Name' });
    expect(action.type).toBe('[Cards] Update Card Name Success');
  });

  it('should create updateCardNameFailure action', () => {
    const action = CardsActions.updateCardNameFailure({ cardId: 'card-1', error: 'Failed' });
    expect(action.type).toBe('[Cards] Update Card Name Failure');
  });
});
});
