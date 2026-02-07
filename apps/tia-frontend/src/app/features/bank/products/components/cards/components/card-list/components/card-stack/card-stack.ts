import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CardImageView } from '../../models/card-list-view.model';
import { Skeleton } from '@tia/shared/lib/feedback/skeleton/skeleton';

@Component({
  selector: 'app-card-stack',
  templateUrl: './card-stack.html',
  styleUrls: ['./card-stack.scss'],
  imports: [Skeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardStack {
  public readonly cards = input.required<CardImageView[]>();
  public readonly hasMultipleCards = input.required<boolean>();
  public readonly isLoading = input.required<boolean>();

  readonly cardClicked = output<{ cardId: string; index: number }>();
  public handleCardClick(cardId: string, index: number): void {
    this.cardClicked.emit({ cardId, index });
  }
}
