import { describe, it, expect } from 'vitest';
import * as fromSelectors from './cards.selectors';
import { CardsState } from './cards.state';

describe('Cards Selectors', () => {
  const mockAccounts = [
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

  const mockCardDetails = {
    card1: {
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
    },
    card2: {
      id: 'card2',
      accountId: 'acc1',
      type: 'CREDIT' as const,
      network: 'MASTERCARD' as const,
      design: 'OCEAN_BLUE',
      cardName: 'Secondary Card',
      status: 'ACTIVE' as const,
      allowOnlinePayments: true,
      allowInternational: false,
      allowAtm: true,
      createdAt: '2026-01-18T01:10:50.948Z',
      updatedAt: '2026-01-18T01:10:50.948Z',
    },
  };

  const mockCardImages = {
    card1: 'data:image/svg+xml;base64,image1',
    card2: 'data:image/svg+xml;base64,image2',
  };

  const mockState: CardsState = {
    accounts: mockAccounts,
    cardImages: mockCardImages,
    cardDetails: mockCardDetails,
    loading: false,
    error: null,
    cardDetailsLoading: false,
    cardDetailsError: null,
    designs: [],
    categories: [],
    types: [],
    isCreating: false,
    createError: null,
    isCreateModalOpen: false,
    showSuccessAlert: false,
  };

  it('should select all accounts', () => {
    const result = fromSelectors.selectAllAccounts.projector(mockState);
    expect(result).toEqual(mockAccounts);
  });

  it('should select card images', () => {
    const result = fromSelectors.selectCardImages.projector(mockState);
    expect(result).toEqual(mockCardImages);
  });

  it('should select card details', () => {
    const result = fromSelectors.selectCardDetails.projector(mockState);
    expect(result).toEqual(mockCardDetails);
  });

  it('should select loading state', () => {
    const result = fromSelectors.selectLoading.projector(mockState);
    expect(result).toBe(false);
  });

  it('should select error', () => {
    const result = fromSelectors.selectError.projector(mockState);
    expect(result).toBeNull();
  });

  it('should select cardDetailsLoading state', () => {
    const result = fromSelectors.selectCardDetailsLoading.projector(mockState);
    expect(result).toBe(false);
  });

  it('should select cardDetailsError', () => {
    const result = fromSelectors.selectCardDetailsError.projector(mockState);
    expect(result).toBeNull();
  });

  it('should combine accounts with card images into groups', () => {
    const result = fromSelectors.selectCardGroups.projector(mockAccounts, mockCardImages);
    expect(result).toHaveLength(2);
    expect(result[0].account).toEqual(mockAccounts[0]);
    expect(result[0].cardImages).toHaveLength(2);
    expect(result[0].cardImages[0].cardId).toBe('card1');
    expect(result[1].cardImages).toHaveLength(0);
  });

  it('should filter cards without images in groups', () => {
    const partialImages = { card1: 'data:image/svg+xml;base64,image1' };
    const result = fromSelectors.selectCardGroups.projector(mockAccounts, partialImages);
    expect(result[0].cardImages).toHaveLength(1);
  });

  it('should select account by id', () => {
    const selector = fromSelectors.selectAccountById('acc1');
    const result = selector.projector(mockAccounts);
    expect(result).toEqual(mockAccounts[0]);
  });

  it('should return undefined for non-existent account', () => {
    const selector = fromSelectors.selectAccountById('nonexistent');
    const result = selector.projector(mockAccounts);
    expect(result).toBeUndefined();
  });

  it('should select card details by account id', () => {
    const selector = fromSelectors.selectCardDetailsByAccountId('acc1');
    const result = selector.projector(mockAccounts[0], mockCardDetails, mockCardImages);
    expect(result).toHaveLength(2);
    expect(result[0].cardId).toBe('card1');
    expect(result[0].details).toEqual(mockCardDetails.card1);
    expect(result[0].imageBase64).toBe(mockCardImages.card1);
  });

  it('should return empty array when account not found', () => {
    const selector = fromSelectors.selectCardDetailsByAccountId('nonexistent');
    const result = selector.projector(undefined, mockCardDetails, mockCardImages);
    expect(result).toEqual([]);
  });

  it('should filter cards without both details and images', () => {
    const selector = fromSelectors.selectCardDetailsByAccountId('acc1');
    const partialDetails = { card1: mockCardDetails.card1 };
    const result = selector.projector(mockAccounts[0], partialDetails, mockCardImages);
    expect(result).toHaveLength(1);
  });

 it('should select card designs', () => {
  const designs = [{ id: 'design-1', designName: 'Classic', uri: '/designs/classic.png' }];
  const state = { ...mockState, designs };
  const result = fromSelectors.selectCardDesigns.projector(state);
  expect(result).toEqual(designs);
});
  it('should select card categories', () => {
    const categories = [{ value: 'DEBIT' as const, displayName: 'Debit Card' }];
    const state = { ...mockState, categories };
    const result = fromSelectors.selectCardCategories.projector(state);
    expect(result).toEqual(categories);
  });

  it('should select card types', () => {
    const types = [{ value: 'VISA' as const, displayName: 'Visa' }];
    const state = { ...mockState, types };
    const result = fromSelectors.selectCardTypes.projector(state);
    expect(result).toEqual(types);
  });

  it('should select isCreating', () => {
    const result = fromSelectors.selectIsCreating.projector(mockState);
    expect(result).toBe(false);
  });

  it('should select createError', () => {
    const result = fromSelectors.selectCreateError.projector(mockState);
    expect(result).toBeNull();
  });

  it('should select isCreateModalOpen', () => {
    const result = fromSelectors.selectIsCreateModalOpen.projector(mockState);
    expect(result).toBe(false);
  });

  it('should select showSuccessAlert', () => {
    const result = fromSelectors.selectShowSuccessAlert.projector(mockState);
    expect(result).toBe(false);
  });

it('should select card creation data', () => {
  const designs = [{ id: 'design-1', designName: 'Classic', uri: '/designs/classic.png' }];
  const categories = [{ value: 'DEBIT' as const, displayName: 'Debit Card' }];
  const types = [{ value: 'VISA' as const, displayName: 'Visa' }];
  
  const result = fromSelectors.selectCardCreationData.projector(designs, categories, types, mockAccounts);
  expect(result).toEqual({ designs, categories, types, accounts: mockAccounts });
});
});