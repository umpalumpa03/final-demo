import { SelectConfig } from '@tia/shared/lib/forms/models/dropdowns.model';
import { InputConfig } from '@tia/shared/lib/forms/models/input.model';

export const CATEGORIZE_MODAL_CONFIG = {
  title: 'Categorize Transaction',
  subTitle: 'Assign a category to this transaction for better organization',
  successMessageDuration: 3000,
} as const;

export const CATEGORY_SELECT_CONFIG: SelectConfig = {
  label: 'Select Category',
  placeholder: 'Select category',
  height: '3.6rem',
} as const;

export const NEW_CATEGORY_INPUT_CONFIG: InputConfig = {
  placeholder: 'Enter category name',
  label: 'Or Add Custom Category',
  margin: '0.4rem 0 0',
} as const;
