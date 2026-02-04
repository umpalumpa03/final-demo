import { CardWithDetails } from './card-image.model';
import { CardAccount } from '@tia/shared/models/cards/card-account.model';

export interface CardViewData extends CardWithDetails {
  account: CardAccount | undefined;
  currency: string;
  formattedBalance: string;
  shouldShowCreditLimit: boolean;
  formattedCreditLimit: string;
  isActiveStatus: boolean;
}