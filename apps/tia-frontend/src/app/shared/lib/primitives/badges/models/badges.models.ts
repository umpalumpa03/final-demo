export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export type BadgeStatus =
  | 'active'
  | 'pending'
  | 'inactive'
  | 'in-progress'
  | 'featured'
  | 'premium'
  | (string & {});

export type BadgeSize = 'small' | 'medium' | 'large';

export type BadgeShape = 'default' | 'rounded' | 'pill';

export type BadgeDotType = 'online' | 'away' | 'offline' | 'live';
