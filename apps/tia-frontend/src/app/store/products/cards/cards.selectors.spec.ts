
import { describe, it, expect } from 'vitest';
import {
  selectAllAccounts,
  selectCardGroups,
  selectAccountById,
  selectCardDetailsByAccountId,
  selectCardDetailById,
  selectCardCreationData,
  selectIsCreateModalOpen,
  selectLoading,
  selectError,
  selectCardDesigns,
  selectCardCategories,
  selectCardTypes,
  selectIsCreating,
  selectCreateError,
  selectShowSuccessAlert,
  selectCardCreationDataLoading,
} from './cards.selectors';
import { CardsState } from './cards.state';

describe('CardsSelectors - Full Coverage', () => {
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
    error: 'some error',
    cardDetailsLoading: false,
    cardDetailsError: 'details error',
    designs: [{ id: 'blue', designName: 'Blue', uri: 'uri1' }],
    categories: [{ value: 'DEBIT' as const, displayName: 'Debit' }],
    types: [{ value: 'VISA' as const, displayName: 'Visa' }],
    isCreating: true,
    createError: 'create failed',
    isCreateModalOpen: true,
    showSuccessAlert: true,
  };

  it('should select all accounts', () => {
    expect(selectAllAccounts.projector(mockState)).toEqual(mockState.accounts);
  });

  it('should select card groups', () => {
    const result = selectCardGroups.projector(mockState.accounts, mockState.cardImages);
    expect(result[0].cardImages[0].cardId).toBe('card-1');
  });

  it('should select account by id', () => {
    expect(selectAccountById('acc-1').projector(mockState.accounts)?.id).toBe('acc-1');
    expect(selectAccountById('unknown').projector(mockState.accounts)).toBeUndefined();
  });

  it('should select card details by account id', () => {
    const result = selectCardDetailsByAccountId('acc-1').projector(
      mockState.accounts[0],
      mockState.cardDetails,
      mockState.cardImages
    );
    expect(result.length).toBe(1);
    expect(result[0].cardId).toBe('card-1');

    const empty = selectCardDetailsByAccountId('unknown').projector(
      undefined,
      mockState.cardDetails,
      mockState.cardImages
    );
    expect(empty).toEqual([]);
  });

  it('should select card detail by id', () => {
    expect(selectCardDetailById('card-1').projector(mockState.cardDetails, mockState.cardImages)?.cardId).toBe('card-1');
    expect(selectCardDetailById('unknown').projector(mockState.cardDetails, mockState.cardImages)).toBeNull();
  });

  it('should select card creation data', () => {
    const result = selectCardCreationData.projector(mockState.designs, mockState.categories, mockState.types, mockState.accounts);
    expect(result.designs).toEqual(mockState.designs);
    expect(result.accounts).toEqual(mockState.accounts);
  });

  it('should select isCreateModalOpen', () => {
    expect(selectIsCreateModalOpen.projector(mockState)).toBe(true);
  });

  // ---- Additional selectors for full coverage ----
  it('should select loading', () => {
    expect(selectLoading.projector(mockState)).toBe(false);
  });

  it('should select error', () => {
    expect(selectError.projector(mockState)).toBe('some error');
  });

  it('should select card designs', () => {
    expect(selectCardDesigns.projector(mockState)).toEqual(mockState.designs);
  });

  it('should select card categories', () => {
    expect(selectCardCategories.projector(mockState)).toEqual(mockState.categories);
  });

  it('should select card types', () => {
    expect(selectCardTypes.projector(mockState)).toEqual(mockState.types);
  });

  it('should select isCreating', () => {
    expect(selectIsCreating.projector(mockState)).toBe(true);
  });

  it('should select createError', () => {
    expect(selectCreateError.projector(mockState)).toBe('create failed');
  });

  it('should select showSuccessAlert', () => {
    expect(selectShowSuccessAlert.projector(mockState)).toBe(true);
  });

  it('should select cardCreationDataLoading', () => {
    expect(selectCardCreationDataLoading.projector(mockState)).toBe(false);
  });
});
