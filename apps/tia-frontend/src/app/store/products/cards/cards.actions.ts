import { createAction, props } from '@ngrx/store';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import { CardCategory } from '@tia/shared/models/cards/card-category.model';
import { CardDesign } from '@tia/shared/models/cards/card-design.model';
import { CardDetail } from '@tia/shared/models/cards/card-detail.model';
import { CardType } from '@tia/shared/models/cards/card-type.model';
import { CreateCardRequest } from '@tia/shared/models/cards/create-card-request.model';


export const loadCardAccounts = createAction('[Cards] Load Card Accounts');

export const loadCardAccountsSuccess = createAction(
  '[Cards] Load Card Accounts Success',
  props<{ accounts: CardAccount[] }>()
);

export const loadCardAccountsFailure = createAction(
  '[Cards] Load Card Accounts Failure',
  props<{ error: string }>()
);

export const loadCardImage = createAction(
  '[Cards] Load Card Image',
  props<{ cardId: string }>()
);

export const loadCardImageSuccess = createAction(
  '[Cards] Load Card Image Success',
  props<{ cardId: string; imageBase64: string }>()
);

export const loadCardImageFailure = createAction(
  '[Cards] Load Card Image Failure',
  props<{ cardId: string; error: string }>()
);

export const loadCardDetails = createAction(
  '[Cards] Load Card Details',
  props<{ cardId: string }>()
);

export const loadCardDetailsSuccess = createAction(
  '[Cards] Load Card Details Success',
  props<{ cardId: string; details: CardDetail }>()
);

export const loadCardDetailsFailure = createAction(
  '[Cards] Load Card Details Failure',
  props<{ cardId: string; error: string }>()
);
export const loadAccountCards = createAction(
  '[Cards] Load Account Cards',
  props<{ accountId: string }>()
);
export const loadCardCreationData = createAction(
  '[Cards] Load Card Creation Data'
);

export const loadCardCreationDataSuccess = createAction(
  '[Cards] Load Card Creation Data Success',
  props<{
    designs: CardDesign[];
    categories: CardCategory[];
    types: CardType[];
  }>()
);

export const loadCardCreationDataFailure = createAction(
  '[Cards] Load Card Creation Data Failure',
  props<{ error: string }>()
);

export const createCard = createAction(
  '[Cards] Create Card',
  props<{ request: CreateCardRequest }>()
);

export const createCardSuccess = createAction(
  '[Cards] Create Card Success'
);

export const createCardFailure = createAction(
  '[Cards] Create Card Failure',
  props<{ error: string }>()
);

export const openCreateCardModal = createAction(
  '[Cards] Open Create Card Modal'
);

export const closeCreateCardModal = createAction(
  '[Cards] Close Create Card Modal'
);
export const hideSuccessAlert = createAction(
  '[Cards] Hide Success Alert'
);