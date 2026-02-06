import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CardImageView } from '../../models/card-list-view.model';

@Component({
  selector: 'app-card-stack',
  templateUrl: './card-stack.html',
  styleUrls: ['./card-stack.scss'],
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardStack {
  readonly cards = input.required<CardImageView[]>();
  readonly hasMultipleCards = input.required<boolean>();
  
  readonly cardClicked = output<{ cardId: string; index: number }>();

  public handleCardClick(cardId: string, index: number): void {
    this.cardClicked.emit({ cardId, index });
  }
}