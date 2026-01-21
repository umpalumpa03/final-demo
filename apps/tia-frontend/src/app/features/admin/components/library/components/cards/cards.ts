import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BasicCard } from '../../../../../../shared/lib/cards/basic-card/basic-card';
import { LibraryTitle } from '../../shared/library-title/library-title';

@Component({
  selector: 'app-cards',
  imports: [BasicCard, LibraryTitle],
  templateUrl: './cards.html',
  styleUrl: './cards.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cards {
  readonly pageTitle = signal('Cards');
  readonly pageSubtitle = signal(
    'Card components with various layouts and content types',
  );

  readonly basicCardData = signal({
    title: 'Card Title',
    subtitle: 'Card description goes here',
    content:
      'This is the main content area of the card. You can put any content here.',
  });
  readonly hoverCardData = signal({
    title: 'Hover Effect',
    subtitle: 'Hover over this card',
    content: 'This card has hover effects applied.',
  });
}
