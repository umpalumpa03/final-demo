type tableVariant =
  | 'basic'
  | 'row-selection'
  | 'actions'
  | 'sortable'
  | 'stripped'
  | 'compact';

type paginationVariant = 'scroll' | 'page';

interface TableHeader {
  title: string;
  align: 'left' | 'right' | 'center';
  width: string;
}

interface TableRowCell {
  type: string;
  value: string;
  align: 'left' | 'right' | 'center';
}

export interface TableConfig {
  type: tableVariant;
  paginationType: paginationVariant;
  headers: TableHeader[];
  rows: TableRowCell[][];
}
