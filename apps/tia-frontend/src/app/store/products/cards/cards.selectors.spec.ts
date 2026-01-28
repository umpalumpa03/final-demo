import { describe, it, expect } from 'vitest';
import * as fromSelectors from './cards.selectors';
import { CardsState } from './cards.state';
import { CardAccount } from '../../../features/bank/products/components/cards/models/card-account.model';

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

  const mockState: CardsState = {
    accounts: mockAccounts,
    cardImages: {
      card1: 'data:image/svg+xml;base64,image1',
      card2: 'data:image/svg+xml;base64,image2',
    },
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
      const stateWithMissingImage: CardsState = {
        ...mockState,
        cardImages: {
          card1: 'data:image/svg+xml;base64,image1',
        },
      };

      const result = fromSelectors.selectCardGroups.projector(
        stateWithMissingImage.accounts,
        stateWithMissingImage.cardImages
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
});