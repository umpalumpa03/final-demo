import { TranslateService } from '@ngx-translate/core';
import { TableConfig } from '@tia/shared/lib/tables/models/table.model';

const BASE_KEY = 'storybook.tables.sections';

export const basicTable = (translate: TranslateService): TableConfig => ({
  type: 'basic',
  paginationType: 'page',
  itemsPerPage: 3,
  totalPage: 2,
  headers: [
    {
      title: translate.instant(`${BASE_KEY}.basic.headers.Invoice`),
      align: 'left',
      width: '10%',
    },
    {
      title: translate.instant(`${BASE_KEY}.basic.headers.status`),
      align: 'left',
      width: '26%',
    },
    {
      title: translate.instant(`${BASE_KEY}.basic.headers.Method`),
      align: 'left',
      width: '38%',
    },
    {
      title: translate.instant(`${BASE_KEY}.basic.headers.Amount`),
      align: 'right',
      width: '26%',
    },
  ],
  rows: [
    {
      id: '1',
      info: [
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.basic.rows.0.Invoice`),
          align: 'left',
        },
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.basic.rows.0.status`),
          align: 'left',
        },
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.basic.rows.0.Method`),
          align: 'left',
        },
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.basic.rows.0.Amount`),
          align: 'right',
        },
      ],
    },
    {
      id: '2',
      info: [
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.basic.rows.1.Invoice`),
          align: 'left',
        },
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.basic.rows.1.status`),
          align: 'left',
        },
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.basic.rows.1.Method`),
          align: 'left',
        },
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.basic.rows.1.Amount`),
          align: 'right',
        },
      ],
    },
    {
      id: '3',
      info: [
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.basic.rows.2.Invoice`),
          align: 'left',
        },
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.basic.rows.2.status`),
          align: 'left',
        },
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.basic.rows.2.Method`),
          align: 'left',
        },
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.basic.rows.2.Amount`),
          align: 'right',
        },
      ],
    },
  ],
});

// export const rowTable: TableConfig = {
//   type: 'row-selection',
//   paginationType: 'scroll',
//   itemsPerPage: 5,
//   headers: [
//     { title: 'Name', align: 'left', width: '27%' },
//     { title: 'Email', align: 'left', width: '38%' },
//     { title: 'Role', align: 'left', width: '14%' },
//     { title: 'Status', align: 'left', width: '21%' },
//   ],
//   rows: [
//     {
//       id: '1',
//       info: [
//         { type: 'text', value: 'John Doe', align: 'left' },
//         { type: 'text', value: 'john@example.com', align: 'left' },
//         { type: 'text', value: 'Admin', align: 'left' },
//         { type: 'status', value: 'active', category: 'salary', align: 'left' },
//       ],
//     },
//     {
//       id: '2',
//       info: [
//         { type: 'text', value: 'Jane Smith', align: 'left' },
//         { type: 'text', value: 'jane@example.com', align: 'left' },
//         { type: 'text', value: 'User', align: 'left' },
//         { type: 'status', value: 'active', align: 'left' },
//       ],
//     },
//     {
//       id: '3',
//       info: [
//         { type: 'text', value: 'Bob Johnson', align: 'left' },
//         { type: 'text', value: 'bob@example.com', align: 'left' },
//         { type: 'text', value: 'Editor', align: 'left' },
//         { type: 'status', value: 'pending', align: 'left' },
//       ],
//     },
//     {
//       id: '4',
//       info: [
//         { type: 'text', value: 'Alice Brown', align: 'left' },
//         { type: 'text', value: 'alice@example.com', align: 'left' },
//         { type: 'text', value: 'User', align: 'left' },
//         { type: 'status', value: 'inactive', align: 'left' },
//       ],
//     },
//     {
//       id: '5',
//       info: [
//         { type: 'text', value: 'Charlie Wilson', align: 'left' },
//         { type: 'text', value: 'charlie@example.com', align: 'left' },
//         { type: 'text', value: 'Admin', align: 'left' },
//         { type: 'status', value: 'active', align: 'left' },
//       ],
//     },
//   ],
// } as const;

