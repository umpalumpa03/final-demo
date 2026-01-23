import { TestBed } from '@angular/core/testing';
import { KanbanService } from './kanban.service';
import { KanbanItem, BoardConfig } from '../model/drag.model';

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

  describe('groupItemsByBoard', () => {
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
  });

  describe('reorderItems', () => {
    it('should move an item to a different board and normalize orders', () => {
      const result = service.reorderItems(mockItems, '1', 'done');

      const item1 = result.find((i) => i.id === '1');
      const item2 = result.find((i) => i.id === '2');

      expect(item1?.boardId).toBe('done');
      expect(item1?.order).toBe(1);
      expect(item2?.order).toBe(0);
    });

    it('should insert an item at a specific position', () => {
      const items: KanbanItem[] = [
        { id: '1', title: 'A', subtitle: 'S1', boardId: 'todo', order: 0 },
        { id: '2', title: 'B', subtitle: 'S2', boardId: 'todo', order: 1 },
        { id: '3', title: 'C', subtitle: 'S3', boardId: 'todo', order: 2 },
      ];

      const result = service.reorderItems(items, '3', 'todo', '1');

      expect(result[0].id).toBe('3');
      expect(result[0].order).toBe(0);
      expect(result[1].id).toBe('1');
      expect(result[1].order).toBe(1);
    });
  });

  describe('removeItem', () => {
    it('should remove an item and fix order gaps', () => {
      const items: KanbanItem[] = [
        { id: '1', title: 'A', subtitle: 'S1', boardId: 'todo', order: 0 },
        { id: '2', title: 'B', subtitle: 'S2', boardId: 'todo', order: 1 },
        { id: '3', title: 'C', subtitle: 'S3', boardId: 'todo', order: 2 },
      ];

      const result = service.removeItem(items, '2');

      expect(result.length).toBe(2);
      expect(result.find((i) => i.id === '3')?.order).toBe(1);
    });
  });
});
