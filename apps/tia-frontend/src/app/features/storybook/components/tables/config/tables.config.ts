import { TableConfig } from '@tia/shared/lib/tables/models/table.model';

export const basicTable: TableConfig = {
  type: 'basic',
  paginationType: 'page',
  itemsPerPage: 3,
  totalPage: 2,
  headers: [
    { title: 'Invoice', align: 'left', width: '10%' },
    { title: 'Status', align: 'left', width: '26%' },
    { title: 'Method', align: 'left', width: '38%' },
    { title: 'Amount', align: 'right', width: '26%' },
  ],
  rows: [
    {
      id: '1',
      info: [
        { type: 'text', value: 'INV001', align: 'left' },
        { type: 'text', value: 'Paid', align: 'left' },
        { type: 'text', value: 'Credit Card', align: 'left' },
        { type: 'text', value: '$250.00', align: 'right' },
      ],
    },
    {
      id: '2',
      info: [
        { type: 'text', value: 'INV002', align: 'left' },
        { type: 'text', value: 'Pending', align: 'left' },
        { type: 'text', value: 'PayPal', align: 'left' },
        { type: 'text', value: '$150.00', align: 'right' },
      ],
    },
    {
      id: '3',
      info: [
        { type: 'text', value: 'INV003', align: 'left' },
        { type: 'text', value: 'Unpaid', align: 'left' },
        { type: 'text', value: 'Bank Transfer', align: 'left' },
        { type: 'text', value: '$350.00', align: 'right' },
      ],
    },
  ],
} as const;

export const rowTable: TableConfig = {
  type: 'row-selection',
  paginationType: 'scroll',
  itemsPerPage: 5,
  headers: [
    { title: 'Name', align: 'left', width: '27%' },
    { title: 'Email', align: 'left', width: '38%' },
    { title: 'Role', align: 'left', width: '14%' },
    { title: 'Status', align: 'left', width: '21%' },
  ],
  rows: [
    {
      id: '1',
      info: [
        { type: 'text', value: 'John Doe', align: 'left' },
        { type: 'text', value: 'john@example.com', align: 'left' },
        { type: 'text', value: 'Admin', align: 'left' },
        { type: 'status', value: 'active', category: 'salary', align: 'left' },
      ],
    },
    {
      id: '2',
      info: [
        { type: 'text', value: 'Jane Smith', align: 'left' },
        { type: 'text', value: 'jane@example.com', align: 'left' },
        { type: 'text', value: 'User', align: 'left' },
        { type: 'status', value: 'active', align: 'left' },
      ],
    },
    {
      id: '3',
      info: [
        { type: 'text', value: 'Bob Johnson', align: 'left' },
        { type: 'text', value: 'bob@example.com', align: 'left' },
        { type: 'text', value: 'Editor', align: 'left' },
        { type: 'status', value: 'pending', align: 'left' },
      ],
    },
    {
      id: '4',
      info: [
        { type: 'text', value: 'Alice Brown', align: 'left' },
        { type: 'text', value: 'alice@example.com', align: 'left' },
        { type: 'text', value: 'User', align: 'left' },
        { type: 'status', value: 'inactive', align: 'left' },
      ],
    },
    {
      id: '5',
      info: [
        { type: 'text', value: 'Charlie Wilson', align: 'left' },
        { type: 'text', value: 'charlie@example.com', align: 'left' },
        { type: 'text', value: 'Admin', align: 'left' },
        { type: 'status', value: 'active', align: 'left' },
      ],
    },
  ],
} as const;

export const actionsTable: TableConfig = {
  type: 'actions',
  paginationType: 'scroll',
  itemsPerPage: 5,
  headers: [
    { title: 'Name', align: 'left', width: '20%' },
    { title: 'Email', align: 'left', width: '28%' },
    { title: 'Role', align: 'left', width: '11%' },
    { title: 'Status', align: 'left', width: '15%' },
    { title: 'Actions', align: 'right', width: '26%' },
  ],
  rows: [
    {
      id: '1',
      info: [
        { type: 'text', value: 'John Doe', align: 'left' },
        { type: 'text', value: 'john@example.com', align: 'left' },
        { type: 'text', value: 'Admin', align: 'left' },
        { type: 'status', value: 'active', align: 'left' },
      ],
    },
    {
      id: '2',
      info: [
        { type: 'text', value: 'Jane Smith', align: 'left' },
        { type: 'text', value: 'jane@example.com', align: 'left' },
        { type: 'text', value: 'User', align: 'left' },
        { type: 'status', value: 'active', align: 'left' },
      ],
    },
    {
      id: '3',
      info: [
        { type: 'text', value: 'Bob Johnson', align: 'left' },
        { type: 'text', value: 'bob@example.com', align: 'left' },
        { type: 'text', value: 'Editor', align: 'left' },
        { type: 'status', value: 'pending', align: 'left' },
      ],
    },
    {
      id: '4',
      info: [
        { type: 'text', value: 'Alice Brown', align: 'left' },
        { type: 'text', value: 'alice@example.com', align: 'left' },
        { type: 'text', value: 'User', align: 'left' },
        { type: 'status', value: 'inactive', align: 'left' },
      ],
    },
    {
      id: '5',
      info: [
        { type: 'text', value: 'Charlie Wilson', align: 'left' },
        { type: 'text', value: 'charlie@example.com', align: 'left' },
        { type: 'text', value: 'Admin', align: 'left' },
        { type: 'status', value: 'active', align: 'left' },
      ],
    },
  ],
} as const;

