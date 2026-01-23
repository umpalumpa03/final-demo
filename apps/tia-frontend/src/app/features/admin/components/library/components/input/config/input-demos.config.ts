import { TextInputType } from '@tia/shared/lib/forms/models/input.model';
import {
  CheckboxDemo,
  InputDemo,
  TextareaDemo,
} from '../models/input-demos.model';

export const BASIC_INPUT_DEMOS: InputDemo[] = [
  {
    config: {
      label: 'Default Input',
      placeholder: 'Enter text...',
    },
  },
  {
    state: 'disabled',
    config: {
      label: 'Disabled Input',
      placeholder: 'Cannot edit this',
    },
  },
  {
    state: 'readonly',
    config: {
      label: 'Read-only Input',
      placeholder: 'Read-only value',
    },
  },
  {
    state: 'error',
    config: {
      label: 'Input with Error',
      placeholder: 'Enter valid data',
      errorMessage: 'This field is required',
    },
  },
  {
    state: 'success',
    config: {
      label: 'Input with Success',
      placeholder: 'Valid input',
      successMessage: 'Looks good!',
    },
  },
] as const;

export const SPECIAL_INPUT_DEMOS: { type: TextInputType; label: string }[] = [
  { type: 'email', label: 'Email Input' },
  { type: 'password', label: 'Password Input' },
  { type: 'search', label: 'Search Input' },
  { type: 'number', label: 'Number Input' },
  { type: 'date', label: 'Date Input' },
  { type: 'time', label: 'Time Input' },
  { type: 'color', label: 'Color Input' },
  { type: 'file', label: 'File Input' },
  { type: 'url', label: 'URL Input' },
  { type: 'tel', label: 'Phone Input' },
] as const;

export const TEXTAREA_DEMOS: TextareaDemo[] = [
  {
    config: {
      label: 'Default Textarea',
      placeholder: 'Type your message here...',
      showCharacterCount: true,
      rows: 2,
    },
  },
  {
    state: 'disabled',
    config: {
      label: 'Disabled Textarea',
      placeholder: 'Cannot edit this',
      rows: 2,
    },
  },
  {
    config: {
      label: 'Textarea with Max Length',
      placeholder: 'Maximum 100 characters',
      validation: { maxLength: 100 },
      showCharacterCount: true,
      rows: 2,
    },
  },
] as const;

export const CHECKBOX_DEMOS: CheckboxDemo[] = [
  {
    checked: false,
    config: {
      label: 'Accept terms and conditions (State: Unchecked)',
    },
  },
  {
    checked: true,
    config: {
      label: 'Default Checked',
    },
  },
  {
    checked: false,
    config: {
      label: 'Disabled Checkbox',
      disabled: true,
    },
  },
  {
    checked: true,
    config: {
      label: 'Disabled & Checked',
      disabled: true,
    },
  },
] as const;
