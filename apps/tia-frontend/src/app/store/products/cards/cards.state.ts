import { CardAccount } from "@tia/shared/models/cards/card-account.model";
import { CardDetail } from "@tia/shared/models/cards/card-detail.model";
import { CardDesign } from '@tia/shared/models/cards/card-design.model';
import { CardCategory } from '@tia/shared/models/cards/card-category.model';
import { CardType } from '@tia/shared/models/cards/card-type.model';

export interface CardsState {
  accounts: CardAccount[];
  cardImages: Record<string, string>;
  cardDetails: Record<string, CardDetail>;
  loading: boolean;
  error: string | null;
  cardDetailsLoading: boolean;  
  cardDetailsError: string | null;
  
  designs: CardDesign[];
  categories: CardCategory[];
  types: CardType[];
  isCreating: boolean;
  createError: string | null;
  isCreateModalOpen: boolean;
  showSuccessAlert: boolean;
}

export const initialCardsState: CardsState = {
  accounts: [],
  cardImages: {},
  cardDetails: {},
  loading: false,
  error: null,
  cardDetailsLoading: false,  
  cardDetailsError: null,
  
  designs: [],
  categories: [],
  types: [],
  isCreating: false,
  createError: null,
  isCreateModalOpen: false,
  showSuccessAlert: false,
};