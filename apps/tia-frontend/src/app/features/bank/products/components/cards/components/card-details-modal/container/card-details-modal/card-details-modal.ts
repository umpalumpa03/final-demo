import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { CardDetailsModalContent } from '../../components/card-details-modal-content/card-details-modal-content';
import { Store } from '@ngrx/store';
import {
  selectCardDetailsModalData,
  selectCardSensitiveData,

  selectIsOtpModalOpen,
  selectIsUpdatingCardName,
  selectSelectedCardIdForOtp,
  selectShowOtpSuccessAlert,
} from 'apps/tia-frontend/src/app/store/products/cards/cards.selectors';
import {
  closeCardOtpModal,
  openCardOtpModal,
  updateCardName,
} from 'apps/tia-frontend/src/app/store/products/cards/cards.actions';
import { CardOtpModal } from '../../../otp-modal/container/card-otp-modal/card-otp-modal';
import { SimpleAlerts } from '@tia/shared/lib/alerts/components/simple-alerts/simple-alerts';
import { combineLatest, map } from 'rxjs';
import { AlertService } from '@tia/core/services/alert/alert.service';
import { AlertsWithActions } from '@tia/shared/lib/alerts/components/alerts-with-actions/alerts-with-actions';
import { AlertTypesWithIcons } from "@tia/shared/lib/alerts/components/alert-types-with-icons/alert-types-with-icons";
@Component({
  selector: 'app-card-details-modal',
  imports: [
    AsyncPipe,
    UiModal,
    CardDetailsModalContent,
    CardOtpModal,
],
  templateUrl: './card-details-modal.html',
  styleUrl: './card-details-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDetailsModal {
  private readonly store = inject(Store);

  public readonly isOpen = input.required<boolean>();
  public readonly closed = output<void>();

  protected readonly modalData$ = this.store.select(selectCardDetailsModalData);
  protected readonly isUpdating$ = this.store.select(selectIsUpdatingCardName);
  protected readonly isOtpModalOpen$ = this.store.select(selectIsOtpModalOpen);
  protected readonly selectedCardIdForOtp$ = this.store.select(
    selectSelectedCardIdForOtp,
  );
  public handleClose(): void {
    this.closed.emit();
  }
protected readonly alertService = inject(AlertService);
  public handleRequestOtp(): void {
    const cardId = this.store.selectSignal(selectCardDetailsModalData)()
      ?.cardId;
    if (cardId) {
      this.store.dispatch(openCardOtpModal({ cardId }));
    }
  }

  public handleCardNameUpdate(cardId: string, cardName: string): void {
    this.store.dispatch(updateCardName({ cardId, cardName }));
  }
  public handleCloseOtpModal(): void {
    this.store.dispatch(closeCardOtpModal());
  }
  public readonly cardSensitiveData$ = combineLatest([
    this.modalData$,
    this.store.select(selectCardSensitiveData),
  ]).pipe(
    map(([modalData, sensitiveData]) => {
      if (!modalData?.cardId) return null;
      return sensitiveData[modalData.cardId] || null;
    }),
  );
}
