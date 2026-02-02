import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Badges } from '@tia/shared/lib/primitives/badges/badges';
import { CardWithDetails } from '../../../../models/card-image.model';

@Component({
  selector: 'app-card-grid-item',
  templateUrl: './card-grid-item.html',
  styleUrls: ['./card-grid-item.scss'],
  imports: [Badges],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardGridItem {
  readonly card = input.required<CardWithDetails>();
  readonly currency = input.required<string>();
  
  readonly cardClicked = output<string>();

  protected handleClick(): void {
    this.cardClicked.emit(this.card().cardId);
  }
}