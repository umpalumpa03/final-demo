import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BadgeSize, BadgeStatus, BadgeVariant } from './models/badges.models';
import { statusClassMap, statusIconMap, statusAltTextMap } from './config/badges.constants';


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
  readonly status = input<BadgeStatus | undefined>(undefined);
  readonly size = input<BadgeSize>('small');
  readonly label = input<string>('');
  readonly badgeClass = computed(() => {
    const sizeClass = `badge--${this.size()}`;
    const statusClass = this.badgeStatus();
    if (statusClass) {
      return `badge ${sizeClass} ${statusClass}`;
    }
    return `badge ${sizeClass} badge--${this.variant()}`;
  });

  readonly badgeStatus = computed(() => {
    return this.status() ? statusClassMap[this.status()!] : '';
  });

  readonly iconPath = computed(() => {
    return this.status() ? statusIconMap[this.status()!] : '';
  });

  readonly iconAlt = computed(() => {
    return this.status() ? statusAltTextMap[this.status()!] : '';
  });

  readonly shouldShowIcon = computed(() => {
   
    return this.status() !== undefined;
  });
}
