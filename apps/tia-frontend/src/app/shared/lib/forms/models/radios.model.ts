import { InputConfig } from './input.model';

export interface RadioOption {
  label: string;
  value: any;
  disabled?: boolean;
}

export interface RadioGroupConfig extends InputConfig {
  layout?: 'column' | 'row';
}
