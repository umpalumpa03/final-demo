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
    return `badge badge--${this.variant()}`;
  });

  readonly badgeStatus = computed(() => {
    const currentStatus = this.status();
    if (!currentStatus) return '';
    
    switch (currentStatus) {
      case 'active':
        return 'badge--active';
      case 'pending':
        return 'badge--pending';
      case 'inactive':
        return 'badge--inactive';
      case 'in-progress':
        return 'badge--in-progress';
      case 'featured':
        return 'badge--featured';
      case 'premium':
        return 'badge--premium';
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
