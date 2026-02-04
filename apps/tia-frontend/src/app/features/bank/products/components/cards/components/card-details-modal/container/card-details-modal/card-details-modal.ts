import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { CardDetailsModalContent } from "../../components/card-details-modal-content/card-details-modal-content";
import { Store } from '@ngrx/store';
import { selectCardDetailsModalData } from 'apps/tia-frontend/src/app/store/products/cards/cards.selectors';

@Component({
  selector: 'app-card-details-modal',
  imports: [ AsyncPipe, UiModal, CardDetailsModalContent],
  templateUrl: './card-details-modal.html',
  styleUrl: './card-details-modal.scss',
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class CardDetailsModal {

   private readonly store = inject(Store);

  readonly isOpen = input.required<boolean>();
  readonly closed = output<void>();

  protected readonly modalData$ = this.store.select(selectCardDetailsModalData);

  protected handleClose(): void {
    this.closed.emit();
  }

  protected handleRequestOtp(): void {
  }
}