export const sortableTable: TableConfig = {
  type: 'basic',
  paginationType: 'scroll',
  itemsPerPage: 5,
  headers: [
    { title: 'Name', sortable: true, align: 'left', width: '25%' },
    { title: 'Email', align: 'left', width: '36%' },
    { title: 'Role', sortable: true, align: 'left', width: '21%' },
    { title: 'Status', align: 'left', width: '18%' },
  ],
  rows: [
    {
      id: '1',
      info: [
        { type: 'text', value: 'John Doe', align: 'left' },
        { type: 'text', value: 'john@example.com', align: 'left' },
        { type: 'text', value: 'Admin', align: 'left' },
        { type: 'status', value: 'active', align: 'left' },
      ],
    },
    {
      id: '2',
      info: [
        { type: 'text', value: 'Jane Smith', align: 'left' },
        { type: 'text', value: 'jane@example.com', align: 'left' },
        { type: 'text', value: 'User', align: 'left' },
        { type: 'status', value: 'active', align: 'left' },
      ],
    },
    {
      id: '3',
      info: [
        { type: 'text', value: 'Bob Johnson', align: 'left' },
        { type: 'text', value: 'bob@example.com', align: 'left' },
        { type: 'text', value: 'Editor', align: 'left' },
        { type: 'status', value: 'pending', align: 'left' },
      ],
    },
    {
      id: '4',
      info: [
        { type: 'text', value: 'Alice Brown', align: 'left' },
        { type: 'text', value: 'alice@example.com', align: 'left' },
        { type: 'text', value: 'User', align: 'left' },
        { type: 'status', value: 'inactive', align: 'left' },
      ],
    },
    {
      id: '5',
      info: [
        { type: 'text', value: 'Charlie Wilson', align: 'left' },
        { type: 'text', value: 'charlie@example.com', align: 'left' },
        { type: 'text', value: 'Admin', align: 'left' },
        { type: 'status', value: 'active', align: 'left' },
      ],
    },
  ],
} as const;

export const strippedTable: TableConfig = {
  type: 'striped',
  paginationType: 'scroll',
  itemsPerPage: 5,
  headers: [
    { title: 'Product', align: 'left', width: '39%' },
    { title: 'Category', align: 'left', width: '22%' },
    { title: 'Price', align: 'left', width: '14%' },
    { title: 'Stock', align: 'left', width: '25%' },
  ],
  rows: [
    {
      id: '1',
      info: [
        { type: 'text', value: 'Wireless Mouse', align: 'left' },
        { type: 'text', value: 'Electronics', align: 'left' },
        { type: 'text', value: '$29.99', align: 'left' },
        { type: 'text', value: 'In Stock', align: 'left' },
      ],
    },
    {
      id: '2',
      info: [
        { type: 'text', value: 'Mechanical Keyboard', align: 'left' },
        { type: 'text', value: 'Electronics', align: 'left' },
        { type: 'text', value: '$89.99', align: 'left' },
        { type: 'text', value: 'In Stock', align: 'left' },
      ],
    },
    {
      id: '3',
      info: [
        { type: 'text', value: 'USB-C Cable', align: 'left' },
        { type: 'text', value: 'Accessories', align: 'left' },
        { type: 'text', value: '$12.99', align: 'left' },
        { type: 'text', value: 'Low Stock', align: 'left' },
      ],
    },
    {
      id: '4',
      info: [
        { type: 'text', value: 'Monitor Stand', align: 'left' },
        { type: 'text', value: 'Accessories', align: 'left' },
        { type: 'text', value: '$49.99', align: 'left' },
        { type: 'text', value: 'Out of Stock', align: 'left' },
      ],
    },
    {
      id: '5',
      info: [
        { type: 'text', value: 'Desk Lamp', align: 'left' },
        { type: 'text', value: 'Furniture', align: 'left' },
        { type: 'text', value: '$39.99', align: 'left' },
        { type: 'text', value: 'In Stock', align: 'left' },
      ],
    },
  ],
} as const;

export const compactTable: TableConfig = {
  type: 'compact',
  itemsPerPage: 3,
  headers: [
    { title: 'ID', align: 'left', width: '12%' },
    { title: 'Task', align: 'left', width: '40%' },
    { title: 'Assignee', align: 'left', width: '24%' },
    { title: 'Status', align: 'left', width: '24%' },
  ],
  rows: [
    {
      id: '1',
      info: [
        { type: 'text', value: 'Update documentation', align: 'left' },
        { type: 'text', value: 'John Doe', align: 'left' },
        { type: 'status', align: 'left', value: 'done' },
      ],
    },
    {
      id: '2',
      info: [
        { type: 'text', value: 'Fix bug in login', align: 'left' },
        { type: 'text', value: 'Jane Smith', align: 'left' },
        { type: 'status', align: 'left', value: 'in-progress' },
      ],
    },
    {
      id: '3',
      info: [
        { type: 'text', value: 'Design new feature', align: 'left' },
        { type: 'text', value: 'Bob Johnson', align: 'left' },
        { type: 'status', align: 'left', value: 'todo' },
      ],
    },
  ],
} as const;