// export const actionsTable: TableConfig = {
//   type: 'actions',
//   paginationType: 'scroll',
//   itemsPerPage: 5,
//   headers: [
//     { title: 'Name', align: 'left', width: '20%' },
//     { title: 'Email', align: 'left', width: '28%' },
//     { title: 'Role', align: 'left', width: '11%' },
//     { title: 'Status', align: 'left', width: '15%' },
//     { title: 'Actions', align: 'right', width: '26%' },
//   ],
//   rows: [
//     {
//       id: '1',
//       info: [
//         { type: 'text', value: 'John Doe', align: 'left' },
//         { type: 'text', value: 'john@example.com', align: 'left' },
//         { type: 'text', value: 'Admin', align: 'left' },
//         { type: 'status', value: 'active', align: 'left' },
//       ],
//     },
//     {
//       id: '2',
//       info: [
//         { type: 'text', value: 'Jane Smith', align: 'left' },
//         { type: 'text', value: 'jane@example.com', align: 'left' },
//         { type: 'text', value: 'User', align: 'left' },
//         { type: 'status', value: 'active', align: 'left' },
//       ],
//     },
//     {
//       id: '3',
//       info: [
//         { type: 'text', value: 'Bob Johnson', align: 'left' },
//         { type: 'text', value: 'bob@example.com', align: 'left' },
//         { type: 'text', value: 'Editor', align: 'left' },
//         { type: 'status', value: 'pending', align: 'left' },
//       ],
//     },
//     {
//       id: '4',
//       info: [
//         { type: 'text', value: 'Alice Brown', align: 'left' },
//         { type: 'text', value: 'alice@example.com', align: 'left' },
//         { type: 'text', value: 'User', align: 'left' },
//         { type: 'status', value: 'inactive', align: 'left' },
//       ],
//     },
//     {
//       id: '5',
//       info: [
//         { type: 'text', value: 'Charlie Wilson', align: 'left' },
//         { type: 'text', value: 'charlie@example.com', align: 'left' },
//         { type: 'text', value: 'Admin', align: 'left' },
//         { type: 'status', value: 'active', align: 'left' },
//       ],
//     },
//   ],
// } as const;

// export const sortableTable: TableConfig = {
//   type: 'basic',
//   paginationType: 'scroll',
//   itemsPerPage: 5,
//   headers: [
//     { title: 'Name', sortable: true, align: 'left', width: '25%' },
//     { title: 'Email', align: 'left', width: '36%' },
//     { title: 'Role', sortable: true, align: 'left', width: '21%' },
//     { title: 'Status', align: 'left', width: '18%' },
//   ],
//   rows: [
//     {
//       id: '1',
//       info: [
//         { type: 'text', value: 'John Doe', align: 'left' },
//         { type: 'text', value: 'john@example.com', align: 'left' },
//         { type: 'text', value: 'Admin', align: 'left' },
//         { type: 'status', value: 'active', align: 'left' },
//       ],
//     },
//     {
//       id: '2',
//       info: [
//         { type: 'text', value: 'Jane Smith', align: 'left' },
//         { type: 'text', value: 'jane@example.com', align: 'left' },
//         { type: 'text', value: 'User', align: 'left' },
//         { type: 'status', value: 'active', align: 'left' },
//       ],
//     },
//     {
//       id: '3',
//       info: [
//         { type: 'text', value: 'Bob Johnson', align: 'left' },
//         { type: 'text', value: 'bob@example.com', align: 'left' },
//         { type: 'text', value: 'Editor', align: 'left' },
//         { type: 'status', value: 'pending', align: 'left' },
//       ],
//     },
//     {
//       id: '4',
//       info: [
//         { type: 'text', value: 'Alice Brown', align: 'left' },
//         { type: 'text', value: 'alice@example.com', align: 'left' },
//         { type: 'text', value: 'User', align: 'left' },
//         { type: 'status', value: 'inactive', align: 'left' },
//       ],
//     },
//     {
//       id: '5',
//       info: [
//         { type: 'text', value: 'Charlie Wilson', align: 'left' },
//         { type: 'text', value: 'charlie@example.com', align: 'left' },
//         { type: 'text', value: 'Admin', align: 'left' },
//         { type: 'status', value: 'active', align: 'left' },
//       ],
//     },
//   ],
// } as const;

