export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | (string & {});

export type BadgeStatus =
  | 'active'
  | 'pending'
  | 'inactive'
  | 'in-progress'
  | 'featured'
  | 'premium'
  | 'done'
  | 'todo'
  | (string & {});

export type BadgeSize = 'small' | 'medium' | 'large';

export type BadgeShape = 'default' | 'rounded' | 'pill';

export type BadgeDotType = 'online' | 'away' | 'offline' | 'live';

export type BadgeSkill =
  | 'javascript'
  | 'react'
  | 'nodejs'
  | 'typescript'
  | 'css'
  | 'html';

export type BadgeCategory = 'technology' | 'design' | 'marketing';

export type BadgeCustomColor =
  | 'pink'
  | 'indigo'
  | 'teal'
  | 'rose'
  | 'cyan'
  | 'amber'
  | 'lime'
  | 'slate'
  | (string & {});
