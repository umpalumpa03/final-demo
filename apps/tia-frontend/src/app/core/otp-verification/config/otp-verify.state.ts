import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class OtpVerifyService {
  private readonly translate = inject(TranslateService);

  public otpConfig = signal({
    label:  this.translate.instant('auth.otp-sign-in.otpPlaceholder'),
    length: 4,
    errorMessage: ' ',
  });

  public phoneConfig = signal({
    label:  this.translate.instant('auth.otp-sign-up.otpPlaceholder'),
    errorMessage:  this.translate.instant('auth.otp-sign-up.errorMessage'),
    placeholder: '(555) 0000-0000',
  });
}