// export const strippedTable: TableConfig = {
//   type: 'striped',
//   paginationType: 'scroll',
//   itemsPerPage: 5,
//   headers: [
//     { title: 'Product', align: 'left', width: '39%' },
//     { title: 'Category', align: 'left', width: '22%' },
//     { title: 'Price', align: 'left', width: '14%' },
//     { title: 'Stock', align: 'left', width: '25%' },
//   ],
//   rows: [
//     {
//       id: '1',
//       info: [
//         { type: 'text', value: 'Wireless Mouse', align: 'left' },
//         { type: 'text', value: 'Electronics', align: 'left' },
//         { type: 'text', value: '$29.99', align: 'left' },
//         { type: 'text', value: 'In Stock', align: 'left' },
//       ],
//     },
//     {
//       id: '2',
//       info: [
//         { type: 'text', value: 'Mechanical Keyboard', align: 'left' },
//         { type: 'text', value: 'Electronics', align: 'left' },
//         { type: 'text', value: '$89.99', align: 'left' },
//         { type: 'text', value: 'In Stock', align: 'left' },
//       ],
//     },
//     {
//       id: '3',
//       info: [
//         { type: 'text', value: 'USB-C Cable', align: 'left' },
//         { type: 'text', value: 'Accessories', align: 'left' },
//         { type: 'text', value: '$12.99', align: 'left' },
//         { type: 'text', value: 'Low Stock', align: 'left' },
//       ],
//     },
//     {
//       id: '4',
//       info: [
//         { type: 'text', value: 'Monitor Stand', align: 'left' },
//         { type: 'text', value: 'Accessories', align: 'left' },
//         { type: 'text', value: '$49.99', align: 'left' },
//         { type: 'text', value: 'Out of Stock', align: 'left' },
//       ],
//     },
//     {
//       id: '5',
//       info: [
//         { type: 'text', value: 'Desk Lamp', align: 'left' },
//         { type: 'text', value: 'Furniture', align: 'left' },
//         { type: 'text', value: '$39.99', align: 'left' },
//         { type: 'text', value: 'In Stock', align: 'left' },
//       ],
//     },
//   ],
// } as const;

// export const compactTable: TableConfig = {
//   type: 'compact',
//   itemsPerPage: 3,
//   headers: [
//     { title: 'ID', align: 'left', width: '12%' },
//     { title: 'Task', align: 'left', width: '40%' },
//     { title: 'Assignee', align: 'left', width: '24%' },
//     { title: 'Status', align: 'left', width: '24%' },
//   ],
//   rows: [
//     {
//       id: '1',
//       info: [
//         { type: 'text', value: 'Update documentation', align: 'left' },
//         { type: 'text', value: 'John Doe', align: 'left' },
//         { type: 'status', align: 'left', value: 'done' },
//       ],
//     },
//     {
//       id: '2',
//       info: [
//         { type: 'text', value: 'Fix bug in login', align: 'left' },
//         { type: 'text', value: 'Jane Smith', align: 'left' },
//         { type: 'status', align: 'left', value: 'in-progress' },
//       ],
//     },
//     {
//       id: '3',
//       info: [
//         { type: 'text', value: 'Design new feature', align: 'left' },
//         { type: 'text', value: 'Bob Johnson', align: 'left' },
//         { type: 'status', align: 'left', value: 'todo' },
//       ],
//     },
//   ],
// } as const;

