import { TestBed } from '@angular/core/testing';
import { KanbanService } from './kanban.service';
import { KanbanItem, BoardConfig } from '../model/drag.model';
import { describe, it, expect, beforeEach } from 'vitest';

describe('KanbanService', () => {
  let service: KanbanService;

  const mockBoards: BoardConfig[] = [
    { id: 'todo', title: 'To Do' },
    { id: 'done', title: 'Done' },
  ];

  const mockItems: KanbanItem[] = [
    { id: '1', title: 'A', subtitle: 'S1', boardId: 'todo', order: 0 },
    { id: '2', title: 'B', subtitle: 'S2', boardId: 'todo', order: 1 },
    { id: '3', title: 'C', subtitle: 'S3', boardId: 'done', order: 0 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KanbanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should group items and sort them by order', () => {
    const unorderedItems: KanbanItem[] = [
      { id: '2', title: 'B', subtitle: 'S2', boardId: 'todo', order: 1 },
      { id: '1', title: 'A', subtitle: 'S1', boardId: 'todo', order: 0 },
    ];

    const result = service.groupItemsByBoard(mockBoards, unorderedItems);

    expect(result['todo'].length).toBe(2);
    expect(result['todo'][0].id).toBe('1');
    expect(result['todo'][1].id).toBe('2');
    expect(result['done']).toEqual([]);
  });

  it('should move an item to a different board and normalize orders', () => {
    const result = service.reorderItems(mockItems, '1', 'done');

    const item1 = result.find((i) => i.id === '1');
    const item2 = result.find((i) => i.id === '2');

    expect(item1?.boardId).toBe('done');
    expect(item1?.order).toBe(1);

    expect(item2?.order).toBe(1);
  });

  it('should insert item after drop target when dragging from bottom to top', () => {
    const items: KanbanItem[] = [
      { id: '1', title: 'A', subtitle: 'S1', boardId: 'todo', order: 0 },
      { id: '2', title: 'B', subtitle: 'S2', boardId: 'todo', order: 1 },
      { id: '3', title: 'C', subtitle: 'S3', boardId: 'todo', order: 2 },
    ];

    const result = service.reorderItems(items, '3', 'todo', '1');

    const sortedResult = result.sort((a, b) => a.order - b.order);

    expect(sortedResult[0].id).toBe('3');
    expect(sortedResult[0].order).toBe(0);
    expect(sortedResult[1].id).toBe('1');
    expect(sortedResult[1].order).toBe(1);
    expect(sortedResult[2].id).toBe('2');
    expect(sortedResult[2].order).toBe(2);
  });

  it('should swap adjacent items when dragging from top to bottom', () => {
    const items: KanbanItem[] = [
      { id: '1', title: 'A', subtitle: 'S1', boardId: 'todo', order: 0 },
      { id: '2', title: 'B', subtitle: 'S2', boardId: 'todo', order: 1 },
    ];
    const result = service.reorderItems(items, '1', 'todo', '2');
    const sorted = result.sort((a, b) => a.order - b.order);

    expect(sorted[0].id).toBe('2');
    expect(sorted[1].id).toBe('1');
  });


  it('should remove an item and fix order gaps', () => {
    const items: KanbanItem[] = [
      { id: '1', title: 'A', subtitle: 'S1', boardId: 'todo', order: 0 },
      { id: '2', title: 'B', subtitle: 'S2', boardId: 'todo', order: 1 },
      { id: '3', title: 'C', subtitle: 'S3', boardId: 'todo', order: 2 },
    ];

    const result = service.removeItem(items, '2');

    expect(result.length).toBe(2);
    expect(result.find((i) => i.id === '3')?.order).toBe(1);
    expect(service.removeItem(items, '999')).toBe(items);
  });
});
