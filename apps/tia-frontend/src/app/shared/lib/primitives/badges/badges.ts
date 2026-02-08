import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  BadgeSize,
  BadgeStatus,
  BadgeVariant,
  BadgeShape,
  BadgeDotType,
  BadgeSkill,
  BadgeCategory,
  BadgeCustomColor,
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
  private readonly translate = inject(TranslateService, { optional: true });

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
  public readonly disabled = input<boolean>(false);
  public readonly selected = input<boolean>(false);
  public readonly hoverable = input<boolean>(false);
  public readonly clickable = input<boolean>(false);
  public readonly customColor = input<BadgeCustomColor>();
  public readonly dismissed = output<void>();
  public readonly clicked = output<void>();
  public readonly selectedChange = output<boolean>();
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
    const customColorKey = this.customColor();
    
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

    const hasSpecialState = !!statusClass || hasDot || !!skillKey || !!categoryKey || !!customColorKey;
    
    let stateClass = '';
    if (!hasSpecialState) {
      if (this.disabled()) {
        stateClass = 'badge--disabled';
      } else if (this.selected()) {
        stateClass = 'badge--selected';
      }
    }
    
    if (statusClass) {
      return `badge ${sizeClass} ${statusClass} ${shapeClass}`.trim();
    }

    if (categoryKey) {
      return `badge ${sizeClass} ${shapeClass}`.trim();
    }

    if (customColorKey) {
      return `badge ${sizeClass} ${shapeClass} ${stateClass}`.trim();
    }

    return `badge ${sizeClass} badge--${variant} ${shapeClass} ${stateClass}`.trim();
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
      if (this.translate) {
        const statusKey = currentStatus === 'in-progress' ? 'inProgress' : currentStatus;
        return this.translate.instant(`storybook.badges.status.${statusKey}`) || statusTextMap[currentStatus];
      }
      return statusTextMap[currentStatus];
    }

    const currentDot = this.dot();
    if (currentDot) {
      if (this.translate) {
        return this.translate.instant(`storybook.badges.dot.${currentDot}`) || dotTextMap[currentDot];
      }
      return dotTextMap[currentDot];
    }

    const skillKey = this.skill();
    if (skillKey) {
      if (this.translate) {
        return this.translate.instant(`storybook.badges.skills.${skillKey}`) || skillPresetMap[skillKey].text;
      }
      return skillPresetMap[skillKey].text;
    }

    const categoryKey = this.category();
    if (categoryKey) {
      if (this.translate) {
        return this.translate.instant(`storybook.badges.categories.${categoryKey}`) || categoryPresetMap[categoryKey].text;
      }
      return categoryPresetMap[categoryKey].text;
    }

    return this.text();
  });

  public readonly shouldShowIcon = computed(() => {
    return !!this.status() && !!this.iconPath();
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

  public onClick(): void {
    if (this.clickable() && !this.disabled()) {
      this.selectedChange.emit(!this.selected());
      this.clicked.emit();
    }
  }
}