// export const rowStates: TableConfig = {
//   type: 'basic',
//   itemsPerPage: 5,
//   headers: [
//     { title: 'Name', align: 'left', width: '28%' },
//     { title: 'Description', align: 'left', width: '47%' },
//     { title: 'State', align: 'left', width: '25%' },
//   ],
//   rows: [
//     {
//       id: '1',
//       info: [
//         { type: 'text', value: 'Default Row', align: 'left' },
//         { type: 'text', value: 'Normal table row', align: 'left' },
//         {
//           type: 'state',
//           value: 'Default',
//           align: 'left',
//           variant: 'secondary',
//         },
//       ],
//       disabled: false,
//       selected: false,
//       highlighted: false,
//     },
//     {
//       id: '2',
//       info: [
//         { type: 'text', value: 'Selected Row', align: 'left' },
//         { type: 'text', value: 'Row with selection highlight', align: 'left' },
//         { type: 'state', value: 'Selected', align: 'left', variant: 'default' },
//       ],
//       selected: true,
//     },
//     {
//       id: '3',
//       info: [
//         { type: 'text', value: 'Hover Row', align: 'left' },
//         { type: 'text', value: 'Hover over this row', align: 'left' },
//         {
//           type: 'state',
//           value: 'Hover',
//           align: 'left',
//           hover: true,
//           variant: 'outline',
//         },
//       ],
//     },
//     {
//       id: '4',
//       info: [
//         { type: 'text', value: 'Disabled Row', align: 'left' },
//         { type: 'text', value: 'Row in disabled state', align: 'left' },
//         {
//           type: 'state',
//           value: 'Disabled',
//           align: 'left',
//           disabled: true,
//         },
//       ],
//       disabled: true,
//     },
//   ],
// } as const;

// export const transactionsTable: TableConfig = {
//   type: 'transactions',
//   itemsPerPage: 2,
//   headers: [
//     { title: 'Details', align: 'left', width: '47%' },
//     { title: 'Amount', align: 'right', width: '22%' },
//     { title: 'Actions', align: 'right', width: '28%' },
//   ],
//   rows: [
//     {
//       id: '1',
//       transactionType: 'credit',
//       hasMeta: true,
//       info: [
//         {
//           type: 'text',
//           value: 'Salary Payment',
//           category: 'Salary',
//           accountName: 'Main Account',
//           date: '2026-01-14T00:00:00Z',
//           align: 'left',
//         },
//         {
//           type: 'money',
//           value: '5000',
//           align: 'right',
//           currency: 'USD',
//         },
//       ],
//     },
//     {
//       id: '2',
//       transactionType: 'debit',
//       hasMeta: false,
//       info: [
//         {
//           type: 'text',
//           value:
//             'Grocery Shopping Grocery Shopping Grocery Shopping Grocery Shopping',
//           category: 'Shopping',
//           accountName: 'Main Account',
//           date: '2026-01-13T00:00:00Z',
//           align: 'left',
//         },
//         {
//           type: 'money',
//           value: '5000',
//           align: 'right',
//           currency: 'EUR',
//         },
//       ],
//     },
//     {
//       id: '3',
//       transactionType: 'credit',
//       hasMeta: true,
//       info: [
//         {
//           type: 'text',
//           value: 'Electricity Bill',
//           category: 'Utilities',
//           accountName: 'Main Account',
//           date: '2026-01-12T00:00:00Z',
//           align: 'left',
//         },
//         {
//           type: 'money',
//           value: '5000',
//           align: 'right',
//           currency: 'USD',
//         },
//       ],
//     },
//     {
//       id: '4',
//       transactionType: 'credit',
//       hasMeta: true,
//       info: [
//         {
//           type: 'text',
//           value: 'Freelance Project',
//           category: 'Freelance',
//           accountName: 'Business Account',
//           date: '2026-01-11T00:00:00Z',
//           align: 'left',
//         },
//         {
//           type: 'money',
//           value: '5000',
//           align: 'right',
//         },
//       ],
//     },
//   ],
// } as const;

