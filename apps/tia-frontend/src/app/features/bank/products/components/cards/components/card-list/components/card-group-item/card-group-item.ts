import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CardGroupView } from '../../models/card-list-view.model';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';
import { CardStack } from '../card-stack/card-stack';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-card-group-item',
  templateUrl: './card-group-item.html',
  styleUrls: ['./card-group-item.scss'],
  imports: [Badges, CardStack, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardGroupItem {
readonly group = input.required<CardGroupView>();
readonly isLoading = input.required<boolean>();

readonly cardClicked = output<{ accountId: string; cardId: string; index: number; hasMultipleCards: boolean }>();
readonly viewAllClicked = output<{ accountId: string }>();
  public handleCardClick(data: { cardId: string; index: number }): void {
    const group = this.group();
    this.cardClicked.emit({
      accountId: group.account.id,
      cardId: data.cardId,
      index: data.index,
      hasMultipleCards: group.cardImages.length > 1
    });
  }

  public handleViewAllClick(): void {
    this.viewAllClicked.emit({ accountId: this.group().account.id });
  }
  
}