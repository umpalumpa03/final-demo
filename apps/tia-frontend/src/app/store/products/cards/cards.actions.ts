import { createAction, props } from '@ngrx/store';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import { CardCategory } from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/card-category.model';
import { CardDesign } from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/card-design.model';
import { CardDetail } from '@tia/shared/models/cards/card-detail.model';
import { CreateCardRequest } from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/create-card-request.model';
import { CardType } from '../../../features/bank/products/components/cards/models/card-type.model';
import { CardSensitiveData } from '../../../features/bank/products/components/cards/models/card-sensitive-data.model';

export const loadCardAccounts = createAction('[Cards] Load Card Accounts',props<{ forceRefresh?: boolean }>(),);

export const loadCardAccountsSuccess = createAction(
  '[Cards] Load Card Accounts Success',
  props<{ accounts: CardAccount[] }>(),
);

export const loadCardAccountsFailure = createAction(
  '[Cards] Load Card Accounts Failure',
  props<{ error: string }>(),
);

export const loadCardImage = createAction(
  '[Cards] Load Card Image',
  props<{ cardId: string; forceRefresh?: boolean }>(),
);

export const loadCardImageSuccess = createAction(
  '[Cards] Load Card Image Success',
  props<{ cardId: string; imageBase64: string }>(),
);

export const loadCardImageFailure = createAction(
  '[Cards] Load Card Image Failure',
  props<{ cardId: string; error: string }>(),
);

export const loadCardDetails = createAction(
  '[Cards] Load Card Details',
  props<{ cardId: string; forceRefresh?: boolean }>(),
);

export const loadCardDetailsSuccess = createAction(
  '[Cards] Load Card Details Success',
  props<{ cardId: string; details: CardDetail }>(),
);

export const loadCardDetailsFailure = createAction(
  '[Cards] Load Card Details Failure',
  props<{ cardId: string; error: string }>(),
);

export const loadAccountCards = createAction(
  '[Cards] Load Account Cards',
  props<{ accountId: string }>(),
);

export const loadAccountCardsPage = createAction(
  '[Cards] Load Account Cards Page',
  props<{ accountId: string }>(),
);

export const loadCardCreationData = createAction(
  '[Cards] Load Card Creation Data',props<{ forceRefresh?: boolean }>(),
);

export const loadCardCreationDataSuccess = createAction(
  '[Cards] Load Card Creation Data Success',
  props<{
    designs: CardDesign[];
    categories: CardCategory[];
    types: CardType[];
  }>(),
);

export const loadCardCreationDataFailure = createAction(
  '[Cards] Load Card Creation Data Failure',
  props<{ error: string }>(),
);

export const createCard = createAction(
  '[Cards] Create Card',
  props<{ request: CreateCardRequest }>(),
);

export const createCardSuccess = createAction('[Cards] Create Card Success');

export const createCardFailure = createAction(
  '[Cards] Create Card Failure',
  props<{ error: string }>(),
);

export const openCreateCardModal = createAction(
  '[Cards] Open Create Card Modal',
);

export const closeCreateCardModal = createAction(
  '[Cards] Close Create Card Modal',
);

export const hideSuccessAlert = createAction('[Cards] Hide Success Alert');

export const openCardDetailsModal = createAction(
  '[Cards] Open Card Details Modal',
  props<{ cardId: string }>(),
);

export const closeCardDetailsModal = createAction(
  '[Cards] Close Card Details Modal',
);

export const loadCardImagesComplete = createAction(
  '[Cards] Load Card Images Complete',
);
export const updateCardName = createAction(
  '[Cards] Update Card Name',
  props<{ cardId: string; cardName: string }>(),
);

export const updateCardNameSuccess = createAction(
  '[Cards] Update Card Name Success',
  props<{ cardId: string; cardName: string }>(),
);

export const updateCardNameFailure = createAction(
  '[Cards] Update Card Name Failure',
  props<{ cardId: string; error: string }>(),
);
export const requestCardOtp = createAction(
  '[Cards] Request Card OTP',
  props<{ cardId: string }>(),
);

export const requestCardOtpSuccess = createAction(
  '[Cards] Request Card OTP Success',
  props<{ challengeId: string }>(),
);

export const requestCardOtpFailure = createAction(
  '[Cards] Request Card OTP Failure',
  props<{ error: string }>(),
);

export const verifyCardOtp = createAction(
  '[Cards] Verify Card OTP',
  props<{ challengeId: string; code: string; cardId: string }>(),
);

export const verifyCardOtpSuccess = createAction(
  '[Cards] Verify Card OTP Success',
  props<{ cardId: string; sensitiveData: CardSensitiveData }>(),
);

export const verifyCardOtpFailure = createAction(
  '[Cards] Verify Card OTP Failure',
  props<{ error: string }>(),
);

export const openCardOtpModal = createAction(
  '[Cards] Open Card OTP Modal',
  props<{ cardId: string }>(),
);

export const closeCardOtpModal = createAction(
  '[Cards] Close Card OTP Modal',
);

export const clearCardSensitiveData = createAction(
  '[Cards] Clear Card Sensitive Data',
);
export const showGlobalAlert = createAction(
  '[Cards] Show Global Alert', 
  props<{ message: string; alertType: 'success' | 'error' }>()
);
export const hideGlobalAlert = createAction('[Cards] Hide Global Alert');

export const setCurrentCardIndex = createAction(
  '[Cards] Set Current Card Index',
  props<{ cardIndex: number; accountId: string }>()
);

export const navigateToNextCard = createAction(
  '[Cards] Navigate To Next Card'
);

export const navigateToPreviousCard = createAction(
  '[Cards] Navigate To Previous Card'
);
