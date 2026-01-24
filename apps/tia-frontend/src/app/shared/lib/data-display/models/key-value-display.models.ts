export type KeyValueDisplayBadgeTone = 'blue' | 'green' | 'orange' | 'gray';
export type KeyValueDisplayValueType = 'text' | 'badge';

export interface KeyValueDisplayItem {
  id: string;
  label: string;
  value: string;
  valueType?: KeyValueDisplayValueType;
  badgeTone?: KeyValueDisplayBadgeTone;
}
