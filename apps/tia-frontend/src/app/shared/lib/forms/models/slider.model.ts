import { InputConfig } from './input.model';

export interface SliderConfig extends InputConfig {
  min?: number | string;
  max?: number | string;
  step?: number;
  showValueLabel?: boolean;
  valueSuffix?: string;
}
