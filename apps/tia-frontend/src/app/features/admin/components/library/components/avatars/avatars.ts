import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Avatar } from '../../../../../../shared/lib/data-display/avatars/avatar';
import { AvatarGroup } from '../../../../../../shared/lib/data-display/avatars/avatar-groups/avatar-group';
import {
  AvatarGroupItem,
  AvatarUserProfile,
} from '../../../../../../shared/lib/data-display/models/avatar.model';
import { AspectRatioComponent } from '../aspect-ratio/aspect-ratio';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { ADDITIONAL_USERS, AVATAR_SIZES, COLOR_AVATARS, GROUP_AVATARS, LOGGED_IN_USER, STATUS_AVATARS } from './config/avatars-data.config';

@Component({
  selector: 'app-avatars',
  imports: [LibraryTitle, Avatar, AvatarGroup, AspectRatioComponent],
  templateUrl: './avatars.html',
  styleUrl: './avatars.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatars {
  public readonly pageTitle = 'Avatars';
  public readonly pageSubtitle = 'Sizes, initials, colors, groups, and status indicators';

  private readonly loggedInUser = signal<AvatarUserProfile>(LOGGED_IN_USER);
  private readonly additionalUsers = signal<AvatarUserProfile[]>(ADDITIONAL_USERS);

  public readonly sizes = signal(AVATAR_SIZES);

  public readonly initialsUsers = computed(() => [this.loggedInUser(), ...this.additionalUsers()]);

  public readonly initialsAvatars = computed<AvatarGroupItem[]>(() =>
    this.initialsUsers().map((user) => ({
      initials: this.toInitials(user.firstName, user.lastName),
      tone: 'soft',
      color: 'blue',
    })),
  );

  public readonly colorAvatars = signal<AvatarGroupItem[]>(COLOR_AVATARS);

  public readonly groupAvatars = signal<AvatarGroupItem[]>(GROUP_AVATARS);

  public readonly statusAvatars = signal<AvatarGroupItem[]>(STATUS_AVATARS);
  public readonly loggedInInitials = computed(() => {
    const user = this.loggedInUser();
    return this.toInitials(user.firstName, user.lastName);
  });

  private toInitials(firstName: string, lastName: string): string {
    const first = firstName.trim().charAt(0);
    const last = lastName.trim().charAt(0);
    return `${first}${last}`.toUpperCase();
  }
}
