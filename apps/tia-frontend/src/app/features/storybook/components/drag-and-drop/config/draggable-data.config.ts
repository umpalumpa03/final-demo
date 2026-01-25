import {
  BoardConfig,
  DraggableItemType,
  KanbanItem,
  TreeGroupConfig,
  TreeItem,
} from '@tia/shared/lib/drag-n-drop/model/drag.model';

export const items = [
  {
    id: '1',
    title: 'Item 1',
    subtitle: 'drag to reorder',
    icon: 'images/svg/drag-and-drop/card.svg',
  },
  {
    id: '2',
    title: 'Item 2',
    subtitle: 'drag to reorder',
    icon: 'images/svg/drag-and-drop/exchange.svg',
  },
  {
    id: '3',
    title: 'Item 3',
    subtitle: 'drag to reorder',
    icon: 'images/svg/drag-and-drop/folder.svg',
  },
  {
    id: '4',
    title: 'Item 4',
    subtitle: 'drag to reorder',
    icon: 'images/svg/drag-and-drop/dollar.svg',
  },
] as const satisfies readonly DraggableItemType[];

export const boards = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
] as const satisfies readonly BoardConfig[];

export const kanbanItems = [
  { id: '1', title: 'Task 1', subtitle: '', boardId: 'todo', order: 0 },
  { id: '2', title: 'Task 2', subtitle: '', boardId: 'todo', order: 1 },
  { id: '3', title: 'Task 3', subtitle: '', boardId: 'todo', order: 2 },
  { id: '4', title: 'Task 4', subtitle: '', boardId: 'in-progress', order: 0 },
  { id: '5', title: 'Task 5', subtitle: '', boardId: 'in-progress', order: 1 },
  { id: '6', title: 'Task 6', subtitle: '', boardId: 'done', order: 0 },
] as const satisfies readonly KanbanItem[];

export const treeGroups = [
  { id: 'g1', title: 'Group 1', subtitle: 'First group', expanded: true },
  { id: 'g2', title: 'Group 2', subtitle: 'Second group', expanded: true },
  { id: 'g3', title: 'Group 3', subtitle: 'Third group', expanded: false },
] as const satisfies readonly TreeGroupConfig[];

export const treeItems = [
  {
    id: 'c1',
    title: 'Child 1',
    subtitle: 'Drag to reorder',
    groupId: 'g1',
    order: 0,
  },
  {
    id: 'c2',
    title: 'Child 2',
    subtitle: 'Drag to reorder',
    groupId: 'g1',
    order: 1,
  },
  {
    id: 'c3',
    title: 'Child 3',
    subtitle: 'Drag to reorder',
    groupId: 'g1',
    order: 2,
  },
  {
    id: 'c4',
    title: 'Child 4',
    subtitle: 'Drag to reorder',
    groupId: 'g2',
    order: 0,
  },
  {
    id: 'c5',
    title: 'Child 5',
    subtitle: 'Drag to reorder',
    groupId: 'g2',
    order: 1,
  },
  {
    id: 'c6',
    title: 'Child 6',
    subtitle: 'Drag to reorder',
    groupId: 'g3',
    order: 0,
  },
] as const satisfies readonly TreeItem[];
