import { GridColumns } from '../container/grid-layout.model';

export const InitialColsValue = '2';
export const InitialGapValue = '1.6rem';

export const colStyle: Record<GridColumns, string> = {
  '1': 'minmax(0, 1fr)',
  '2': 'repeat(2, minmax(0, 1fr))',
  '3': 'repeat(3, minmax(0, 1fr))',
  '4': 'repeat(4, minmax(0, 1fr))',
  '2-1': '2fr 1fr',
  '1-2': '1fr 2fr',
} as const;
