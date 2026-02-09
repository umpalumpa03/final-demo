import {
  AlertActionItem,
  AlertBasicItem,
  AlertDismissibleItem,
  AlertIconItem,
  AlertSimpleItem,
} from '../models/alert.model';

export const ALERTS_TITLES = {
  BASIC: 'storybook.alerts.TITLES.BASIC',
  ICONS: 'storybook.alerts.TITLES.ICONS',
  DISMISSIBLE: 'storybook.alerts.TITLES.DISMISSIBLE',
  ACTIONS: 'storybook.alerts.TITLES.ACTIONS',
  SIMPLE: 'storybook.alerts.TITLES.SIMPLE',
  STATES: 'storybook.alerts.TITLES.STATES',
} as const;

export const ALERTS_CONFIG = Object.values(ALERTS_TITLES);

export const ALERTS_BASIC_DATA: AlertBasicItem[] = [
  {
    id: 1,
    type: 'default',
    state: 'default',
    title: 'storybook.alerts.DATA.DEFAULT_TITLE',
    message: 'storybook.alerts.DATA.DEFAULT_MSG',
  },
  {
    id: 2,
    type: 'error',
    state: 'default',
    title: 'storybook.alerts.DATA.ERROR_TITLE',
    message: 'storybook.alerts.DATA.ERROR_MSG',
  },
] as const;

export const ALERTS_ICONS_DATA: AlertIconItem[] = [
  {
    id: 1,
    type: 'information',
    message: 'storybook.alerts.DATA.DEFAULT_MSG',
  },
  {
    id: 2,
    type: 'success',
    message: 'storybook.alerts.DATA.SUCCESS_SAVE',
  },
  {
    id: 3,
    type: 'warning',
    message: 'storybook.alerts.DATA.CONFIRM_MSG',
  },
  {
    id: 4,
    type: 'error',
    message: 'storybook.alerts.DATA.ERROR_MSG',
  },
] as const;

export const ALERTS_DISMISSIBLE_DATA: AlertDismissibleItem[] = [
  {
    id: 1,
    type: 'information',
    title: 'storybook.alerts.DATA.NEW_FEATURE_TITLE',
    message: 'storybook.alerts.DATA.NEW_FEATURE_MSG',
  },
  {
    id: 2,
    type: 'success',
    title: 'storybook.alerts.DATA.PROFILE_UPDATE_TITLE',
    message: 'storybook.alerts.DATA.SUCCESS_SAVE',
  },
  {
    id: 3,
    type: 'warning',
    title: 'storybook.alerts.DATA.PAYMENT_TITLE',
    message: 'storybook.alerts.DATA.PAYMENT_MSG',
  },
] as const;

export const ALERTS_ACTIONS_DATA: AlertActionItem[] = [
  {
    id: 1,
    type: 'default',
    title: 'storybook.alerts.DATA.UPDATE_TITLE',
    message: 'storybook.alerts.DATA.UPDATE_MSG',
    btnOneType: 'default',
    btnTwoType: 'outline',
    btnOneText: 'storybook.alerts.DATA.BTN_UPDATE',
    btnTwoText: 'storybook.alerts.DATA.BTN_LATER',
  },
  {
    id: 2,
    type: 'error',
    title: 'storybook.alerts.DATA.CONFIRM_ACTION',
    message: 'storybook.alerts.DATA.CONFIRM_MSG',
    btnOneType: 'destructive',
    btnTwoType: 'outline',
    btnOneText: 'storybook.alerts.DATA.BTN_CONFIRM',
    btnTwoText: 'storybook.alerts.DATA.BTN_CANCEL',
  },
] as const;

export const ALERTS_SIMPLE_DATA: AlertSimpleItem[] = [
  {
    id: 1,
    type: 'information',
    message: 'storybook.alerts.DATA.SIMPLE_INFO_MSG',
  },
  {
    id: 2,
    type: 'success',
    message: 'storybook.alerts.DATA.SUCCESS_SAVE',
  },
  {
    id: 3,
    type: 'warning',
    message: 'storybook.alerts.DATA.SAVE_WORK_MSG',
  },
] as const;

export const ALERTS_STATES_DATA: AlertBasicItem[] = [
  {
    id: 1,
    type: 'default',
    state: 'default',
    title: 'storybook.alerts.DATA.NORMAL_STATE_TITLE',
    message: 'storybook.alerts.DATA.NORMAL_STATE_MSG',
  },
  {
    id: 2,
    type: 'default',
    state: 'inactive',
    title: 'storybook.alerts.DATA.INACTIVE_STATE_TITLE',
    message: 'storybook.alerts.DATA.INACTIVE_STATE_MSG',
  },
  {
    id: 3,
    type: 'default',
    state: 'active',
    title: 'storybook.alerts.DATA.ACTIVE_STATE_TITLE',
    message: 'storybook.alerts.DATA.ACTIVE_STATE_MSG',
  },
] as const;