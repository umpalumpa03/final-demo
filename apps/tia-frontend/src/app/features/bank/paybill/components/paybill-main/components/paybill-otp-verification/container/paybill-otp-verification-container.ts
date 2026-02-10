import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { PaybillOtpVerification } from '../components/paybill-otp-verification/paybill-otp-verification';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { Store } from '@ngrx/store';
import { PaybillActions } from '../../../../../store/paybill.actions';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';

@Component({
  selector: 'app-paybill-otp-verification-container',
  imports: [PaybillOtpVerification, ErrorStates, BasicCard],
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

  protected readonly hasValidState = computed(() => {
    const hasPayload = !!this.facade.paymentPayload();
    const hasDetails = !!this.facade.verifiedDetails();

    return hasPayload && hasDetails;
  });

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
