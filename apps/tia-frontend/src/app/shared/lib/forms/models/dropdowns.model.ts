import { InputConfig } from './input.model';

export type SelectValue = string | number | boolean | null;

export interface SelectOption {
  label: string;
  value: SelectValue;
  disabled?: boolean;
}

export interface SelectConfig extends InputConfig {
  placeholder?: string;
  value?: SelectValue;
}
