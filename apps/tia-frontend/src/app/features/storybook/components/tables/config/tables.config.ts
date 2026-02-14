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
];
