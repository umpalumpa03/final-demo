import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PaybillOtpVerification } from '../components/paybill-otp-verification/paybill-otp-verification';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { Store } from '@ngrx/store';
import { PaybillActions } from '../../../../../store/paybill.actions';

@Component({
  selector: 'app-paybill-otp-verification-container',
  imports: [PaybillOtpVerification],
  templateUrl: './paybill-otp-verification-container.html',
  styleUrl: './paybill-otp-verification-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillOtpVerificationContainer {
  protected readonly facade = inject(PaybillMainFacade);
  private readonly store = inject(Store);

  public onBackToDetails(): void {
    this.facade.backToDetails();
  }


    public verifyOtp(otpCode: string): void {
      const challengeId = this.facade.challengeId();
      if (challengeId) {
        this.store.dispatch(
          PaybillActions.confirmPayment({
            payload: { challengeId, code: otpCode },
          }),
        );
      }
    }
}
