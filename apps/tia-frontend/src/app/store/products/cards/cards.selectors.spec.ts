
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
  selectIsCardDetailsModalOpen,
  selectSelectedCardIdForModal,
  selectCardDetailsModalData,
  selectCardTransactions,
  selectCardTransactionsLoading,
  selectCardTransactionsError,
  selectCardTransactionsTotalCount,
  selectCardTransactionsByCardId,
  selectCardTransactionsTotalByCardId,
  selectCardImagesLoading,
  selectIsUpdatingCardName,
  selectUpdateCardNameError,
  selectCardSensitiveData,
  selectChallengeId,
  selectIsOtpModalOpen,
  selectSelectedCardIdForOtp,
  selectOtpLoading,
  selectOtpError,
  selectShowOtpSuccessAlert,
  selectCardSensitiveDataById,
} from './cards.selectors';
import { CardsState } from './cards.state';
import { ITransactions } from '@tia/shared/models/transactions/transactions.models';

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
  isCardDetailsModalOpen: false,
  selectedCardIdForModal: null,
  cardTransactions: {},
  cardTransactionsLoading: false,
  cardTransactionsError: null,
  cardTransactionsTotalCount: {},
  cardImagesLoading: false,
  isUpdatingCardName: false,
  updateCardNameError: null,
  cardSensitiveData: {},
  challengeId: null,
  isOtpModalOpen: false,
  selectedCardIdForOtp: null,
  otpLoading: false,
  otpError: null,
  showOtpSuccessAlert: false,
  globalAlert: null,
  otpRemainingAttempts: 3,
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
  it('should select isCardDetailsModalOpen', () => {
  expect(selectIsCardDetailsModalOpen.projector({ ...mockState, isCardDetailsModalOpen: true })).toBe(true);
});

it('should select selectedCardIdForModal', () => {
  expect(selectSelectedCardIdForModal.projector({ ...mockState, selectedCardIdForModal: 'card-1' })).toBe('card-1');
});

it('should select card details modal data', () => {
  const result = selectCardDetailsModalData.projector('card-1', mockState.cardDetails, mockState.cardImages, mockState.accounts);
  expect(result?.cardId).toBe('card-1');
  expect(result?.formattedBalance).toBeDefined();
});
it('should select cardTransactions', () => {
  expect(selectCardTransactions.projector(mockState)).toEqual({});
});

it('should select cardTransactionsLoading', () => {
  expect(selectCardTransactionsLoading.projector(mockState)).toBe(false);
});

it('should select cardTransactionsError', () => {
  expect(selectCardTransactionsError.projector(mockState)).toBeNull();
});

it('should select cardTransactionsTotalCount', () => {
  expect(selectCardTransactionsTotalCount.projector(mockState)).toEqual({});
});

it('should select transactions by cardId', () => {
  const transactions = [{ id: 'tx-1' }] as ITransactions[];
  expect(selectCardTransactionsByCardId('card-1').projector({ 'card-1': transactions })).toEqual(transactions);
  expect(selectCardTransactionsByCardId('unknown').projector({})).toEqual([]);
});

it('should select total by cardId', () => {
  expect(selectCardTransactionsTotalByCardId('card-1').projector({ 'card-1': 10 })).toBe(10);
  expect(selectCardTransactionsTotalByCardId('unknown').projector({})).toBe(0);
});
it('should select cardImagesLoading', () => {
  expect(selectCardImagesLoading.projector({ ...mockState, cardImagesLoading: true })).toBe(true);
});
it('should select isUpdatingCardName', () => {
  expect(selectIsUpdatingCardName.projector({ ...mockState, isUpdatingCardName: true })).toBe(true);
});

it('should select updateCardNameError', () => {
  expect(selectUpdateCardNameError.projector({ ...mockState, updateCardNameError: 'Failed' })).toBe('Failed');
});
it('should select cardSensitiveData', () => {
  const data = { 'card-1': { cardNumber: '1234', cvv: '123', expiryDate: '12/28', cardholderName: 'John' } };
  expect(selectCardSensitiveData.projector({ ...mockState, cardSensitiveData: data })).toEqual(data);
});

it('should select challengeId', () => {
  expect(selectChallengeId.projector({ ...mockState, challengeId: 'ch-123' })).toBe('ch-123');
});

it('should select isOtpModalOpen', () => {
  expect(selectIsOtpModalOpen.projector({ ...mockState, isOtpModalOpen: true })).toBe(true);
});

it('should select selectedCardIdForOtp', () => {
  expect(selectSelectedCardIdForOtp.projector({ ...mockState, selectedCardIdForOtp: 'card-1' })).toBe('card-1');
});

it('should select otpLoading', () => {
  expect(selectOtpLoading.projector({ ...mockState, otpLoading: true })).toBe(true);
});

it('should select otpError', () => {
  expect(selectOtpError.projector({ ...mockState, otpError: 'Failed' })).toBe('Failed');
});

it('should select showOtpSuccessAlert', () => {
  expect(selectShowOtpSuccessAlert.projector({ ...mockState, showOtpSuccessAlert: true })).toBe(true);
});

it('should select sensitive data by cardId', () => {
  const data = { cardNumber: '1234', cvv: '123', expiryDate: '12/28', cardholderName: 'John' };
  expect(selectCardSensitiveDataById('card-1').projector({ 'card-1': data })).toEqual(data);
  expect(selectCardSensitiveDataById('unknown').projector({})).toBeNull();
});
});
