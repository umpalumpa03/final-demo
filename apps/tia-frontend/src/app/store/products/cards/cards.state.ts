import { CardAccount } from '../../../features/bank/products/components/cards/models/card-account.model';

export interface CardsState {
  accounts: CardAccount[];
  cardImages: Record<string, string>; 
  loading: boolean;
  error: string | null;
}

export const initialCardsState: CardsState = {
  accounts: [],
  cardImages: {},
  loading: false,
  error: null,
};