import { describe, it, expect } from 'vitest';
import * as fromSelectors from './cards.selectors';
import { CardsState } from './cards.state';
import { CardAccount } from '../../../features/bank/products/components/cards/models/card-account.model';
import { CardDetail } from '../../../features/bank/products/components/cards/models/card-detail.model';

describe('Cards Selectors', () => {
  const mockAccounts: CardAccount[] = [
    {
      id: 'acc1',
      iban: 'GE29TIA7890123456789012',
      name: 'Main GEL Account',
      balance: 4500000,
      currency: 'GEL',
      status: 'active',
      cardIds: ['card1', 'card2'],
      openedAt: '2026-01-18T01:10:50.948Z',
    },
    {
      id: 'acc2',
      iban: 'GE29TIA7890123456789013',
      name: 'USD Current',
      balance: 2500000,
      currency: 'USD',
      status: 'active',
      cardIds: [],
      openedAt: '2026-01-18T01:10:50.948Z',
    },
  ];

  const mockCardDetail1: CardDetail = {
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

  const mockCardDetail2: CardDetail = {
    id: 'card2',
    accountId: 'acc1',
    type: 'CREDIT',
    network: 'MASTERCARD',
    design: 'OCEAN_BLUE',
    cardName: 'Secondary Card',
    status: 'ACTIVE',
    allowOnlinePayments: true,
    allowInternational: false,
    allowAtm: true,
    createdAt: '2026-01-18T01:10:50.948Z',
    updatedAt: '2026-01-18T01:10:50.948Z',
  };

  const mockCardDetails: Record<string, CardDetail> = {
    card1: mockCardDetail1,
    card2: mockCardDetail2,
  };

  const mockState: CardsState = {
    accounts: mockAccounts,
    cardImages: {
      card1: 'data:image/svg+xml;base64,image1',
      card2: 'data:image/svg+xml;base64,image2',
    },
    cardDetails: mockCardDetails,
    loading: false,
    error: null,
  };

  describe('selectAllAccounts', () => {
    it('should select all accounts', () => {
      const result = fromSelectors.selectAllAccounts.projector(mockState);
      expect(result).toEqual(mockAccounts);
    });
  });

  describe('selectCardImages', () => {
    it('should select card images', () => {
      const result = fromSelectors.selectCardImages.projector(mockState);
      expect(result).toEqual(mockState.cardImages);
    });
  });

  describe('selectCardDetails', () => {
    it('should select card details', () => {
      const result = fromSelectors.selectCardDetails.projector(mockState);
      expect(result).toEqual(mockCardDetails);
    });
  });

  describe('selectLoading', () => {
    it('should select loading state', () => {
      const result = fromSelectors.selectLoading.projector(mockState);
      expect(result).toBe(false);
    });
  });

  describe('selectError', () => {
    it('should select error', () => {
      const result = fromSelectors.selectError.projector(mockState);
      expect(result).toBeNull();
    });
  });

  describe('selectCardGroups', () => {
    it('should combine accounts with their card images', () => {
      const result = fromSelectors.selectCardGroups.projector(
        mockState.accounts,
        mockState.cardImages
      );

      expect(result).toHaveLength(2);
      expect(result[0].account).toEqual(mockAccounts[0]);
      expect(result[0].cardImages).toHaveLength(2);
      expect(result[0].cardImages[0].cardId).toBe('card1');
      expect(result[0].cardImages[1].cardId).toBe('card2');
    });

    it('should filter out cards without images', () => {
      const partialImages = {
        card1: 'data:image/svg+xml;base64,image1',
      };

      const result = fromSelectors.selectCardGroups.projector(
        mockState.accounts,
        partialImages
      );

      expect(result[0].cardImages).toHaveLength(1);
      expect(result[0].cardImages[0].cardId).toBe('card1');
    });

    it('should return empty cardImages for accounts with no cards', () => {
      const result = fromSelectors.selectCardGroups.projector(
        mockState.accounts,
        mockState.cardImages
      );

      expect(result[1].cardImages).toHaveLength(0);
    });
  });

  describe('selectAccountById', () => {
    it('should select account by id', () => {
      const selector = fromSelectors.selectAccountById('acc1');
      const result = selector.projector(mockState.accounts);
      expect(result).toEqual(mockAccounts[0]);
    });

    it('should return undefined for non-existent account', () => {
      const selector = fromSelectors.selectAccountById('nonexistent');
      const result = selector.projector(mockState.accounts);
      expect(result).toBeUndefined();
    });
  });

  describe('selectCardDetailsByAccountId', () => {
    it('should select all card details for an account', () => {
      const selector = fromSelectors.selectCardDetailsByAccountId('acc1');
      const result = selector.projector(
        mockAccounts[0],
        mockState.cardDetails,
        mockState.cardImages
      );

      expect(result).toHaveLength(2);
      expect(result[0].cardId).toBe('card1');
      expect(result[0].details).toEqual(mockCardDetail1);
      expect(result[0].imageBase64).toBe('data:image/svg+xml;base64,image1');
      expect(result[1].cardId).toBe('card2');
      expect(result[1].details).toEqual(mockCardDetail2);
      expect(result[1].imageBase64).toBe('data:image/svg+xml;base64,image2');
    });

    it('should return empty array when account not found', () => {
      const selector = fromSelectors.selectCardDetailsByAccountId('nonexistent');
      const result = selector.projector(undefined, mockState.cardDetails, mockState.cardImages);
      expect(result).toEqual([]);
    });

    it('should filter out cards without both details and images', () => {
      const selector = fromSelectors.selectCardDetailsByAccountId('acc1');
      const partialDetails = { card1: mockCardDetail1 };
      const result = selector.projector(
        mockAccounts[0],
        partialDetails,
        mockState.cardImages
      );

      expect(result).toHaveLength(1);
      expect(result[0].cardId).toBe('card1');
    });
  });
});