// export const rowsForPagination: TableConfig['rows'] = [
//   {
//     id: '4',
//     info: [
//       { type: 'text', value: 'INV004', align: 'left' },
//       { type: 'text', value: 'Paid', align: 'left' },
//       { type: 'text', value: 'Credit Card', align: 'left' },
//       { type: 'text', value: '$1000.00', align: 'right' },
//     ],
//   },
//   {
//     id: '5',
//     info: [
//       { type: 'text', value: 'INV005', align: 'left' },
//       { type: 'text', value: 'Unpaid', align: 'left' },
//       { type: 'text', value: 'PayPal', align: 'left' },
//       { type: 'text', value: '$50.00', align: 'right' },
//     ],
//   },
//   {
//     id: '6',
//     info: [
//       { type: 'text', value: 'INV006', align: 'left' },
//       { type: 'text', value: 'Unpaid', align: 'left' },
//       { type: 'text', value: 'Bank Transfer', align: 'left' },
//       { type: 'text', value: '$333.00', align: 'right' },
//     ],
//   },
// ];

export const rowTable = (translate: TranslateService): TableConfig => ({
  type: 'row-selection',
  paginationType: 'scroll',
  itemsPerPage: 5,
  headers: [
    {
      title: translate.instant(`${BASE_KEY}.selection.headers.name`),
      align: 'left',
      width: '27%',
    },
    {
      title: translate.instant(`${BASE_KEY}.selection.headers.email`),
      align: 'left',
      width: '38%',
    },
    {
      title: translate.instant(`${BASE_KEY}.selection.headers.role`),
      align: 'left',
      width: '14%',
    },
    {
      title: translate.instant(`${BASE_KEY}.selection.headers.status`),
      align: 'left',
      width: '21%',
    },
  ],
  rows: [0, 1, 2, 3, 4].map((i) => ({
    id: (i + 1).toString(),
    info: [
      {
        type: 'text',
        value: translate.instant(`${BASE_KEY}.selection.rows.${i}.name`),
        align: 'left',
      },
      {
        type: 'text',
        value: translate.instant(`${BASE_KEY}.selection.rows.${i}.email`),
        align: 'left',
      },
      {
        type: 'text',
        value: translate.instant(`${BASE_KEY}.selection.rows.${i}.role`),
        align: 'left',
      },
      {
        type: 'status',
        value: translate
          .instant(`${BASE_KEY}.selection.rows.${i}.status`)
          .toLowerCase(),
        align: 'left',
      },
    ],
  })),
});

export const actionsTable = (translate: TranslateService): TableConfig => ({
  type: 'actions',
  paginationType: 'scroll',
  itemsPerPage: 5,
  headers: [
    {
      title: translate.instant(`${BASE_KEY}.actions.headers.name`),
      align: 'left',
      width: '20%',
    },
    {
      title: translate.instant(`${BASE_KEY}.actions.headers.email`),
      align: 'left',
      width: '28%',
    },
    {
      title: translate.instant(`${BASE_KEY}.actions.headers.role`),
      align: 'left',
      width: '11%',
    },
    {
      title: translate.instant(`${BASE_KEY}.actions.headers.status`),
      align: 'left',
      width: '15%',
    },
    {
      title: translate.instant(`${BASE_KEY}.actions.headers.actions`),
      align: 'right',
      width: '26%',
    },
  ],
  rows: [0, 1, 2, 3, 4].map((i) => ({
    id: (i + 1).toString(),
    info: [
      {
        type: 'text',
        value: translate.instant(`${BASE_KEY}.actions.rows.${i}.name`),
        align: 'left',
      },
      {
        type: 'text',
        value: translate.instant(`${BASE_KEY}.actions.rows.${i}.email`),
        align: 'left',
      },
      {
        type: 'text',
        value: translate.instant(`${BASE_KEY}.actions.rows.${i}.role`),
        align: 'left',
      },
      {
        type: 'status',
        value: 'active',
        align: 'left',
      },
    ],
  })),
});

