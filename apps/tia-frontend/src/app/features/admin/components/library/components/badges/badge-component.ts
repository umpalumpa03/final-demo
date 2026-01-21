import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Badges } from '../../../../../../shared/lib/primitives/badges/badges';
import { variantsData , statusesData, sizesData, countBadgesData } from './config/badge-data';

@Component({
  selector: 'app-badge-component',
  imports: [Badges  ],
  templateUrl: './badge-component.html',
  styleUrl: './badge-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  readonly variants = signal(variantsData());
  readonly statuses = signal(statusesData());
  readonly sizes = signal(sizesData());
  readonly countBadges = signal(countBadgesData());
}
