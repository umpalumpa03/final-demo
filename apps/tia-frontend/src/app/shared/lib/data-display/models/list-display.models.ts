export type ListDisplayTone = 'blue' | 'green' | 'orange' | 'gray' | 'away';

export interface ListDisplayBadge {
  label: string;
  tone: ListDisplayTone;
}

export interface ListDisplayItem {
  id: string;
  initials: string;
  name: string;
  role: string;
  statusTone?: ListDisplayTone;
  badge?: ListDisplayBadge;
}