export const sortableTable = (translate: TranslateService): TableConfig => ({
  type: 'basic',
  paginationType: 'scroll',
  itemsPerPage: 5,
  headers: [
    {
      title: translate.instant(`${BASE_KEY}.sortable.headers.name`),
      sortable: true,
      align: 'left',
      width: '25%',
    },
    {
      title: translate.instant(`${BASE_KEY}.sortable.headers.email`),
      align: 'left',
      width: '36%',
    },
    {
      title: translate.instant(`${BASE_KEY}.sortable.headers.role`),
      sortable: true,
      align: 'left',
      width: '21%',
    },
    {
      title: translate.instant(`${BASE_KEY}.sortable.headers.status`),
      align: 'left',
      width: '18%',
    },
  ],
  rows: [0, 1, 2, 3, 4].map((i) => ({
    id: (i + 1).toString(),
    info: [
      {
        type: 'text',
        value: translate.instant(`${BASE_KEY}.sortable.rows.${i}.name`),
        align: 'left',
      },
      {
        type: 'text',
        value: translate.instant(`${BASE_KEY}.sortable.rows.${i}.email`),
        align: 'left',
      },
      {
        type: 'text',
        value: translate.instant(`${BASE_KEY}.sortable.rows.${i}.role`),
        align: 'left',
      },
      {
        type: 'status',
        value: translate
          .instant(`${BASE_KEY}.sortable.rows.${i}.status`)
          .toLowerCase(),
        align: 'left',
      },
    ],
  })),
});

export const strippedTable = (translate: TranslateService): TableConfig => ({
  type: 'striped',
  paginationType: 'scroll',
  itemsPerPage: 5,
  headers: [
    {
      title: translate.instant(`${BASE_KEY}.striped.headers.product`),
      align: 'left',
      width: '39%',
    },
    {
      title: translate.instant(`${BASE_KEY}.striped.headers.category`),
      align: 'left',
      width: '22%',
    },
    {
      title: translate.instant(`${BASE_KEY}.striped.headers.price`),
      align: 'left',
      width: '14%',
    },
    {
      title: translate.instant(`${BASE_KEY}.striped.headers.stock`),
      align: 'left',
      width: '25%',
    },
  ],
  rows: [0, 1, 2, 3, 4].map((i) => ({
    id: (i + 1).toString(),
    info: [
      {
        type: 'text',
        value: translate.instant(`${BASE_KEY}.striped.rows.${i}.product`),
        align: 'left',
      },
      {
        type: 'text',
        value: translate.instant(`${BASE_KEY}.striped.rows.${i}.category`),
        align: 'left',
      },
      {
        type: 'text',
        value: translate.instant(`${BASE_KEY}.striped.rows.${i}.price`),
        align: 'left',
      },
      {
        type: 'text',
        value: translate.instant(`${BASE_KEY}.striped.rows.${i}.stock`),
        align: 'left',
      },
    ],
  })),
});

export const compactTable = (translate: TranslateService): TableConfig => ({
  type: 'compact',
  itemsPerPage: 3,
  headers: [
    {
      title: translate.instant(`${BASE_KEY}.compact.headers.id`),
      align: 'left',
      width: '12%',
    },
    {
      title: translate.instant(`${BASE_KEY}.compact.headers.task`),
      align: 'left',
      width: '40%',
    },
    {
      title: translate.instant(`${BASE_KEY}.compact.headers.assignee`),
      align: 'left',
      width: '24%',
    },
    {
      title: translate.instant(`${BASE_KEY}.compact.headers.status`),
      align: 'left',
      width: '24%',
    },
  ],
  rows: [0, 1, 2].map((i) => ({
    id: (i + 1).toString(),
    info: [
      {
        type: 'text',
        value: translate.instant(`${BASE_KEY}.compact.rows.${i}.task`),
        align: 'left',
      },
      {
        type: 'text',
        value: translate.instant(`${BASE_KEY}.compact.rows.${i}.assignee`),
        align: 'left',
      },
      {
        type: 'status',
        align: 'left',
        value: translate
          .instant(`${BASE_KEY}.compact.rows.${i}.status`)
          .toLowerCase()
          .replace(' ', '-'),
      },
    ],
  })),
});

