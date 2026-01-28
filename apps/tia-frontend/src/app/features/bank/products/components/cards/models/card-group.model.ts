import { CardAccount } from './card-account.model';
import { CardImage } from './card-image.model';

export interface CardGroup {
  account: CardAccount;
  cardImages: CardImage[];
}