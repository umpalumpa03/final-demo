import { TableConfig } from '@tia/shared/lib/tables/models/table.model';

export const basicTable: TableConfig = {
  type: 'basic',
  paginationType: 'scroll',
  headers: [
    { title: 'Invoice', align: 'left', width: '10rem' },
    { title: 'Status', align: 'left', width: '27rem' },
    { title: 'Method', align: 'left', width: '40rem' },
    { title: 'Amount', align: 'right', width: '27rem' },
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
};

export const rowTable: TableConfig = {
  type: 'row-selection',
  paginationType: 'scroll',
  headers: [
    { title: 'Name', align: 'left', width: '27rem' },
    { title: 'Email', align: 'left', width: '38rem' },
    { title: 'Role', align: 'left', width: '14rem' },
    { title: 'Status', align: 'left', width: '20rem' },
  ],
  rows: [
    {
      id: '1',
      info: [
        { type: 'text', value: 'John Doe', align: 'left' },
        { type: 'text', value: 'john@example.com', align: 'left' },
        { type: 'text', value: 'Admin', align: 'left' },
        { type: 'badge', value: 'active', category: 'salary', align: 'left' },
      ],
    },
    {
      id: '2',
      info: [
        { type: 'text', value: 'Jane Smith', align: 'left' },
        { type: 'text', value: 'jane@example.com', align: 'left' },
        { type: 'text', value: 'User', align: 'left' },
        { type: 'badge', value: 'active', align: 'left' },
      ],
    },
    {
      id: '3',
      info: [
        { type: 'text', value: 'Bob Johnson', align: 'left' },
        { type: 'text', value: 'bob@example.com', align: 'left' },
        { type: 'text', value: 'Editor', align: 'left' },
        { type: 'badge', value: 'pending', align: 'left' },
      ],
    },
    {
      id: '4',
      info: [
        { type: 'text', value: 'Alice Brown', align: 'left' },
        { type: 'text', value: 'alice@example.com', align: 'left' },
        { type: 'text', value: 'User', align: 'left' },
        { type: 'badge', value: 'inactive', align: 'left' },
      ],
    },
    {
      id: '5',
      info: [
        { type: 'text', value: 'Charlie Wilson', align: 'left' },
        { type: 'text', value: 'charlie@example.com', align: 'left' },
        { type: 'text', value: 'Admin', align: 'left' },
        { type: 'badge', value: 'active', align: 'left' },
      ],
    },
  ],
};

export const actionsTable: TableConfig = {
  type: 'actions',
  paginationType: 'scroll',
  headers: [
    { title: 'Name', align: 'left', width: '21rem' },
    { title: 'Email', align: 'left', width: '29rem' },
    { title: 'Role', align: 'left', width: '11rem' },
    { title: 'Status', align: 'left', width: '15rem' },
    { title: 'Actions', align: 'right', width: '27rem' },
  ],
  rows: [
    {
      id: '1',
      info: [
        { type: 'text', value: 'John Doe', align: 'left' },
        { type: 'text', value: 'john@example.com', align: 'left' },
        { type: 'text', value: 'Admin', align: 'left' },
        { type: 'badge', value: 'active', align: 'left' },
      ],
    },
    {
      id: '2',
      info: [
        { type: 'text', value: 'Jane Smith', align: 'left' },
        { type: 'text', value: 'jane@example.com', align: 'left' },
        { type: 'text', value: 'User', align: 'left' },
        { type: 'badge', value: 'active', align: 'left' },
      ],
    },
    {
      id: '3',
      info: [
        { type: 'text', value: 'Bob Johnson', align: 'left' },
        { type: 'text', value: 'bob@example.com', align: 'left' },
        { type: 'text', value: 'Editor', align: 'left' },
        { type: 'badge', value: 'pending', align: 'left' },
      ],
    },
    {
      id: '4',
      info: [
        { type: 'text', value: 'Alice Brown', align: 'left' },
        { type: 'text', value: 'alice@example.com', align: 'left' },
        { type: 'text', value: 'User', align: 'left' },
        { type: 'badge', value: 'inactive', align: 'left' },
      ],
    },
    {
      id: '5',
      info: [
        { type: 'text', value: 'Charlie Wilson', align: 'left' },
        { type: 'text', value: 'charlie@example.com', align: 'left' },
        { type: 'text', value: 'Admin', align: 'left' },
        { type: 'badge', value: 'active', align: 'left' },
      ],
    },
  ],
};

export const sortableTable: TableConfig = {
  type: 'basic',
  paginationType: 'scroll',
  headers: [
    { title: 'Name', sortable: true, align: 'left', width: '26rem' },
    { title: 'Email', align: 'left', width: '37rem' },
    { title: 'Role', sortable: true, align: 'left', width: '22rem' },
    { title: 'Status', align: 'left', width: '19rem' },
  ],
  rows: [
    {
      id: '1',
      info: [
        { type: 'text', value: 'John Doe', align: 'left' },
        { type: 'text', value: 'john@example.com', align: 'left' },
        { type: 'text', value: 'Admin', align: 'left' },
        { type: 'badge', value: 'active', align: 'left' },
      ],
    },
    {
      id: '2',
      info: [
        { type: 'text', value: 'Jane Smith', align: 'left' },
        { type: 'text', value: 'jane@example.com', align: 'left' },
        { type: 'text', value: 'User', align: 'left' },
        { type: 'badge', value: 'active', align: 'left' },
      ],
    },
    {
      id: '3',
      info: [
        { type: 'text', value: 'Bob Johnson', align: 'left' },
        { type: 'text', value: 'bob@example.com', align: 'left' },
        { type: 'text', value: 'Editor', align: 'left' },
        { type: 'badge', value: 'pending', align: 'left' },
      ],
    },
    {
      id: '4',
      info: [
        { type: 'text', value: 'Alice Brown', align: 'left' },
        { type: 'text', value: 'alice@example.com', align: 'left' },
        { type: 'text', value: 'User', align: 'left' },
        { type: 'badge', value: 'inactive', align: 'left' },
      ],
    },
    {
      id: '5',
      info: [
        { type: 'text', value: 'Charlie Wilson', align: 'left' },
        { type: 'text', value: 'charlie@example.com', align: 'left' },
        { type: 'text', value: 'Admin', align: 'left' },
        { type: 'badge', value: 'active', align: 'left' },
      ],
    },
  ],
};

export const strippedTable: TableConfig = {
  type: 'striped',
  paginationType: 'scroll',
  headers: [
    { title: 'Product', align: 'left', width: '41rem' },
    { title: 'Category', align: 'left', width: '23rem' },
    { title: 'Price', align: 'left', width: '15rem' },
    { title: 'Stock', align: 'left', width: '25rem' },
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
};
