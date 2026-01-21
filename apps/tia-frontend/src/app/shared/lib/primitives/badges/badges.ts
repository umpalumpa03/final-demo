import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BadgeVariant } from './models/badges.models';


@Component({
  selector: 'app-badges',
  imports: [],
  templateUrl: './badges.html',
  styleUrl: './badges.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badges {
  readonly variant = input<BadgeVariant>('default');
  readonly text = input<string>('');

  readonly badgeClass = computed(() => `badge badge--${this.variant()}`);
}
