import {
  SelectOption,
  TextInputType,
} from '@tia/shared/lib/forms/models/input.model';

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
