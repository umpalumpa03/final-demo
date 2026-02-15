import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { AlertType } from './models/alerts.models';

export function showAlert(
  alertService: AlertService,
  translate: TranslateService,
  type: AlertType,
  messageKey: string,
  title?: string,
) {
  const fn =
    type === 'success'
      ? alertService.success
      : type === 'warning'
        ? alertService.warning
        : alertService.error;

  fn.call(alertService, translate.instant(messageKey), {
    variant: 'dismissible',
    title:
      title ??
      (type === 'success'
        ? 'Success!'
        : type === 'error'
          ? 'Oops!'
          : 'Warning!'),
  });
}

export default showAlert;
