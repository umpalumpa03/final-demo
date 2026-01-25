import { AlertActionItem, AlertBasicItem, AlertDismissibleItem, AlertIconItem, AlertSimpleItem } from "../models/alert.model";

export const ALERTS_TITLES = {
  BASIC: 'Basic Alerts',
  ICONS: 'Alert Types with Icons',
  DISMISSIBLE: 'Dismissible Alerts',
  ACTIONS: 'Alerts with Actions',
  SIMPLE: 'Simple Alerts (No Title)',
  STATES: 'Alert States'
} as const;

export const ALERTS_CONFIG = Object.values(ALERTS_TITLES);

export const ALERTS_BASIC_DATA: AlertBasicItem[] = [
  { 
    id: 1, 
    type: 'default', 
    state: 'default',
    title: 'Default Alert', 
    message: 'This is a default alert with important information.' 
  },
  { 
    id: 2, 
    type: 'error', 
    state: 'default',
    title: 'Error Alert', 
    message: 'This is an error alert indicating something went wrong.' 
  }
] as const;

export const ALERTS_ICONS_DATA: AlertIconItem[] = [
  { 
    id: 1, 
    type: 'information', 
    message: 'This is an informational message to provide additional context.' 
  },
  { 
    id: 2, 
    type: 'success', 
    message: 'Your changes have been saved successfully!.' 
  },
  { 
    id: 3, 
    type: 'warning', 
    message: 'Please review your input before proceeding.' 
  },
  { 
    id: 4, 
    type: 'error', 
    message: 'An error occurred while processing your request.' 
  }
] as const;

export const ALERTS_DISMISSIBLE_DATA: AlertDismissibleItem[] = [ 
   { 
    id: 1, 
    type: 'information', 
    title: 'New Feature Available', 
    message: 'Check out our latest updates and improvements.' 
  },
  { 
    id: 2, 
    type: 'success', 
    title: 'Profile Updated', 
    message: 'Your profile information has been updated successfully.' 
  },
  { 
    id: 3, 
    type: 'warning', 
    title: 'Payment Due Soon', 
    message: 'Your subscription will renew in 3 days.' 
  }
] as const;

export const ALERTS_ACTIONS_DATA:AlertActionItem[] = [
   { 
    id: 1, 
    type: 'default', 
    title: 'Update Available', 
    message: 'A new version of the application is available.',
    btnOneType: 'default', 
    btnTwoType: 'outline', 
    btnOneText: 'Update Now', 
    btnTwoText: 'Remind Me Later' 
  },
  { 
    id: 2, 
    type: 'error', 
    title: 'Confirm Action', 
    message: 'This action cannot be undone. Are you sure you want to continue?', 
    btnOneType: 'destructive', 
    btnTwoType: 'outline', 
    btnOneText: 'Confirm', 
    btnTwoText: 'Cancel'
  },
] as const; 
 


export const ALERTS_SIMPLE_DATA:AlertSimpleItem[] = [
   { 
    id: 1, 
    type: 'information', 
    message: 'This is a simple informational message without a title.', 
  },
  { 
    id: 2, 
    type: 'success', 
    message: 'Operation completed successfully.', 
  },
  { 
    id: 3, 
    type: 'warning', 
    message: 'Please save your work before closing. ', 
  },
] as const; 

export const ALERTS_STATES_DATA: AlertBasicItem[] = [
  { 
    id: 1,
    type: 'default', 
    state: 'default', 
    title: 'Normal State',
    message: 'This is the normal state of an alert.', 
  },
  { 
    id: 2, 
    type: 'default', 
    state: 'inactive', 
    title: 'Dimmed/Inactive State',
    message: 'This alert appears dimmed or inactive.', 
  },
  { 
    id: 3, 
    type: 'default', 
    state: 'active', 
    title: 'Emphasized State',
    message: 'This alert is emphasized with stronger borders and shadow.', 
  }
] as const;
