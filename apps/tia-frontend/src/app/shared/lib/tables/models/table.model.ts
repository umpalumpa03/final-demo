import { BadgeStatus } from '../../primitives/badges/models/badges.models';
type tableVariant =
  | 'basic'
  | 'row-selection'
  | 'actions'
  | 'sortable'
  | 'striped'
  | 'compact'
  | 'select-actions';

type paginationVariant = 'scroll' | 'page';

type alignment = 'left' | 'right' | 'center';

type infoType = 'text' | 'status' | 'icon' | 'state';

interface TableHeader {
  title: string;
  align: alignment;
  width: string;
  sortable?: boolean;
}

interface PrintedData {
  type: infoType;
  value: BadgeStatus;
  align: alignment;
  category?: string;
  accountName?: string;
  date?: string;
  variant?: string;
  disabled?: boolean;
  selected?: boolean;
  hover?: boolean;
  clickable?: boolean;
  customColor?: string;
}

export interface TableRowCell {
  id: string;
  disabled?: boolean;
  selected?: boolean;
  highlighted?: boolean;
  info: PrintedData[];
}

export interface TableActionEvent {
  action: string;
  rowId: string;
  selectedItems: TableRowCell[];
}

export interface TableConfig {
  type: tableVariant;
  paginationType?: paginationVariant;
  itemPerPage: number;
  headers: TableHeader[];
  rows: TableRowCell[];
}
