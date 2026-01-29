import { createAction, props } from '@ngrx/store';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import { CardDetail } from '@tia/shared/models/cards/card-detail.model';


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
