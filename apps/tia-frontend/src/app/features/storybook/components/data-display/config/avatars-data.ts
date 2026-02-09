import { TranslateService } from '@ngx-translate/core';
import {
  AvatarGroupItem,
  AvatarUserProfile,
} from '../../../../../shared/lib/data-display/models/avatar.model';

export const AVATAR_SIZES = [
  { size: 'xs', label: 'XS' },
  { size: 'sm', label: 'SM' },
  { size: 'md', label: 'MD' },
  { size: 'lg', label: 'LG' },
  { size: 'xl', label: 'XL' },
] as const;

const KEY = 'storybook.data-display.sections.avatars';

export const getLoggedInUser = (translate: TranslateService): AvatarUserProfile => ({
  firstName: translate.instant(`${KEY}.users.loggedIn.firstName`),
  lastName: translate.instant(`${KEY}.users.loggedIn.lastName`),
});

export const getAdditionalUsers = (translate: TranslateService): AvatarUserProfile[] => [
  {
    firstName: translate.instant(`${KEY}.users.additional1.firstName`),
    lastName: translate.instant(`${KEY}.users.additional1.lastName`),
  },
  {
    firstName: translate.instant(`${KEY}.users.additional2.firstName`),
    lastName: translate.instant(`${KEY}.users.additional2.lastName`),
  },
  {
    firstName: translate.instant(`${KEY}.users.additional3.firstName`),
    lastName: translate.instant(`${KEY}.users.additional3.lastName`),
  },
];

export const getColorAvatars = (translate: TranslateService): AvatarGroupItem[] => [
  { initials: translate.instant(`${KEY}.colorInitials.0`), tone: 'solid', color: 'blue' },
  { initials: translate.instant(`${KEY}.colorInitials.1`), tone: 'solid', color: 'green' },
  { initials: translate.instant(`${KEY}.colorInitials.2`), tone: 'solid', color: 'purple' },
  { initials: translate.instant(`${KEY}.colorInitials.3`), tone: 'solid', color: 'orange' },
  { initials: translate.instant(`${KEY}.colorInitials.4`), tone: 'solid', color: 'pink' },
];

export const getGroupAvatars = (translate: TranslateService): AvatarGroupItem[] => [
  { initials: translate.instant(`${KEY}.groupInitials.0`), tone: 'soft', color: 'blue' },
  { initials: translate.instant(`${KEY}.groupInitials.1`), tone: 'soft', color: 'blue' },
  { initials: translate.instant(`${KEY}.groupInitials.2`), tone: 'soft', color: 'blue' },
  { initials: translate.instant(`${KEY}.groupInitials.3`), tone: 'soft', color: 'blue' },
  { initials: translate.instant(`${KEY}.groupInitials.4`), tone: 'soft', color: 'blue' },
  { initials: translate.instant(`${KEY}.groupInitials.5`), tone: 'soft', color: 'blue' },
  { initials: translate.instant(`${KEY}.groupInitials.6`), tone: 'soft', color: 'blue' },
  { initials: translate.instant(`${KEY}.groupInitials.7`), tone: 'soft', color: 'blue' },
  { initials: translate.instant(`${KEY}.groupInitials.8`), tone: 'soft', color: 'blue' },
];

export const getStatusAvatars = (translate: TranslateService): AvatarGroupItem[] => [
  { initials: translate.instant(`${KEY}.statusInitials.0`), status: 'online', tone: 'soft', color: 'blue' },
  { initials: translate.instant(`${KEY}.statusInitials.1`), status: 'away', tone: 'soft', color: 'blue' },
  { initials: translate.instant(`${KEY}.statusInitials.2`), status: 'busy', tone: 'soft', color: 'blue' },
  { initials: translate.instant(`${KEY}.statusInitials.3`), status: 'offline', tone: 'soft', color: 'blue' },
];
