import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { AspectRatio } from '../../../../../../shared/lib/data-display/aspect-ratio/aspect-ratio';
import { AspectRatioItem } from '../../../../../../shared/lib/data-display/models/aspect-ratio.models';
import { Avatar } from '../../../../../../shared/lib/data-display/avatars/avatar';
import { AvatarGroup } from '../../../../../../shared/lib/data-display/avatars/avatar-groups/avatar-group';
import { StatisticCard } from '../../../../../../shared/lib/cards/statistic-card/statistic-card';
import {
  AvatarGroupItem,
  AvatarUserProfile,
} from '../../../../../../shared/lib/data-display/models/avatar.model';
import { HoverCard } from '../../../../../../shared/lib/data-display/hover-card/hover-card';
import { KeyValueDisplay } from '../../../../../../shared/lib/data-display/key-value-display/key-value-display';
import { ListDisplay } from '../../../../../../shared/lib/data-display/list-display/list-display';
import { TimelineDisplay } from '../../../../../../shared/lib/data-display/timeline-display/timeline-display';
import { Tooltip } from '../../../../../../shared/lib/data-display/tooltip/tooltip';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { ShowcaseCard } from '../../shared/showcase-card/showcase-card';
import { ASPECT_RATIO_ITEMS } from './config/aspect-ratio-data';
import {
  ADDITIONAL_USERS,
  AVATAR_SIZES,
  COLOR_AVATARS,
  GROUP_AVATARS,
  LOGGED_IN_USER,
  STATUS_AVATARS,
} from './config/avatars-data';
import { HOVER_CARD_ITEMS } from './config/hover-card-data';
import { STATISTICS_CARDS_DATA } from './config/cards-data';
import {
  KEY_VALUE_ITEMS,
  KEY_VALUE_TITLE,
} from './config/key-value-display-data';
import { TOOLTIP_DEMO_ITEMS } from './config/tooltip-data';
import { LIST_DISPLAY_ITEMS } from './config/list-display-data';
import { TIMELINE_ITEMS } from './config/timeline-display-data';

@Component({
  selector: 'app-data-display',
  imports: [
    LibraryTitle,
    ShowcaseCard,
    Avatar,
    AvatarGroup,
    AspectRatio,
    Tooltip,
    HoverCard,
    ListDisplay,
    KeyValueDisplay,
    TimelineDisplay,
  ],
  templateUrl: './data-display.html',
  styleUrl: './data-display.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataDisplay {
  public readonly title = 'Data Display';
  public readonly subtitle =
    'Avatars, aspect ratios, tooltips, and hover cards';

  private readonly loggedInUser = signal<AvatarUserProfile>(LOGGED_IN_USER);
  private readonly additionalUsers = signal<AvatarUserProfile[]>(ADDITIONAL_USERS);

  public readonly sizes = signal(AVATAR_SIZES);
  public readonly colorAvatars = signal<AvatarGroupItem[]>(COLOR_AVATARS);
  public readonly groupAvatars = signal<AvatarGroupItem[]>(GROUP_AVATARS);
  public readonly statusAvatars = signal<AvatarGroupItem[]>(STATUS_AVATARS);

  public readonly initialsUsers = computed(() => [
    this.loggedInUser(),
    ...this.additionalUsers(),
  ]);

  public readonly initialsAvatars = computed<AvatarGroupItem[]>(() =>
    this.initialsUsers().map((user) => ({
      initials: this.toInitials(user.firstName, user.lastName),
      tone: 'soft',
      color: 'blue',
    })),
  );

  public readonly ratios = signal<AspectRatioItem[]>(ASPECT_RATIO_ITEMS);
  public readonly selectedRatioId = signal<string | null>(null);
  public readonly selectedRatio = computed<AspectRatioItem | null>(() => {
    const selectedId = this.selectedRatioId();
    if (!selectedId) {
      return null;
    }
    return this.ratios().find((item) => item.id === selectedId) ?? null;
  });

  public readonly tooltipItems = signal(TOOLTIP_DEMO_ITEMS);
  public readonly hoverCardItems = signal(HOVER_CARD_ITEMS);
  public readonly statisticCardItems = signal(STATISTICS_CARDS_DATA);
  public readonly listDisplayItems = signal(LIST_DISPLAY_ITEMS);
  public readonly keyValueTitle = signal(KEY_VALUE_TITLE);
  public readonly keyValueItems = signal(KEY_VALUE_ITEMS);
  public readonly timelineItems = signal(TIMELINE_ITEMS);

  public onRatioSelected(item: AspectRatioItem): void {
    this.selectedRatioId.set(item.id);
  }

  public hasRatios(): boolean {
    return this.ratios().length > 0;
  }

  public isChangeEmpty(change?: string | null): boolean {
    if (!change) {
      return true;
    }
    return change.trim().toLowerCase() === 'no change';
  }

  private toInitials(firstName: string, lastName: string): string {
    const first = firstName.trim().charAt(0);
    const last = lastName.trim().charAt(0);
    return `${first}${last}`.toUpperCase();
  }
}
