import {
  BoardConfig,
  DraggableItemType,
  KanbanItem,
  TreeGroupConfig,
  TreeItem,
} from '@tia/shared/lib/drag-n-drop/model/drag.model';
import { TranslateService } from '@ngx-translate/core';

export const items = (translate: TranslateService) =>
  [
    {
      id: '1',
      title: `${translate.instant('storybook.drag-and-drop.sections.draggableCards.item')} 1`,
      subtitle: translate.instant(
        'storybook.drag-and-drop.sections.draggableCards.dragToReorder',
      ),
      icon: 'images/svg/drag-and-drop/card.svg',
    },
    {
      id: '2',
      title: `${translate.instant('storybook.drag-and-drop.sections.draggableCards.item')} 2`,
      subtitle: translate.instant(
        'storybook.drag-and-drop.sections.draggableCards.dragToReorder',
      ),
      icon: 'images/svg/drag-and-drop/exchange.svg',
    },
    {
      id: '3',
      title: `${translate.instant('storybook.drag-and-drop.sections.draggableCards.item')} 3`,
      subtitle: translate.instant(
        'storybook.drag-and-drop.sections.draggableCards.dragToReorder',
      ),
      icon: 'images/svg/drag-and-drop/folder.svg',
    },
    {
      id: '4',
      title: `${translate.instant('storybook.drag-and-drop.sections.draggableCards.item')} 4`,
      subtitle: translate.instant(
        'storybook.drag-and-drop.sections.draggableCards.dragToReorder',
      ),
      icon: 'images/svg/drag-and-drop/dollar.svg',
    },
  ] as const satisfies readonly DraggableItemType[];

export const boards = (translate: TranslateService) =>
  [
    {
      id: 'todo',
      title: translate.instant(
        'storybook.drag-and-drop.sections.kanbanBoard.columns.todo',
      ),
    },
    {
      id: 'in-progress',
      title: translate.instant(
        'storybook.drag-and-drop.sections.kanbanBoard.columns.inProgress',
      ),
    },
    {
      id: 'done',
      title: translate.instant(
        'storybook.drag-and-drop.sections.kanbanBoard.columns.done',
      ),
    },
  ] as const satisfies readonly BoardConfig[];

export const kanbanItems = (translate: TranslateService) =>
  [
    {
      id: '1',
      title: `${translate.instant('storybook.drag-and-drop.sections.kanbanBoard.task')} 1`,
      subtitle: '',
      boardId: 'todo',
      order: 0,
    },
    {
      id: '2',
      title: `${translate.instant('storybook.drag-and-drop.sections.kanbanBoard.task')} 2`,
      subtitle: '',
      boardId: 'todo',
      order: 1,
    },
    {
      id: '3',
      title: `${translate.instant('storybook.drag-and-drop.sections.kanbanBoard.task')} 3`,
      subtitle: '',
      boardId: 'todo',
      order: 2,
    },
    {
      id: '4',
      title: `${translate.instant('storybook.drag-and-drop.sections.kanbanBoard.task')} 4`,
      subtitle: '',
      boardId: 'in-progress',
      order: 0,
    },
    {
      id: '5',
      title: `${translate.instant('storybook.drag-and-drop.sections.kanbanBoard.task')} 5`,
      subtitle: '',
      boardId: 'in-progress',
      order: 1,
    },
    {
      id: '6',
      title: `${translate.instant('storybook.drag-and-drop.sections.kanbanBoard.task')} 6`,
      subtitle: '',
      boardId: 'done',
      order: 0,
    },
  ] as const satisfies readonly KanbanItem[];

export const treeGroups = (translate: TranslateService) =>
  [
    {
      id: 'g1',
      groupName: `${translate.instant('storybook.drag-and-drop.sections.treeView.group')} 1`,
      subtitle: translate.instant(
        'storybook.drag-and-drop.sections.treeView.groupDescriptions.first',
      ),
      expanded: true,
    },
    {
      id: 'g2',
      groupName: `${translate.instant('storybook.drag-and-drop.sections.treeView.group')} 2`,
      subtitle: translate.instant(
        'storybook.drag-and-drop.sections.treeView.groupDescriptions.second',
      ),
      expanded: true,
    },
    {
      id: 'g3',
      groupName: `${translate.instant('storybook.drag-and-drop.sections.treeView.group')} 3`,
      subtitle: translate.instant(
        'storybook.drag-and-drop.sections.treeView.groupDescriptions.third',
      ),
      expanded: false,
    },
  ] as const satisfies readonly TreeGroupConfig[];

export const treeItems = (translate: TranslateService) =>
  [
    {
      id: 'c1',
      title: `${translate.instant('storybook.drag-and-drop.sections.treeView.child')} 1`,
      subtitle: translate.instant(
        'storybook.drag-and-drop.sections.treeView.dragToReorder',
      ),
      groupId: 'g1',
      order: 0,
    },
    {
      id: 'c2',
      title: `${translate.instant('storybook.drag-and-drop.sections.treeView.child')} 2`,
      subtitle: translate.instant(
        'storybook.drag-and-drop.sections.treeView.dragToReorder',
      ),
      groupId: 'g1',
      order: 1,
    },
    {
      id: 'c3',
      title: `${translate.instant('storybook.drag-and-drop.sections.treeView.child')} 3`,
      subtitle: translate.instant(
        'storybook.drag-and-drop.sections.treeView.dragToReorder',
      ),
      groupId: 'g1',
      order: 2,
    },
    {
      id: 'c4',
      title: `${translate.instant('storybook.drag-and-drop.sections.treeView.child')} 4`,
      subtitle: translate.instant(
        'storybook.drag-and-drop.sections.treeView.dragToReorder',
      ),
      groupId: null,
      order: 0,
    },
    {
      id: 'c5',
      title: `${translate.instant('storybook.drag-and-drop.sections.treeView.child')} 5`,
      subtitle: translate.instant(
        'storybook.drag-and-drop.sections.treeView.dragToReorder',
      ),
      groupId: 'g2',
      order: 1,
    },
    {
      id: 'c6',
      title: `${translate.instant('storybook.drag-and-drop.sections.treeView.child')} 6`,
      subtitle: translate.instant(
        'storybook.drag-and-drop.sections.treeView.dragToReorder',
      ),
      groupId: null,
      order: 0,
    },
  ] as const satisfies readonly TreeItem[];
