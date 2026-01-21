import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BasicCard } from '../../../../../../shared/lib/cards/basic-card/basic-card';

@Component({
  selector: 'app-cards',
  imports: [BasicCard],
  templateUrl: './cards.html',
  styleUrl: './cards.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Cards {
  readonly basicCardData = signal({
    title: 'Card Title',
    subtitle: 'Card description goes here',
    content:
      'This is the main content area of the card. You can put any content here.',
  });
}
