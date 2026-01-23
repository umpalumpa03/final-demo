import { InputConfig } from './input.model';

export type RadioValue = string | number | boolean;

export interface RadioOption {
  label: string;
  value: RadioValue;
  disabled?: boolean;
}

export interface RadioGroupConfig extends InputConfig {
  layout?: 'column' | 'row';
}
