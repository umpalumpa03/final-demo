import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import {
  getVariants,
  STATUSES,
  getSizes,
  getCountBadges,
  getDismissibleBadges,
  getPillBadges,
  DOT_BADGES,
  SKILL_BADGES,
  CATEGORY_BADGES,
  getBadgeStates,
  getCustomColors,
} from './config/badge-data.config';
import { BadgeStateItem, DismissibleBadgeItem } from './models/badge-component.models';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { Badges } from '@tia/shared/lib/primitives/badges/badges';

@Component({
  selector: 'app-badge-component',
  imports: [Badges, LibraryTitle, TranslatePipe],
  templateUrl: './badge-component.html',
  styleUrl: './badge-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent implements OnInit {
  private readonly translate = inject(TranslateService);

  public readonly variants = signal(getVariants(this.translate));
  public readonly statuses = signal(STATUSES);
  public readonly sizes = signal(getSizes(this.translate));
  public readonly countBadges = signal(getCountBadges(this.translate));
  public readonly dismissibleBadges =
    signal<DismissibleBadgeItem[]>(getDismissibleBadges(this.translate));
  public readonly pillBadges = signal(getPillBadges(this.translate));
  public readonly dotBadges = signal(DOT_BADGES);
  public readonly skillBadges = signal(SKILL_BADGES);
  public readonly categoryBadges = signal(CATEGORY_BADGES);
  public readonly badgeStates = signal(getBadgeStates(this.translate));
  public readonly customColors = signal(getCustomColors(this.translate));
  public readonly simpleBadgeSelected = signal(false);

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.variants.set(getVariants(this.translate));
      this.sizes.set(getSizes(this.translate));
      this.countBadges.set(getCountBadges(this.translate));
      this.dismissibleBadges.set(getDismissibleBadges(this.translate));
      this.pillBadges.set(getPillBadges(this.translate));
      this.badgeStates.set(getBadgeStates(this.translate));
      this.customColors.set(getCustomColors(this.translate));
    });
  }

  public onDismissBadge(id: string): void {
    this.dismissibleBadges.update((badges) =>
      badges.filter((badge) => badge.id !== id),
    );
  }

  public onSelectedChange(id: string, selected: boolean): void {
    this.badgeStates.update((states) =>
      states.map((state) =>
        state.id === id ? { ...state, selected } : state
      )
    );
  }

  public onSimpleBadgeSelectedChange(selected: boolean): void {
    this.simpleBadgeSelected.set(selected);
  }

  public getStateLabel(item: BadgeStateItem): string {
    if (item.disabled) return this.translate.instant('storybook.badges.badgeStates.disabledLabel');
    if (item.selected) return this.translate.instant('storybook.badges.badgeStates.selectedLabel');
    if (item.id === 'hover') {
      return this.translate.instant('storybook.badges.badgeStates.hovered');
    }
    return this.translate.instant('storybook.badges.badgeStates.default');
  }
}
