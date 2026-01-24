import { InputConfig } from './input.model';

export type RadioValue = string | number | boolean | null;

export interface RadioOption {
  label: string;
  value: RadioValue;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupConfig extends InputConfig {
  layout?: 'column' | 'row';
  initialValue?: RadioValue;

  hasBorder?: boolean;
  borderWidth?: string;
  borderColor?: string;
}
