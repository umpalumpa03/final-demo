import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BadgeStatus, BadgeVariant } from './models/badges.models';


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

  readonly badgeClass = computed(() => {
 
    const statusClass = this.badgeStatus();
    if (statusClass) {
      return `badge ${statusClass}`;
    }
    return `badge badge__${this.variant()}`;
  });

  readonly badgeStatus = computed(() => {
    const currentStatus = this.status();
    if (!currentStatus) return '';
    
    switch (currentStatus) {
      case 'active':
        return 'badge__active';
      case 'pending':
        return 'badge__pending';
      case 'inactive':
        return 'badge__inactive';
      case 'in-progress':
        return 'badge__in-progress';
      case 'featured':
        return 'badge__featured';
      case 'premium':
        return 'badge__premium';
    }
  });

  readonly iconPath = computed(() => {
    const status = this.status();
    if (!status) return '';
    
    const iconMap: Record<BadgeStatus, string> = {
      'active': 'images/svg/badges/badges-active.svg',
      'pending': 'images/svg/badges/badges-pending.svg',
      'inactive': 'images/svg/badges/badges-inactive.svg',
      'in-progress': 'images/svg/badges/badges-inProgress.svg',
      'featured': 'images/svg/badges/badges-featured.svg',
      'premium': 'images/svg/badges/badges-premium.svg',
    };
    return iconMap[status];
  });

  readonly shouldShowIcon = computed(() => {
   
    return this.status() !== undefined;
  });
}
