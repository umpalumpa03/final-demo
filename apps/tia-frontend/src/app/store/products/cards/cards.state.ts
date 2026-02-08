import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import { CardDetail } from '@tia/shared/models/cards/card-detail.model';
import { CardDesign } from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/card-design.model';
import { CardCategory } from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/card-category.model';
import { CardType } from '../../../features/bank/products/components/cards/models/card-type.model';
import { CardSensitiveData } from '../../../features/bank/products/components/cards/models/card-sensitive-data.model';

export interface CardsState {
  accounts: CardAccount[];
  cardImages: Record<string, string>;
  cardDetails: Record<string, CardDetail>;
  loading: boolean;
  error: string | null;
  cardDetailsLoading: boolean;
  cardDetailsError: string | null;
  designs: CardDesign[];
  categories: CardCategory[];
  types: CardType[];
  isCreating: boolean;
  createError: string | null;
  isCreateModalOpen: boolean;
  showSuccessAlert: boolean;
  isCardDetailsModalOpen: boolean;
  selectedCardIdForModal: string | null;
    cardImagesLoading: boolean;
     isUpdatingCardName: boolean;
  updateCardNameError: string | null;
  cardSensitiveData: Record<string, CardSensitiveData>;
  challengeId: string | null;
  isOtpModalOpen: boolean;
  selectedCardIdForOtp: string | null;
  otpLoading: boolean;
  otpError: string | null;
  showOtpSuccessAlert: boolean;
globalAlert: { message: string; alertType: 'success' | 'error' } | null;
currentCardIndex: number;
currentAccountId: string | null;
otpRemainingAttempts: number;
}

export const initialCardsState: CardsState = {
  accounts: [],
  cardImages: {},
  cardDetails: {},
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
  isCardDetailsModalOpen: false,
  selectedCardIdForModal: null,
  cardImagesLoading: true,
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
currentCardIndex: 0,
currentAccountId: null,
};
