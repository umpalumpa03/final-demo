import { Injectable } from '@angular/core';
import { KanbanItem, BoardConfig } from '../model/drag.model';

@Injectable({ providedIn: 'root' })
export class KanbanService {
  public groupItemsByBoard(
    boards: BoardConfig[],
    items: KanbanItem[],
  ): Record<string, KanbanItem[]> {
    const grouped: Record<string, KanbanItem[]> = {};
    for (const board of boards) {
      grouped[board.id] = [];
    }
    for (const item of items) {
      if (grouped[item.boardId]) {
        grouped[item.boardId].push(item);
      }
    }
    for (const boardId in grouped) {
      grouped[boardId].sort((a, b) => a.order - b.order);
    }
    return grouped;
  }

  public reorderItems(
    items: KanbanItem[],
    dragId: string,
    toBoardId: string,
    dropId?: string,
  ): KanbanItem[] {
    const allItems = [...items];
    const dragIndex = allItems.findIndex((i) => i.id === dragId);
    if (dragIndex === -1) return items;

    const dragItem = allItems[dragIndex];

    let dropIndex = dropId ? allItems.findIndex((i) => i.id === dropId) : -1;

    const [removed] = allItems.splice(dragIndex, 1);
    const updatedDragItem = { ...removed, boardId: toBoardId };

    if (dropId && dropIndex !== -1) {
      const isSameBoard = dragItem.boardId === toBoardId;

      if (isSameBoard && dragIndex < dropIndex) {
        dropIndex = dropIndex - 1;
      }

      allItems.splice(dropIndex + 1, 0, updatedDragItem);
    } else {
      allItems.push(updatedDragItem);
    }

    return this.normalizeOrders(allItems);
  }

  private normalizeOrders(items: KanbanItem[]): KanbanItem[] {
    const boardItemsMap = new Map<string, KanbanItem[]>();

    for (const item of items) {
      const list = boardItemsMap.get(item.boardId) ?? [];
      list.push(item);
      boardItemsMap.set(item.boardId, list);
    }

    const result: KanbanItem[] = [];
    boardItemsMap.forEach((boardItems) => {
      boardItems.forEach((item, index) => {
        result.push({ ...item, order: index });
      });
    });

    return result;
  }

  public removeItem(items: KanbanItem[], id: string): KanbanItem[] {
    const filtered = items.filter((i) => i.id !== id);
    return this.normalizeOrders(filtered);
  }
}
