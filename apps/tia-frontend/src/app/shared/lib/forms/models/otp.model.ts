import { InputConfig } from './input.model';

export interface OtpConfig extends InputConfig {
  length?: number;
  inputType?: 'text' | 'number' | 'password';
}

export interface OtpDigit {
  id: number;
  value: string;
}