import { describe, it, expect } from 'vitest';
import {
  selectAllAccounts,
  selectCardGroups,
  selectCardDetailsByAccountId,
  selectCardCreationData,
  selectIsCreateModalOpen,
} from './cards.selectors';
import { CardsState } from './cards.state';

describe('CardsSelectors', () => {
  const mockState: CardsState = {
    accounts: [
      { id: 'acc-1', iban: 'GE123', name: 'Main', balance: 1000, currency: 'GEL', status: 'ACTIVE', cardIds: ['card-1'], openedAt: '2024-01-01' },
    ],
    cardImages: { 'card-1': 'base64image' },
    cardDetails: {
      'card-1': {
        id: 'card-1', accountId: 'acc-1', type: 'DEBIT' as const, network: 'VISA' as const,
        design: 'blue', cardName: 'My Card', status: 'ACTIVE' as const,
        allowOnlinePayments: true, allowInternational: true, allowAtm: true,
        createdAt: '2024-01-01', updatedAt: '2024-01-01',
      },
    },
    loading: false,
    error: null,
    cardDetailsLoading: false,
    cardDetailsError: null,
    designs: [{ id: 'blue', designName: 'Blue', uri: 'uri1' }],
    categories: [{ value: 'DEBIT' as const, displayName: 'Debit' }],
    types: [{ value: 'VISA' as const, displayName: 'Visa' }],
    isCreating: false,
    createError: null,
    isCreateModalOpen: false,
    showSuccessAlert: false,
  };

  it('should select all accounts', () => {
    const result = selectAllAccounts.projector(mockState);
    expect(result).toEqual(mockState.accounts);
  });

  it('should select card groups with images', () => {
    const result = selectCardGroups.projector(mockState.accounts, mockState.cardImages);
    expect(result[0].cardImages).toHaveLength(1);
    expect(result[0].cardImages[0].cardId).toBe('card-1');
  });

  it('should select card details by account id', () => {
    const result = selectCardDetailsByAccountId('acc-1').projector(
      mockState.accounts[0],
      mockState.cardDetails,
      mockState.cardImages
    );
    expect(result).toHaveLength(1);
    expect(result[0].cardId).toBe('card-1');
  });

  it('should select card creation data', () => {
    const result = selectCardCreationData.projector(
      mockState.designs,
      mockState.categories,
      mockState.types,
      mockState.accounts
    );
    expect(result.designs).toEqual(mockState.designs);
    expect(result.accounts).toEqual(mockState.accounts);
  });

  it('should select isCreateModalOpen', () => {
    const result = selectIsCreateModalOpen.projector(mockState);
    expect(result).toBe(false);
  });
});