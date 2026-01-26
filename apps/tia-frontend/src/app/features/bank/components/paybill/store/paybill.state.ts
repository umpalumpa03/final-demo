import { PaybillCategory } from '../models/paybill.model';

export interface PaybillState {
  categories: PaybillCategory[];

  selectedCategoryId: string | null;

  selectedProviderId: string | null;

  loading: boolean;
  error: string | null;
}

export const initialPaybillState: PaybillState = {
  categories: [],
  selectedCategoryId: null,
  selectedProviderId: null,
  loading: false,
  error: null,
};
