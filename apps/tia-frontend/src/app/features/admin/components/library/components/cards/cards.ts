import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BasicCard } from 'apps/tia-frontend/src/app/shared/lib/cards/basic-card/basic-card';
import { StatisticCard } from 'apps/tia-frontend/src/app/shared/lib/cards/statistic-card/statistic-card';
import {
  CardData,
  StatisticCardData,
} from 'apps/tia-frontend/src/app/shared/lib/cards/models/card.model';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { BASIC_CARDS_DATA, STATISTICS_CARDS_DATA } from './config/cards-data';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-cards',
  imports: [BasicCard, LibraryTitle, StatisticCard,ButtonComponent],
  templateUrl: './cards.html',
  styleUrl: './cards.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cards {
  public readonly pageTitle = 'Cards';
  public readonly pageSubtitle =
    'Card components with various layouts and content types';

  public readonly basicCards = signal<CardData[]>(BASIC_CARDS_DATA);
  public readonly statisticsCards = signal<StatisticCardData[]>(
    STATISTICS_CARDS_DATA,
  );
}