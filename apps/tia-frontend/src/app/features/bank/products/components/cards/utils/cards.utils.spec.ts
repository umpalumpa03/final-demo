import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { TranslateService } from '@ngx-translate/core';
import {
  showCardCreatedAlert,
  showOtpSentAlert,
  showOtpVerifiedAlert,
  showOtpErrorAlert,
} from './cards.utils';

describe('Cards Utils', () => {
  let alertService: AlertService;
  let translateService: TranslateService;

  beforeEach(() => {
    alertService = {
      success: vi.fn(),
      error: vi.fn(),
    } as any;

    translateService = {
      instant: vi.fn((key: string) => key),
    } as any;
  });

  it('should show card created alert', () => {
    showCardCreatedAlert(alertService, translateService);
    
    expect(translateService.instant).toHaveBeenCalledWith('my-products.card.card-list.alertMessage');
    expect(alertService.success).toHaveBeenCalledWith('my-products.card.card-list.alertMessage');
  });

  it('should show OTP sent alert', () => {
    showOtpSentAlert(alertService, translateService);
    
    expect(translateService.instant).toHaveBeenCalledWith('my-products.card.alerts.otpSent');
    expect(alertService.success).toHaveBeenCalledWith('my-products.card.alerts.otpSent');
  });

  it('should show OTP verified alert', () => {
    showOtpVerifiedAlert(alertService, translateService);
    
    expect(translateService.instant).toHaveBeenCalledWith('my-products.card.alerts.cardDetailsRetrieved');
    expect(alertService.success).toHaveBeenCalledWith('my-products.card.alerts.cardDetailsRetrieved');
  });

  it('should show OTP error alert with remaining attempts', () => {
    showOtpErrorAlert(alertService, translateService, 'Invalid OTP', 2);
    
    expect(translateService.instant).toHaveBeenCalledWith('my-products.card.alerts.otpError');
    expect(translateService.instant).toHaveBeenCalledWith('my-products.card.alerts.remainingAttempts');
    expect(alertService.error).toHaveBeenCalled();
  });

  it('should show OTP error alert without remaining attempts', () => {
    showOtpErrorAlert(alertService, translateService, 'Invalid OTP', 0);
    
    expect(translateService.instant).toHaveBeenCalledWith('my-products.card.alerts.otpError');
    expect(alertService.error).toHaveBeenCalledWith('my-products.card.alerts.otpError');
  });
});