import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Badges } from '../../../../../../shared/lib/primitives/badges/badges';
import { VARIANTS, STATUSES, SIZES, COUNT_BADGES } from './config/badge-data';

@Component({
  selector: 'app-badge-component',
  imports: [Badges  ],
  templateUrl: './badge-component.html',
  styleUrl: './badge-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  public readonly variants = signal(VARIANTS);
  public readonly statuses = signal(STATUSES);
  public readonly sizes = signal(SIZES);
  public readonly countBadges = signal(COUNT_BADGES);
}
