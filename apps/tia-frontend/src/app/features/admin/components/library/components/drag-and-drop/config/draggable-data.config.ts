import {
  BoardConfig,
  DraggableItemType,
  KanbanItem,
} from '@tia/shared/lib/drag-n-drop/model/drag.model';

export const items: DraggableItemType[] = [
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
];
export const boards: BoardConfig[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export const kanbanItems: KanbanItem[] = [
  { id: '1', title: 'Task 1', subtitle: '', boardId: 'todo', order: 0 },
  { id: '2', title: 'Task 2', subtitle: '', boardId: 'todo', order: 1 },
  { id: '3', title: 'Task 3', subtitle: '', boardId: 'todo', order: 2 },
  { id: '4', title: 'Task 4', subtitle: '', boardId: 'in-progress', order: 0 },
  { id: '5', title: 'Task 5', subtitle: '', boardId: 'in-progress', order: 1 },
  { id: '6', title: 'Task 6', subtitle: '', boardId: 'done', order: 0 },
];
