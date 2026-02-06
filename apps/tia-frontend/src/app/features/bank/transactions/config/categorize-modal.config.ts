import { SelectConfig } from '@tia/shared/lib/forms/models/dropdowns.model';
import { InputConfig } from '@tia/shared/lib/forms/models/input.model';

export const CATEGORIZE_MODAL_CONFIG = {
  title: 'transactions.categorize_modal.title',
  subTitle: 'transactions.categorize_modal.subtitle',
  successMessageDuration: 3000,
} as const;

export const CATEGORY_SELECT_CONFIG: SelectConfig = {
  label: 'transactions.categorize_modal.labels.select_category',
  placeholder: 'transactions.categorize_modal.labels.placeholder_category',
  height: '3.6rem',
} as const;

export const NEW_CATEGORY_INPUT_CONFIG: InputConfig = {
  placeholder: 'transactions.categorize_modal.labels.enter_category_name',
  label: 'transactions.categorize_modal.labels.custom_category',
  margin: '0.4rem 0 0',
} as const;
