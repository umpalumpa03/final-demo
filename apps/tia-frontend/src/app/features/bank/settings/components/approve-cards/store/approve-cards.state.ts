import { CardCatalogItemResponse, PendingCard } from "../../../shared/models/approve-models/cards-models/approve-cards.model";

export interface ApproveCardsState {
  cards: PendingCard[];
  permissions: CardCatalogItemResponse[],
  isLoading: boolean;
  error: string | null;
  filter: 'ALL' | 'URGENT'; 
  success: string | null;
}

export const initialApproveCardsState: ApproveCardsState = {
  cards: [],
  permissions: [],
  isLoading: false,
  error: null,
  filter: 'ALL',
  success: null,
};