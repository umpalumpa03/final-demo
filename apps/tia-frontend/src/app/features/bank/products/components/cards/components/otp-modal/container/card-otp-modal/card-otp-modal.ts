import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { Store } from '@ngrx/store';
import {
  selectChallengeId,
  selectOtpError,
  selectOtpLoading,
  selectOtpRemainingAttempts,
} from 'apps/tia-frontend/src/app/store/products/cards/cards.selectors';
import {
  requestCardOtp,
  resendOTPCode,
  verifyCardOtp,
} from 'apps/tia-frontend/src/app/store/products/cards/cards.actions';
import { CardOtpModalContent } from '../../components/card-otp-modal-content/card-otp-modal-content';

@Component({
  selector: 'app-card-otp-modal',
  imports: [AsyncPipe, UiModal, CardOtpModalContent],
  templateUrl: './card-otp-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardOtpModal {
  private readonly store = inject(Store);

  public readonly isOpen = input.required<boolean>();
  public readonly cardId = input.required<string>();
  public readonly closed = output<void>();

  protected readonly challengeId$ = this.store.select(selectChallengeId);
  protected readonly otpLoading$ = this.store.select(selectOtpLoading);
  protected readonly otpError$ = this.store.select(selectOtpError);
  protected readonly remainingAttempts$ = this.store.select(
    selectOtpRemainingAttempts,
  );
  public handleClose(): void {
    this.closed.emit();
  }

  public handleVerifyOtp(code: string): void {
    const challengeId = this.store.selectSignal(selectChallengeId)();
    if (challengeId) {
      this.store.dispatch(
        verifyCardOtp({
          challengeId,
          code,
          cardId: this.cardId(),
        }),
      );
    }
  }

  public handleRequestOtp(): void {
    this.store.dispatch(requestCardOtp({ cardId: this.cardId() }));
  }
  public handleResendOtp(): void {
    const challengeId = this.store.selectSignal(selectChallengeId)();

    this.store.dispatch(resendOTPCode({ challengeId: challengeId! }));
  }
}
