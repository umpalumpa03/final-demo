import { TextInputType } from '@tia/shared/lib/forms/models/input.model';
import { InputDemo } from '../models/input-demos.model';

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
