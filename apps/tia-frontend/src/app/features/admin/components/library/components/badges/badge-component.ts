import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Badges } from '../../../../../../shared/lib/primitives/badges/badges';
import {
  VARIANTS,
  STATUSES,
  SIZES,
  COUNT_BADGES,
  DISMISSIBLE_BADGES,
  PILL_BADGES,
  DOT_BADGES,
} from './config/badge-data.config';
import { DismissibleBadgeItem } from './models/badge-component.models';
import { LibraryTitle } from '../../shared/library-title/library-title';

@Component({
  selector: 'app-badge-component',
  imports: [Badges, LibraryTitle],
  templateUrl: './badge-component.html',
  styleUrl: './badge-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  public readonly variants = signal(VARIANTS);
  public readonly statuses = signal(STATUSES);
  public readonly sizes = signal(SIZES);
  public readonly countBadges = signal(COUNT_BADGES);
  public readonly dismissibleBadges =
    signal<DismissibleBadgeItem[]>(DISMISSIBLE_BADGES);
  public readonly pillBadges = signal(PILL_BADGES);
  public readonly dotBadges = signal(DOT_BADGES);
  public readonly title = 'Badges';
  public readonly subtitle =
    'Badge components for labels, status indicators, and counts';

  public onDismissBadge(id: string): void {
    this.dismissibleBadges.update((badges) =>
      badges.filter((badge) => badge.id !== id),
    );
  }
}
