import { AlertBasicItem } from "../models/alert.model";

export const ALERTS_TITLES = {
  BASIC: 'Basic Alerts',
  ICONS: 'Alert Types with Icons',
  DISMISSIBLE: 'Dismissible Alerts',
  ACTIONS: 'Alerts with Actions',
  SIMPLE: 'Simple Alerts',
  STATES: 'Alert States'
} as const;

export const ALERTS_CONFIG = Object.values(ALERTS_TITLES);

export const ALERTS_BASIC_DATA: AlertBasicItem[] = [
  { 
    id: 1, 
    type: 'default', 
    title: 'Default Alert', 
    message: 'This is a default alert with important information.' 
  },
  { 
    id: 2, 
    type: 'error', 
    title: 'Error Alert', 
    message: 'This is an error alert indicating something went wrong.' 
  }
];