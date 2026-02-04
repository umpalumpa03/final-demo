import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BasicCard } from '@tia/shared/lib/cards/basic-card/basic-card';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-card-details-modal-content',
  templateUrl: './card-details-modal-content.html',
  styleUrls: ['./card-details-modal-content.scss'],
  imports: [Badges, ButtonComponent, BasicCard,TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDetailsModalContent {
  readonly cardName = input.required<string>();
  readonly cardType = input.required<string>();
  readonly currency = input.required<string>();
  readonly status = input.required<string>();
  readonly isActiveStatus = input.required<boolean>();
  readonly formattedBalance = input.required<string>();
  readonly shouldShowCreditLimit = input.required<boolean>();
  readonly formattedCreditLimit = input.required<string>();
readonly cardCategory = input.required<string>();
  readonly requestOtpClicked = output<void>();
readonly closeClicked = output<void>();
  protected handleRequestOtp(): void {
    this.requestOtpClicked.emit();
  }
  protected handleClose(): void {
  this.closeClicked.emit();
}
}