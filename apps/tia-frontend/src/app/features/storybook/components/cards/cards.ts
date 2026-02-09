import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { BasicCard } from 'apps/tia-frontend/src/app/shared/lib/cards/basic-card/basic-card';
import { StatisticCard } from 'apps/tia-frontend/src/app/shared/lib/cards/statistic-card/statistic-card';
import {
  CardData,
  CategoryCardData,
  StatisticCardData,
} from 'apps/tia-frontend/src/app/shared/lib/cards/models/card.model';
import { LibraryTitle } from '../../shared/library-title/library-title';

import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { CategoryCard } from '@tia/shared/lib/cards/category-card/category-card';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cards',
  imports: [
    BasicCard,
    LibraryTitle,
    StatisticCard,
    ButtonComponent,
    CategoryCard,
    BasicCard,
    TranslatePipe,
  ],
  templateUrl: './cards.html',
  styleUrl: './cards.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cards {
  private readonly translate = inject(TranslateService);

  public readonly pageTitle = this.translate.instant(
    'storybook.cards.pageTitle',
  );
  public readonly pageSubtitle = this.translate.instant(
    'storybook.cards.pageSubtitle',
  );
  public readonly basicCards = signal<CardData[]>([
    {
      id: 'basic-card-1',
      title: this.translate.instant('storybook.cards.basic1.title'),
      subtitle: this.translate.instant('storybook.cards.basic1.subtitle'),
      content: this.translate.instant('storybook.cards.basic1.content'),
    },
    {
      id: 'basic-card-2',
      title: this.translate.instant('storybook.cards.basic2.title'),
      subtitle: this.translate.instant('storybook.cards.basic2.subtitle'),
      content: this.translate.instant('storybook.cards.basic2.content'),
      hasFooter: true,
    },
    {
      id: 'basic-card-3',
      title: this.translate.instant('storybook.cards.basic3.title'),
      subtitle: this.translate.instant('storybook.cards.basic3.subtitle'),
      content: this.translate.instant('storybook.cards.basic3.content'),
      hasHover: true,
    },
  ]);

  public readonly statisticsCards = signal<StatisticCardData[]>([
    {
      id: 'stat-card-revenue',
      label: this.translate.instant('storybook.cards.stats.revenue.label'),
      value: this.translate.instant('storybook.cards.stats.revenue.value'),
      change: this.translate.instant('storybook.cards.stats.revenue.change'),
      changeType: 'positive',
      icon: 'images/svg/cards/dolar.svg',
    },
    {
      id: 'stat-card-subscriptions',
      label: this.translate.instant(
        'storybook.cards.stats.subscriptions.label',
      ),
      value: this.translate.instant(
        'storybook.cards.stats.subscriptions.value',
      ),
      change: this.translate.instant(
        'storybook.cards.stats.subscriptions.change',
      ),
      changeType: 'positive',
      icon: 'images/svg/cards/person.svg',
    },
    {
      id: 'stat-card-sales',
      label: this.translate.instant('storybook.cards.stats.sales.label'),
      value: this.translate.instant('storybook.cards.stats.sales.value'),
      change: this.translate.instant('storybook.cards.stats.sales.change'),
      changeType: 'positive',
      icon: 'images/svg/cards/card.svg',
    },
    {
      id: 'stat-card-active',
      label: this.translate.instant('storybook.cards.stats.active.label'),
      value: this.translate.instant('storybook.cards.stats.active.value'),
      change: this.translate.instant('storybook.cards.stats.active.change'),
      changeType: 'negative',
      icon: 'images/svg/cards/vector.svg',
    },
  ]);

  public readonly categoryCards = signal<CategoryCardData[]>([
    {
      id: 'category-card-1',
      title: this.translate.instant('storybook.cards.category.utilities.title'),
      subtitle: this.translate.instant(
        'storybook.cards.category.utilities.subtitle',
      ),
      icon: 'images/svg/cards/lightning.svg',
      iconBgColor: '#fdc700',
      count: 12,
    },
    {
      id: 'category-card-2',
      title: this.translate.instant('storybook.cards.category.internet.title'),
      subtitle: this.translate.instant(
        'storybook.cards.category.internet.subtitle',
      ),
      icon: 'images/svg/cards/wifi.svg',
      iconBgColor: '#0ea5e9',
      count: 8,
    },
  ]);

  public readonly activeCategoryId = signal<string | null>(null);

  public handleCategoryClick(cardId: string): void {
    this.activeCategoryId.set(cardId);
  }
}
