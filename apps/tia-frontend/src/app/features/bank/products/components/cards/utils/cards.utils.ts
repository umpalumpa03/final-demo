import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '@tia/core/services/alert/alert.service';

export function showCardCreatedAlert(
  alertService: AlertService,
  translate: TranslateService
): void {
  alertService.success(
    translate.instant('my-products.card.card-list.alertMessage')
  );
}

export function showOtpSentAlert(
  alertService: AlertService,
  translate: TranslateService
): void {
  alertService.success(
    translate.instant('my-products.card.alerts.otpSent')
  );
}

export function showOtpVerifiedAlert(
  alertService: AlertService,
  translate: TranslateService
): void {
  alertService.success(
    translate.instant('my-products.card.alerts.cardDetailsRetrieved')
  );
}

export function showOtpErrorAlert(
  alertService: AlertService,
  translate: TranslateService,
  error: string,
  remainingAttempts: number
): void {
  const errorMessage = translate.instant('my-products.card.alerts.otpError');
  
  const message = remainingAttempts > 0 
    ? `${errorMessage} (${translate.instant('my-products.card.alerts.remainingAttempts')}: ${remainingAttempts})`
    : errorMessage;
  
  alertService.error(message);
}