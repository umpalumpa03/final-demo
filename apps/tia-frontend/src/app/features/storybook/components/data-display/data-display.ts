import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AspectRatio } from '../../../../shared/lib/data-display/aspect-ratio/aspect-ratio';
import { AspectRatioItem } from '../../../../shared/lib/data-display/models/aspect-ratio.models';
import { Avatar } from '../../../../shared/lib/data-display/avatars/avatar';
import { AvatarGroup } from '../../../../shared/lib/data-display/avatars/avatar-groups/avatar-group';
import {
  AvatarGroupItem,
  AvatarUserProfile,
} from '../../../../shared/lib/data-display/models/avatar.model';
import { HoverCard } from '../../../../shared/lib/data-display/hover-card/hover-card';
import { KeyValueDisplay } from '../../../../shared/lib/data-display/key-value-display/key-value-display';
import { ListDisplay } from '../../../../shared/lib/data-display/list-display/list-display';
import { TimelineDisplay } from '../../../../shared/lib/data-display/timeline-display/timeline-display';
import { Tooltip } from '../../../../shared/lib/data-display/tooltip/tooltip';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { ShowcaseCard } from '../../shared/showcase-card/showcase-card';
import { getAspectRatioItems } from './config/aspect-ratio-data';
import {
  AVATAR_SIZES,
  getLoggedInUser,
  getAdditionalUsers,
  getColorAvatars,
  getGroupAvatars,
  getStatusAvatars,
} from './config/avatars-data';
import { getHoverCardItems } from './config/hover-card-data';
import { getStatisticsCardsData } from './config/cards-data';
import {
  getKeyValueItems,
  getKeyValueTitle,
} from './config/key-value-display-data';
import { getTooltipDemoItems } from './config/tooltip-data';
import { getListDisplayItems } from './config/list-display-data';
import { getTimelineItems } from './config/timeline-display-data';

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
    TranslatePipe,
  ],
  templateUrl: './data-display.html',
  styleUrl: './data-display.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataDisplay implements OnInit {
  private readonly translate = inject(TranslateService);

  private readonly loggedInUser = signal<AvatarUserProfile>(getLoggedInUser(this.translate));
  private readonly additionalUsers = signal<AvatarUserProfile[]>(getAdditionalUsers(this.translate));

  public readonly sizes = signal(AVATAR_SIZES);
  public readonly colorAvatars = signal<AvatarGroupItem[]>(getColorAvatars(this.translate));
  public readonly groupAvatars = signal<AvatarGroupItem[]>(getGroupAvatars(this.translate));
  public readonly statusAvatars = signal<AvatarGroupItem[]>(getStatusAvatars(this.translate));

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

  public readonly ratios = signal<AspectRatioItem[]>(getAspectRatioItems(this.translate));
  public readonly selectedRatioId = signal<string | null>(null);
  public readonly selectedRatio = computed<AspectRatioItem | null>(() => {
    const selectedId = this.selectedRatioId();
    if (!selectedId) {
      return null;
    }
    return this.ratios().find((item) => item.id === selectedId) ?? null;
  });

  public readonly tooltipItems = signal(getTooltipDemoItems(this.translate));
  public readonly hoverCardItems = signal(getHoverCardItems(this.translate));
  public readonly statisticCardItems = signal(getStatisticsCardsData(this.translate));
  public readonly listDisplayItems = signal(getListDisplayItems(this.translate));
  public readonly keyValueTitle = signal(getKeyValueTitle(this.translate));
  public readonly keyValueItems = signal(getKeyValueItems(this.translate));
  public readonly timelineItems = signal(getTimelineItems(this.translate));

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.loggedInUser.set(getLoggedInUser(this.translate));
      this.additionalUsers.set(getAdditionalUsers(this.translate));
      this.colorAvatars.set(getColorAvatars(this.translate));
      this.groupAvatars.set(getGroupAvatars(this.translate));
      this.statusAvatars.set(getStatusAvatars(this.translate));
      this.ratios.set(getAspectRatioItems(this.translate));
      this.tooltipItems.set(getTooltipDemoItems(this.translate));
      this.hoverCardItems.set(getHoverCardItems(this.translate));
      this.statisticCardItems.set(getStatisticsCardsData(this.translate));
      this.listDisplayItems.set(getListDisplayItems(this.translate));
      this.keyValueTitle.set(getKeyValueTitle(this.translate));
      this.keyValueItems.set(getKeyValueItems(this.translate));
      this.timelineItems.set(getTimelineItems(this.translate));
    });
  }

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
