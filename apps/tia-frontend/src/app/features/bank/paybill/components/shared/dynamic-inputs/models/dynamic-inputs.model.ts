export interface PaybillDynamicField {
  id: string;
  label: string;
  required: boolean;
  type: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
}