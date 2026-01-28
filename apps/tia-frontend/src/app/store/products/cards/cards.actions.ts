import { createAction, props } from '@ngrx/store';
import { CardAccount } from '../../../features/bank/products/components/cards/models/card-account.model';

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