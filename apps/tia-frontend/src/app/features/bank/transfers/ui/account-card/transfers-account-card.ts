import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
  output,
} from '@angular/core';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-transfers-account-card',
  imports: [DecimalPipe],
  templateUrl: './transfers-account-card.html',
  styleUrl: './transfers-account-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransfersAccountCard {
  public cardData = input.required<Account>();
  public icon = input<string | null>(null);
  public isSelected = input<boolean>(false);
  public isDisabled = input<boolean>(false);

  public cardClicked = output<Account>();

  protected readonly cardIcon = computed(
    () => this.icon() ?? 'images/svg/transfers/cardicon.svg',
  );

  protected onCardClick(): void {
    if (!this.isDisabled()) {
      this.cardClicked.emit(this.cardData());
    }
  }
}