export const rowStates = (translate: TranslateService): TableConfig => ({
  type: 'basic',
  itemsPerPage: 5,
  headers: [
    {
      title: translate.instant(`${BASE_KEY}.states.headers.name`),
      align: 'left',
      width: '28%',
    },
    {
      title: translate.instant(`${BASE_KEY}.states.headers.description`),
      align: 'left',
      width: '47%',
    },
    {
      title: translate.instant(`${BASE_KEY}.states.headers.state`),
      align: 'left',
      width: '25%',
    },
  ],
  rows: [
    {
      id: '1',
      info: [
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.states.rows.0.name`),
          align: 'left',
        },
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.states.rows.0.description`),
          align: 'left',
        },
        {
          type: 'state',
          value: translate.instant(`${BASE_KEY}.states.rows.0.state`),
          align: 'left',
          variant: 'secondary',
        },
      ],
    },
    {
      id: '2',
      selected: true,
      info: [
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.states.rows.1.name`),
          align: 'left',
        },
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.states.rows.1.description`),
          align: 'left',
        },
        {
          type: 'state',
          value: translate.instant(`${BASE_KEY}.states.rows.1.state`),
          align: 'left',
          variant: 'default',
        },
      ],
    },
    {
      id: '3',
      info: [
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.states.rows.2.name`),
          align: 'left',
        },
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.states.rows.2.description`),
          align: 'left',
        },
        {
          type: 'state',
          value: translate.instant(`${BASE_KEY}.states.rows.2.state`),
          align: 'left',
          variant: 'outline',
          hover: true,
        },
      ],
    },
    {
      id: '4',
      disabled: true,
      info: [
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.states.rows.3.name`),
          align: 'left',
        },
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.states.rows.3.description`),
          align: 'left',
        },
        {
          type: 'state',
          value: translate.instant(`${BASE_KEY}.states.rows.3.state`),
          align: 'left',
          disabled: true,
        },
      ],
    },
  ],
});

// "type": "Type",
//           "details": "Details",
//           "date": "Date",
//           "amount": "Amount"

export const transactionsTable = (
  translate: TranslateService,
): TableConfig => ({
  type: 'transactions',
  itemsPerPage: 2,
  headers: [
    {
      title: translate.instant(`${BASE_KEY}.transactions.headers.details`),
      align: 'left',
      width: '47%',
    },
    {
      title: translate.instant(`${BASE_KEY}.transactions.headers.amount`),
      align: 'right',
      width: '22%',
    },
    {
      title: translate.instant(`${BASE_KEY}.transactions.headers.actions`),
      align: 'right',
      width: '22%',
    },
  ],
  rows: [
    {
      id: '1',
      transactionType: 'credit',
      hasMeta: true,
      info: [
        {
          type: 'text',
          value: translate.instant(`${BASE_KEY}.transactions.rows.0.details`),
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
          value: translate.instant(`${BASE_KEY}.transactions.rows.1.details`),
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
          value: translate.instant(`${BASE_KEY}.transactions.rows.2.details`),
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
          value: translate.instant(`${BASE_KEY}.transactions.rows.3.details`),
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
});

export const rowsForPagination = (
  translate: TranslateService,
): TableConfig['rows'] => [
  {
    id: '4',
    info: [
      { type: 'text', value: 'INV004', align: 'left' },
      { type: 'text', value: 'Paid', align: 'left' },
      { type: 'text', value: 'Credit Card', align: 'left' },
      { type: 'text', value: '$1000.00', align: 'right' },
    ],
  },
  // Add more as needed, potentially from a JSON section if you have one for pagination
];
