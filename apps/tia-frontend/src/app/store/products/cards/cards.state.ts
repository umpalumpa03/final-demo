import { CardAccount } from '@tia/shared/models/cards/card-account.model';
import { CardDetail } from '@tia/shared/models/cards/card-detail.model';
import { CardDesign } from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/card-design.model';
import { CardCategory } from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/card-category.model';
import { CardType } from '../../../features/bank/products/components/cards/models/card-type.model';
import { ITransactions } from '@tia/shared/models/transactions/transactions.models';

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
  isCardDetailsModalOpen: boolean;
  selectedCardIdForModal: string | null;
  cardTransactions: Record<string, ITransactions[]>;
  cardTransactionsLoading: boolean;
  cardTransactionsError: string | null;
  cardTransactionsTotalCount: Record<string, number>;
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
  isCardDetailsModalOpen: false,
  selectedCardIdForModal: null,
  cardTransactions: {},
  cardTransactionsLoading: false,
  cardTransactionsError: null,
  cardTransactionsTotalCount: {},
};
