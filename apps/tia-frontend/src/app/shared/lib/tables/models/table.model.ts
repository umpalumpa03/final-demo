import { BadgeStatus } from '../../primitives/badges/models/badges.models';
type tableVariant =
  | 'basic'
  | 'row-selection'
  | 'actions'
  | 'striped'
  | 'compact'
  | 'select-actions'
  | 'transactions';

type paginationVariant = 'scroll' | 'page';

type alignment = 'left' | 'right' | 'center';

type infoType = 'text' | 'status' | 'icon' | 'state' | 'money';

interface TableHeader {
  title: string;
  align: alignment;
  width: string;
  sortable?: boolean;
}

export interface PrintedData {
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
  currency?: string;
}

export interface TableRowCell {
  id: string;
  disabled?: boolean;
  selected?: boolean;
  highlighted?: boolean;
  transactionType?: string;
  info?: PrintedData[];
}

export interface TableActionEvent {
  action: string;
  rowId: string;
  selectedItems: TableRowCell[];
}

export interface TableConfig {
  type: tableVariant;
  paginationType?: paginationVariant;
  itemsPerPage: number;
  totalPage?: number;
  headers: TableHeader[];
  rows: TableRowCell[];
}

export type TransactionAction = 'repeat' | 'categorize';

export interface  TransactionActionEvent {
  action: TransactionAction;
  rowId: string;
  rowData?: PrintedData[];
}
