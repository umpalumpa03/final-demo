import { CardAccount } from '../../../features/bank/products/components/cards/models/card-account.model';
import { CardDetail } from '../../../features/bank/products/components/cards/models/card-detail.model';

export interface CardsState {
  accounts: CardAccount[];
  cardImages: Record<string, string>;
  cardDetails: Record<string, CardDetail>;
  loading: boolean;
  error: string | null;
}

export const initialCardsState: CardsState = {
  accounts: [],
  cardImages: {},
  cardDetails: {},
  loading: false,
  error: null,
};