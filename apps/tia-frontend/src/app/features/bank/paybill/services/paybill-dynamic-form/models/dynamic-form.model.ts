export interface PaybillDynamicFormValues {
  amount?: number;
  [key: string]: string | number | boolean | null | undefined;
}

export interface PaybillDynamicField {
  id: string;
  label: string;
  required: boolean;
  type: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  component?: 'input' | 'select' | 'date';
}
