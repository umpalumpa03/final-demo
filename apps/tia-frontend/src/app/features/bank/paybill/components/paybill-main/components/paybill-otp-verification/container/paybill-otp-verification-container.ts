import { Component, inject } from '@angular/core';
import { PaybillOtpVerification } from '../components/paybill-otp-verification/paybill-otp-verification';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';

@Component({
  selector: 'app-paybill-otp-verification-container',
  imports: [PaybillOtpVerification],
  templateUrl: './paybill-otp-verification-container.html',
  styleUrl: './paybill-otp-verification-container.scss',
})
export class PaybillOtpVerificationContainer {
  protected readonly facade = inject(PaybillMainFacade);

  public onBackToDetails(): void {
    this.facade.backToDetails();
  }

  public onOtpVerified(otpCode: string): void {
    this.facade.verifyOtp(otpCode);
  }
}
