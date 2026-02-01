import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CardGroupView } from '../../models/card-list-view.model';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';
import { CardStack } from '../card-stack/card-stack';

@Component({
  selector: 'app-card-group-item',
  templateUrl: './card-group-item.html',
  styleUrls: ['./card-group-item.scss'],
  imports: [Badges, CardStack],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardGroupItem {
  readonly group = input.required<CardGroupView>();
  
  readonly cardClicked = output<{ accountId: string; cardId: string; index: number; hasMultipleCards: boolean }>();
  readonly viewAllClicked = output<{ accountId: string }>();

  protected handleCardClick(data: { cardId: string; index: number }): void {
    const group = this.group();
    this.cardClicked.emit({
      accountId: group.account.id,
      cardId: data.cardId,
      index: data.index,
      hasMultipleCards: group.cardImages.length > 1
    });
  }

  protected handleViewAllClick(): void {
    this.viewAllClicked.emit({ accountId: this.group().account.id });
  }
}