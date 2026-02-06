import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IOtpVerificationConfig } from 'apps/tia-frontend/src/app/core/auth/models/otp-verification.models';

@Injectable()
export class LoanVerifyState {
  private readonly translate = inject(TranslateService);

  public readonly otpConfig = signal<IOtpVerificationConfig>({
    iconUrl: './images/svg/feature-loans/prepayment.svg',
    title: this.translate.instant('loans.prepayment_wizard.step_otp.title'),
    subText: this.translate.instant(
      'loans.prepayment_wizard.step_otp.subtitle',
    ),
    submitBtnName: this.translate.instant(
      'loans.prepayment_wizard.step_otp.button',
    ),
    backLinkText: this.translate.instant('loans.buttons.cancel'),
  });
}
