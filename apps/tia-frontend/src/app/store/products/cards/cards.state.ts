import { CardAccount } from "@tia/shared/models/cards/card-account.model";
import { CardDetail } from "@tia/shared/models/cards/card-detail.model";


export interface CardsState {
  accounts: CardAccount[];
  cardImages: Record<string, string>;
  cardDetails: Record<string, CardDetail>;
  loading: boolean;
  error: string | null;
   cardDetailsLoading: boolean;  
  cardDetailsError: string | null;  
}

export const initialCardsState: CardsState = {
  accounts: [],
  cardImages: {},
  cardDetails: {},
  loading: false,
  error: null,
  cardDetailsLoading: false,  
  cardDetailsError: null,  
};