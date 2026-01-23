import { TextInputType } from '../../models/input.model';
import { TextInputTypeConfig } from '../models/text-input.model';
import { INPUT_ICONS } from './text-input.icons';

export const TEXT_INPUT_CONFIGS: Record<TextInputType, TextInputTypeConfig> = {
  text: {
    placeholder: 'Enter text...',
    autocomplete: 'off',
  },
  email: {
    placeholder: 'you@example.com',
    icon: INPUT_ICONS.EMAIL,
  },
  password: {
    placeholder: 'Enter password',
    icon: INPUT_ICONS.PASSWORD,
  },
  search: {
    placeholder: 'Search...',
    icon: INPUT_ICONS.SEARCH,
  },
  number: {
    icon: INPUT_ICONS.NUMBER,
    placeholder: '0',
    inputmode: 'numeric',
  },
  date: {
    icon: INPUT_ICONS.DATE,
    autocomplete: 'off',
  },
  time: {
    icon: INPUT_ICONS.TIME,
    autocomplete: 'off',
  },
  color: {
    icon: INPUT_ICONS.COLOR,
    placeholder: '#000000',
  },
  file: {
    icon: INPUT_ICONS.FILE,
    placeholder: 'Choose file',
  },
  url: {
    icon: INPUT_ICONS.URL,
    placeholder: 'https://example.com',
    autocomplete: 'url',
    inputmode: 'url',
  },
  tel: {
    icon: INPUT_ICONS.TEL,
    placeholder: '+1 (555) 000-0000',
    autocomplete: 'tel',
    inputmode: 'tel',
  },
} as const;