export const rowStates: TableConfig = {
  type: 'basic',
  itemsPerPage: 5,
  headers: [
    { title: 'Name', align: 'left', width: '28%' },
    { title: 'Description', align: 'left', width: '47%' },
    { title: 'State', align: 'left', width: '25%' },
  ],
  rows: [
    {
      id: '1',
      info: [
        { type: 'text', value: 'Default Row', align: 'left' },
        { type: 'text', value: 'Normal table row', align: 'left' },
        {
          type: 'state',
          value: 'Default',
          align: 'left',
          variant: 'secondary',
        },
      ],
      disabled: false,
      selected: false,
      highlighted: false,
    },
    {
      id: '2',
      info: [
        { type: 'text', value: 'Selected Row', align: 'left' },
        { type: 'text', value: 'Row with selection highlight', align: 'left' },
        { type: 'state', value: 'Selected', align: 'left', variant: 'default' },
      ],
      selected: true,
    },
    {
      id: '3',
      info: [
        { type: 'text', value: 'Hover Row', align: 'left' },
        { type: 'text', value: 'Hover over this row', align: 'left' },
        {
          type: 'state',
          value: 'Hover',
          align: 'left',
          hover: true,
          variant: 'outline',
        },
      ],
    },
    {
      id: '4',
      info: [
        { type: 'text', value: 'Disabled Row', align: 'left' },
        { type: 'text', value: 'Row in disabled state', align: 'left' },
        {
          type: 'state',
          value: 'Disabled',
          align: 'left',
          disabled: true,
        },
      ],
      disabled: true,
    },
  ],
} as const;

export const transactionsTable: TableConfig = {
  type: 'transactions',
  itemsPerPage: 2,
  headers: [
    { title: 'Details', align: 'left', width: '47%' },
    { title: 'Amount', align: 'right', width: '22%' },
    { title: 'Actions', align: 'right', width: '28%' },
  ],
  rows: [
    {
      id: '1',
      transactionType: 'credit',
      hasMeta: true,
      info: [
        {
          type: 'text',
          value: 'Salary Payment',
          category: 'Salary',
          accountName: 'Main Account',
          date: '2026-01-14T00:00:00Z',
          align: 'left',
        },
        {
          type: 'money',
          value: '5000',
          align: 'right',
          currency: 'USD',
        },
      ],
    },
    {
      id: '2',
      transactionType: 'debit',
      hasMeta: false,
      info: [
        {
          type: 'text',
          value:
            'Grocery Shopping Grocery Shopping Grocery Shopping Grocery Shopping',
          category: 'Shopping',
          accountName: 'Main Account',
          date: '2026-01-13T00:00:00Z',
          align: 'left',
        },
        {
          type: 'money',
          value: '5000',
          align: 'right',
          currency: 'EUR',
        },
      ],
    },
    {
      id: '3',
      transactionType: 'credit',
      hasMeta: true,
      info: [
        {
          type: 'text',
          value: 'Electricity Bill',
          category: 'Utilities',
          accountName: 'Main Account',
          date: '2026-01-12T00:00:00Z',
          align: 'left',
        },
        {
          type: 'money',
          value: '5000',
          align: 'right',
          currency: 'USD',
        },
      ],
    },
    {
      id: '4',
      transactionType: 'credit',
      hasMeta: true,
      info: [
        {
          type: 'text',
          value: 'Freelance Project',
          category: 'Freelance',
          accountName: 'Business Account',
          date: '2026-01-11T00:00:00Z',
          align: 'left',
        },
        {
          type: 'money',
          value: '5000',
          align: 'right',
        },
      ],
    },
  ],
} as const;

export const rowsForPagination: TableConfig['rows'] = [
  {
    id: '4',
    info: [
      { type: 'text', value: 'INV004', align: 'left' },
      { type: 'text', value: 'Paid', align: 'left' },
      { type: 'text', value: 'Credit Card', align: 'left' },
      { type: 'text', value: '$1000.00', align: 'right' },
    ],
  },
  {
    id: '5',
    info: [
      { type: 'text', value: 'INV005', align: 'left' },
      { type: 'text', value: 'Unpaid', align: 'left' },
      { type: 'text', value: 'PayPal', align: 'left' },
      { type: 'text', value: '$50.00', align: 'right' },
    ],
  },
  {
    id: '6',
    info: [
      { type: 'text', value: 'INV006', align: 'left' },
      { type: 'text', value: 'Unpaid', align: 'left' },
      { type: 'text', value: 'Bank Transfer', align: 'left' },
      { type: 'text', value: '$333.00', align: 'right' },
    ],
  },
];
