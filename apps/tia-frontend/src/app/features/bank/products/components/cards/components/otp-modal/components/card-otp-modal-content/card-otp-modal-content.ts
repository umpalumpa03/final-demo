import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { OtpVerification } from 'apps/tia-frontend/src/app/core/auth/shared/otp-verification/otp-verification';
import { CARD_OTP_MODAL_CONFIG } from '../../config/card-otp-modal.config';
import { OtpVerificationData } from '../../../../models/otp-verification-data.model';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IOtpVerificationConfig } from 'apps/tia-frontend/src/app/core/auth/models/otp-verification.models';

@Component({
  selector: 'app-card-otp-modal-content',
  templateUrl: './card-otp-modal-content.html',
  styleUrls: ['./card-otp-modal-content.scss'],
  imports: [OtpVerification],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardOtpModalContent {
  public readonly isLoading = input.required<boolean>();
  public readonly errorMessage = input<string | null>(null);
  public readonly verifyClicked = output<string>();
  public readonly cancelClicked = output<void>();
  public readonly resendClicked = output<void>();
  public readonly remainingAttempts = input<number | null>(null);
  public  handleResend(): void {
    this.resendClicked.emit();
  }

  public handleVerify(data: OtpVerificationData): void {
    if (data.isCalled && data.otp) {
      this.verifyClicked.emit(data.otp);
    }
  }

  public handleCancel(): void {
    this.cancelClicked.emit();
  }

private readonly translate: TranslateService = inject(TranslateService);

public readonly otpConfig: IOtpVerificationConfig = {
  iconUrl: '/images/svg/auth/secured-blue.svg',
  title: this.translate.instant('my-products.card.card-otp-modal.title'),
  subText: this.translate.instant('my-products.card.card-otp-modal.subText'),
  submitBtnName: this.translate.instant('my-products.card.card-otp-modal.submitBtn'),
  backLinkText: this.translate.instant('my-products.card.card-otp-modal.cancel'),
};
}
