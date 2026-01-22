import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BasicCard } from 'apps/tia-frontend/src/app/shared/lib/cards/basic-card/basic-card';
import {
  CardData,
  StatisticCardData,
} from 'apps/tia-frontend/src/app/shared/lib/cards/models/card.model';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { BASIC_CARDS_DATA, STATISTICS_CARDS_DATA } from './config/cards-data';
import { StatisticCard } from '@tia/shared/lib/cards/statistic-card/statistic-card';

@Component({
  selector: 'app-cards',
  imports: [BasicCard, LibraryTitle,StatisticCard],
  templateUrl: './cards.html',
  styleUrl: './cards.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cards {
  readonly pageTitle = 'Cards';
  readonly pageSubtitle =
    'Card components with various layouts and content types';

  readonly basicCards = signal<CardData[]>(BASIC_CARDS_DATA);
  readonly statisticsCards = signal<StatisticCardData[]>(STATISTICS_CARDS_DATA);
}
