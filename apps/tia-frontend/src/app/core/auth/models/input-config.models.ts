import { AlertDismissibleItem } from '../../../features/storybook/components/alerts/models/alert.model';

export const SIGN_IN_FORM = {
  username: {
    label: 'Username',
    placeholder: 'Enter password',
  },
  password: {
    label: 'Password',
    placeholder: 'Enter your password',
  },
} as const;

export const ALERTS_DISMISSIBLE_DATA = {
  info: {
    type: 'information' as const,
    title: 'New Feature Available',
    message: '',
  },
  success: {
    type: 'success' as const,
    title: 'Profile Updated',
    message: '',
  },
  error: {
    id: 1,
    type: 'warning' as const,
    title: 'Error',
    message: '',
  },
};
