---- Overview -----

The app-tables component provides a possibility to render different table styles through a single configuration object. It supports everything from simple data displays to complex transaction tables with inline actions.



---

Table Types ---

The component supports eight distinct table variants, each optimized for specific use cases.

** NOTE **

We Only support paginationType: page --> at this point.

** Basic Table **

The simplest table variant for displaying read-only tabular data.

const basicTable: TableConfig = {
type: 'basic',
paginationType: 'page',
itemPerPage: 3,
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
],
};

** Row Selection Table **

Enables checkbox-based row selection for bulk operations.

For this type you don't need to add anything basic configuration again, but checkboxes will appear
at front

const rowTable: TableConfig = {
type: 'row-selection',
paginationType: 'scroll',
itemPerPage: 5,
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
{ type: 'status', value: 'active', align: 'left' },
],
},
],
};

Features:
Header checkbox for select/deselect all
Individual row checkboxes
Tracks selection state per row

** Actions Table **

Adds CRUD action buttons (view, edit, delete) to each row. again no need to add anything
const actionsTable: TableConfig = {
type: 'actions',
paginationType: 'scroll',
itemPerPage: 5,
headers: [
{ title: 'Name', align: 'left', width: '20%' },
{ title: 'Email', align: 'left', width: '28%' },
{ title: 'Role', align: 'left', width: '11%' },
{ title: 'Status', align: 'left', width: '15%' },
{ title: 'Actions', align: 'right', width: '26%' },
],
rows: [ /* ... */ ],
};
Events emitted:

onCrudClick(action: string, rowId: string) — Triggered when an action icon is clicked

** Sortable Table **

Enables column-based sorting with visual indicators.

const sortableTable: TableConfig = {
type: 'basic',
paginationType: 'scroll',
itemPerPage: 5,
headers: [
{ title: 'Name', sortable: true, align: 'left', width: '25%' },
{ title: 'Email', align: 'left', width: '36%' },
{ title: 'Role', sortable: true, align: 'left', width: '21%' },
{ title: 'Status', align: 'left', width: '18%' },
],
rows: [ /* ... */ ],
};

Note: Add sortable: true to any header definition to enable sorting for that column.

** Striped Table **

Applies alternating row backgrounds for improved readability.
const strippedTable: TableConfig = {
type: 'striped',
paginationType: 'scroll',
itemPerPage: 5,
headers: [ /* ... */ ],
rows: [ /* ... */ ],
};

** Compact Table **

A denser table layout with automatic row ID display, ideal for task lists or logs.
const compactTable: TableConfig = {
type: 'compact',
itemPerPage: 3,
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
],
};

Note: The ID column is auto-generated with

** Row States Table **

Demonstrates row-level visual states for conditional styling.

you don't have to use that I guess it's just for visual representation

const rowStates: TableConfig = {
type: 'basic',
itemPerPage: 5,
headers: [ /* ... */ ],
rows: [
{
id: '1',
info: [ /* ... */ ],
disabled: false,
selected: false,
highlighted: false,
},
{
id: '2',
info: [ /* ... */ ],
selected: true, // Applies selection highlight
},
{
id: '4',
info: [ /* ... */ ],
disabled: true, // Applies disabled styling
},
],
};

** Transactions Table **

Specialized table for financial transaction displays with income/expense indicators and inline actions.

const transactionsTable: TableConfig = {
type: 'transactions',
itemPerPage: 5,
headers: [
{ title: 'Details', align: 'left', width: '47%' },
{ title: 'Amount', align: 'right', width: '25%' },
{ title: 'Actions', align: 'right', width: '28%' },
],
rows: [
{
id: '1',
transactionType: 'credit', // or 'debit'
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
],
};
Features:

Visual income/expense icons based on transactionType
Automatic currency formatting with +/- prefix
Rich detail cells with category tags, account names, and dates
Built-in "Repeat" and "Categorize" action buttons

Date: should be ISO format and all the information you should give is clearly visible in the data I gave you.

** Configuration Reference **

TableConfig -->

type: 'row-selection',
paginationType: 'scroll',
itemPerPage: 5,
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
],

type: is table's type based on it it changes visually.
PaginationType: we only support page for now.
itemsPerPage: You have to specify how many items is visible on the page
headers: Should always be provided in Visual some components do not have it, but You should give it with width: (in percentage)
rows: each Rows had its id, you should provide it from backend and info, which is array of objects to give me data to dispay

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

This interface is the main thing you will look at that row's support, it is pretty intuitive what you have to do, some
combinations must not work together pretty well, so you have to give me correct combinations of them.
