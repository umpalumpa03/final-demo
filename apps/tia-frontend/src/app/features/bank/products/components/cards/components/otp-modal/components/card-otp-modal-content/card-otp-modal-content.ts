import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IOtpVerificationConfig } from '@tia/core/otp-verification/models/otp-verification.models';
import { OtpVerification } from '@tia/core/otp-verification/container/otp-verification';
import { OtpResendTypes } from '@tia/core/otp-verification/config/otp.config';

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
  public readonly otpResendType = OtpResendTypes.CARDS;
  public handleResend(): void {
    this.resendClicked.emit();
  }

  public handleVerify(otp: string): void {
    this.verifyClicked.emit(otp);
  }

  public handleCancel(): void {
    this.cancelClicked.emit();
  }

  private readonly translate: TranslateService = inject(TranslateService);

  public readonly otpConfig: IOtpVerificationConfig = {
    iconUrl: '/images/svg/auth/secured-blue.svg',
    title: this.translate.instant('my-products.card.card-otp-modal.title'),
    subText: this.translate.instant('my-products.card.card-otp-modal.subText'),
    submitBtnName: this.translate.instant(
      'my-products.card.card-otp-modal.submitBtn',
    ),
    backLinkText: this.translate.instant(
      'my-products.card.card-otp-modal.cancel',
    ),
  };
}
