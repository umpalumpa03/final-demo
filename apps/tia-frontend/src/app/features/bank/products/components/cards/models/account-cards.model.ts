import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import { CardWithDetails } from './card-image.model';

export type ViewState = 'loading' | 'error' | 'success' | 'no-account';

export interface AccountData {
  account: CardAccount;
  cards: CardWithDetails[];
}