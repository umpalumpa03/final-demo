import { PendingCard } from '../shared/model/approve-cards.model';

export interface ApproveCardsState {
  cards: PendingCard[];
  isLoading: boolean;
  error: string | null;
  filter: 'ALL' | 'URGENT'; 
}

export const initialApproveCardsState: ApproveCardsState = {
  cards: [],
  isLoading: false,
  error: null,
  filter: 'ALL'
};