import { TextareaConfig } from '../models/textarea.model';

export const TEXTAREA_DEFAULTS: TextareaConfig = {
  rows: 2,
  resizable: 'none',
  showCharacterCount: true,
  placeholder: 'Type your message here...',
} as const;
