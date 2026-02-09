import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AlertsState {
  private readonly translate = inject(TranslateService);

  public titleCfg = signal({
    PAGE_MAIN: 'storybook.alerts.TITLES.PAGE_MAIN',
    PAGE_SUB: 'storybook.alerts.TITLES.PAGE_SUB',
    BASIC: 'storybook.alerts.TITLES.BASIC',
    ICONS: 'storybook.alerts.TITLES.ICONS',
    DISMISSIBLE: 'storybook.alerts.TITLES.DISMISSIBLE',
    ACTIONS: 'storybook.alerts.TITLES.ACTIONS',
    SIMPLE: 'storybook.alerts.TITLES.SIMPLE',
    STATES: 'storybook.alerts.TITLES.STATES',
    DEFAULT_TITLE: 'storybook.alerts.DATA.DEFAULT_TITLE',
    DEFAULT_MSG: 'storybook.alerts.DATA.DEFAULT_MSG',
    ERROR_TITLE: 'storybook.alerts.DATA.ERROR_TITLE',
    ERROR_MSG: 'storybook.alerts.DATA.ERROR_MSG',
    SUCCESS_SAVE: 'storybook.alerts.DATA.SUCCESS_SAVE',
    CONFIRM_ACTION: 'storybook.alerts.DATA.CONFIRM_ACTION',
    CONFIRM_MSG: 'storybook.alerts.DATA.CONFIRM_MSG',
  });
}
