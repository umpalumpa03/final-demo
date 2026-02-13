import { CardAccount } from '@tia/shared/models/cards/card-account.model';

export interface CardImageView {
  cardId: string;
  imageBase64: string;
  cardAlt: string;
  isStacked: boolean;
  isActive: boolean;
  zIndex: number;
  index: number;
  stackPosition: number;
}

export interface CardGroupView {
  account: CardAccount;
  cardImages: Array<{ cardId: string; imageBase64: string }>;
  cardCountLabel: string;
  activeIndex: number;
  cards: CardImageView[];
  cardCountKey: string;  
}