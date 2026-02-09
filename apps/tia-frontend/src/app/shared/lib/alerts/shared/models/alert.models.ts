export type AlertType = 'information' | 'success' | 'error' | 'warning';

export type BaseAlertType = 'default' | 'error'

export type DismissibleAlertType = 'information' | 'success' | 'warning' | 'error';;

export type SimpleAlertType = 'information' | 'success' | 'warning' | 'error';

export type AlertStateType = 'default' | 'inactive' | 'active'


//ეს მოდელები გამოყენებულია ალერტ სერვისში
export type AlertVariant = 'standard' | 'dismissible';

export interface AlertOptions {
  variant?: AlertVariant;
  title?: string;
  autoHideMs?: number;
}

export const DEFAULT_AUTO_HIDE: Record<AlertType, number> = {
  success: 3500,
  error: 5000,
  warning: 4000,
  information: 3500,
};