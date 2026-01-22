export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type AvatarTone = 'soft' | 'solid';

export type AvatarColor = 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'gray';

export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

export interface AvatarGroupItem {
  initials: string;
  color?: AvatarColor;
  tone?: AvatarTone;
  status?: AvatarStatus;
}
