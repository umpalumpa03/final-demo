import { InputConfig } from './input.model';

export type TextareaResize = 'none' | 'both' | 'horizontal' | 'vertical';

export interface TextareaConfig extends InputConfig {
  rows?: number;
  cols?: number;
  resizable?: TextareaResize;
  showCharacterCount?: boolean;
}
