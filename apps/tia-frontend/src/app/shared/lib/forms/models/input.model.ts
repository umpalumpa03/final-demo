export type TextInputType =
  | 'text'
  | 'email'
  | 'password'
  | 'search'
  | 'number'
  | 'date'
  | 'time'
  | 'color'
  | 'file'
  | 'url'
  | 'tel';

export type InputFieldValue = string | number | boolean | FileList | null;

export interface FormStatus {
  valid: boolean;
  invalid: boolean;
  touched: boolean;
  dirty: boolean;
}

export type InputSize = 'small' | 'medium' | 'large';

export type InputVariant = 'outlined' | 'filled' | 'standard';

export type InputState =
  | 'default'
  | 'disabled'
  | 'readonly'
  | 'error'
  | 'success'
  | 'warning';

export interface InputValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string | RegExp;
  email?: boolean;
  url?: boolean;
  tel?: boolean;
  customErrorMessage?: string;
}

export interface InputConfig {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  warningMessage?: string;
  errorMessage?: string;
  successMessage?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  variant?: InputVariant;
  validation?: InputValidation;
  autocomplete?: string;
  ariaLabel?: string;
  showCharacterCount?: boolean;
  labelIconUrl?: string;
  prefixIcon?: string;
  suffixIcon?: string;
  showPasswordToggle?: boolean;
  accept?: string;
  multiple?: boolean;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export class InputError {
  constructor(
    public type: string,
    public message: string,
  ) {}
}

export class InputValue<T> {
  constructor(
    public value: T,
    public isValid: boolean,
    public errors: InputError[] = [],
  ) {}
}

export class ValidationResult {
  constructor(
    public isValid: boolean,
    public errors: InputError[] = [],
  ) {}

  static valid(): ValidationResult {
    return new ValidationResult(true, []);
  }

  static invalid(errors: InputError[]): ValidationResult {
    return new ValidationResult(false, errors);
  }
}
