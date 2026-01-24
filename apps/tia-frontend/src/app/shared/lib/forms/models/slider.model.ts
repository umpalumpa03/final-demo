import { InputConfig } from './input.model';

export interface SliderConfig extends InputConfig {
  min?: number;
  max?: number;
  step?: number;
  showValueLabel?: boolean;
  valueSuffix?: string;
}
