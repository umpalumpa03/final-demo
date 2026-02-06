import {
  SelectOption,
  TextInputType,
} from '@tia/shared/lib/forms/models/input.model';
import { Currency } from '../../transfers/models/transfers.state.model';
export type FilterControlType = 'input' | 'select';

export interface FilterConfig {
  controlName: string;
  type: FilterControlType;
  inputType?: TextInputType;
  options?: SelectOption[];
  uiConfig: {
    label: string;
    placeholder?: string;
  };
}

export interface ActiveFilter {
  key: string;
  displayText: string;
}

export interface FilterFormValues {
  searchCriteria?: string | null;
  category?: string | null;
  amountFrom?: number | null;
  amountTo?: number | null;
  accountIban?: string | null;
  currency?: Currency | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}
