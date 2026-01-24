import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import {
  BadgeSize,
  BadgeStatus,
  BadgeVariant,
  BadgeShape,
  BadgeDotType,
  BadgeSkill,
  BadgeCategory,
} from './models/badges.models';
import {
  statusClassMap,
  statusIconMap,
  statusAltTextMap,
  statusTextMap,
  dotColorMap,
  dotTextMap,
  skillPresetMap,
  categoryPresetMap,
} from './config/badges.config';


@Component({
  selector: 'app-badges',
  imports: [],
  templateUrl: './badges.html',
  styleUrl: './badges.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badges {
  public readonly variant = input<BadgeVariant>();
  public readonly text = input<string>('');
  public readonly status = input<BadgeStatus>();
  public readonly size = input<BadgeSize>();
  public readonly shape = input<BadgeShape>();
  public readonly skill = input<BadgeSkill>();
  public readonly category = input<BadgeCategory>();
  public readonly label = input<string>('');
  public readonly dismissible = input<boolean>(false);
  public readonly dot = input<BadgeDotType>();
  public readonly dismissed = output<void>();
  private readonly isVisible = signal(true);

  public readonly visible = computed(() => {
    if (!this.dismissible()) {
      return true;
    }
    return this.isVisible();
  });

  public readonly badgeClass = computed(() => {
    const size = this.size() ?? 'small';
    const sizeClass = `badge--${size}`;
    const statusClass = this.badgeStatus();
    const hasDot = !!this.dot();
    const defaultShape = (statusClass || hasDot) ? 'pill' : 'default';
    
    const skillKey = this.skill();
    const categoryKey = this.category();
    
    let variant: BadgeVariant = this.variant() ?? 'default';
    
    if (skillKey) {
      const preset = skillPresetMap[skillKey];
      variant = this.variant() ?? preset.variant;
    }
    
    const shape = this.shape() ?? (skillKey || categoryKey ? 'pill' : defaultShape);
    
    let shapeClass = '';
    if (shape === 'pill') {
      shapeClass = 'badge--pill';
    } else if (shape === 'rounded') {
      shapeClass = 'badge--rounded';
    }
    
    if (statusClass) {
      return `badge ${sizeClass} ${statusClass} ${shapeClass}`.trim();
    }

    if (categoryKey) {
      return `badge ${sizeClass} ${shapeClass}`.trim();
    }

    return `badge ${sizeClass} badge--${variant} ${shapeClass}`.trim();
  });

  public readonly badgeStatus = computed(() => {
    const currentStatus = this.status();
    return currentStatus ? statusClassMap[currentStatus] : '';
  });

  public readonly iconPath = computed(() => {
    const currentStatus = this.status();
    return currentStatus ? statusIconMap[currentStatus] : '';
  });

  public readonly iconAlt = computed(() => {
    const currentStatus = this.status();
    return currentStatus ? statusAltTextMap[currentStatus] : '';
  });

  public readonly badgeText = computed(() => {
    const currentStatus = this.status();
    if (currentStatus) {
      return statusTextMap[currentStatus];
    }

    const currentDot = this.dot();
    if (currentDot) {
      return dotTextMap[currentDot];
    }

    const skillKey = this.skill();
    if (skillKey) {
      return skillPresetMap[skillKey].text;
    }

    const categoryKey = this.category();
    if (categoryKey) {
      return categoryPresetMap[categoryKey].text;
    }

    return this.text();
  });

  public readonly shouldShowIcon = computed(() => {
    return !!this.status();
  });

  public readonly dotColor = computed(() => {
    const dotType = this.dot();
    return dotType ? dotColorMap[dotType] : '';
  });

  public readonly shouldShowDot = computed(() => {
    return !!this.dot();
  });

  public onDismiss(): void {
    this.isVisible.set(false);
    this.dismissed.emit();
  }
}
