import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
  output,
} from '@angular/core';
import { Account } from '@tia/shared/models/accounts/accounts.model';
import { AccountData } from '../../models/transfers.state.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-transfers-account-card',
  imports: [DecimalPipe],
  templateUrl: './transfers-account-card.html',
  styleUrl: './transfers-account-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransfersAccountCard {
  public cardData = input.required<AccountData>();
  public mode = input<'sender' | 'recipient'>('sender');
  public icon = input<string | null>(null);
  public isSelected = input<boolean>(false);
  public isDisabled = input<boolean>(false);

  public cardClicked = output<AccountData>();

  private isAccount(data: AccountData): data is Account {
    return 'balance' in data;
  }
  protected readonly isFavorite = computed(() => {
    const data = this.cardData();
    return this.isAccount(data) && data.isFavorite;
  });

  protected readonly displayName = computed(() => {
    const data = this.cardData();
    if (this.isAccount(data)) {
      return data.friendlyName || data.name;
    }
    return null;
  });

  protected readonly balance = computed(() => {
    const data = this.cardData();
    return this.isAccount(data) ? data.balance : null;
  });

  protected readonly cardIcon = computed(
    () => this.icon() ?? 'images/svg/transfers/cardicon.svg',
  );

  protected onCardClick(): void {
    if (!this.isDisabled()) {
      this.cardClicked.emit(this.cardData());
    }
  }
}
