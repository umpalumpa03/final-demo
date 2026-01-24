import { BadgeStatus } from '../../primitives/badges/models/badges.models';
type tableVariant =
  | 'basic'
  | 'row-selection'
  | 'actions'
  | 'sortable'
  | 'stripped'
  | 'compact'
  | 'select-actions';

type paginationVariant = 'scroll' | 'page';

type alignment = 'left' | 'right' | 'center';

type infoType = 'text' | 'badge' | 'icon';

interface TableHeader {
  title: string;
  align: alignment;
  width: string;
}

interface PrintedData {
  type: infoType;
  value: BadgeStatus;
  align: alignment;
  category?: string;
  accountName?: string;
  date?: string;
}

export interface TableRowCell {
  id: string;
  info: PrintedData[];
}

export interface TableActionEvent {
  action: string;
  rowId: string;
  selectedItems: TableRowCell[];
}

export interface TableConfig {
  type: tableVariant;
  paginationType: paginationVariant;
  headers: TableHeader[];
  rows: TableRowCell[];
}
