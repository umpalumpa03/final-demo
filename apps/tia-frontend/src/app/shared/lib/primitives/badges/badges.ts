import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { BadgeSize, BadgeStatus, BadgeVariant, BadgeShape } from './models/badges.models';
import { statusClassMap, statusIconMap, statusAltTextMap } from './config/badges.constants';


@Component({
  selector: 'app-badges',
  imports: [],
  templateUrl: './badges.html',
  styleUrl: './badges.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badges {
  readonly variant = input<BadgeVariant | undefined>(undefined);
  readonly text = input<string>('');
  readonly status = input<BadgeStatus | undefined>(undefined);
  readonly size = input<BadgeSize | undefined>(undefined);
  readonly shape = input<BadgeShape | undefined>(undefined);
  readonly label = input<string>('');
  readonly dismissible = input<boolean>(false);
  readonly showIcon = input<boolean>(true);
  readonly dismissed = output<void>();
  readonly badgeClass = computed(() => {
    const size = this.size() ?? 'small';
    const sizeClass = `badge--${size}`;
    const shape = this.shape() ?? 'default';
    let shapeClass = '';
    if (shape === 'pill') {
      shapeClass = 'badge--pill';
    } else if (shape === 'rounded') {
      shapeClass = 'badge--rounded';
    }
    const statusClass = this.badgeStatus();
    if (statusClass) {
      return `badge ${sizeClass} ${statusClass} ${shapeClass}`.trim();
    }
    const variant = this.variant() ?? 'default';
    return `badge ${sizeClass} badge--${variant} ${shapeClass}`.trim();
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
    return this.status() !== undefined && this.showIcon();
  });

  onDismiss(): void {
    this.dismissed.emit();
  }
}
