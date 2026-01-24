import { InputConfig } from './input.model';

export interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
}

export interface SelectConfig extends InputConfig {
  placeholder?: string;
}
