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
    const dragItem = items.find((i) => i.id === dragId);
    if (!dragItem) return items;

    const filteredItems = items.filter((i) => i.id !== dragId);
    const siblings = filteredItems
      .filter((i) => i.boardId === toBoardId)
      .sort((a, b) => a.order - b.order);

    const otherItems = filteredItems.filter((i) => i.boardId !== toBoardId);
    const newItem = { ...dragItem, boardId: toBoardId };
    let updatedSiblings: KanbanItem[] = [];

    if (dropId) {
      const targetIndex = siblings.findIndex((i) => i.id === dropId);
      if (targetIndex !== -1) {
        updatedSiblings = [...siblings];

        const movingWithinBoard = dragItem.boardId === toBoardId;
        const isMovingDown =
          movingWithinBoard && dragItem.order < siblings[targetIndex].order;
        const insertionIndex = isMovingDown ? targetIndex + 1 : targetIndex;
        updatedSiblings.splice(insertionIndex, 0, newItem);
      } else {
        updatedSiblings = [...siblings, newItem];
      }
    } else {
      updatedSiblings = [...siblings, newItem];
    }

    const normalizedSiblings = updatedSiblings.map((item, index) => ({
      ...item,
      order: index,
    }));

    return [...otherItems, ...normalizedSiblings];
  }

  public removeItem(items: KanbanItem[], id: string): KanbanItem[] {
    const itemToRemove = items.find((i) => i.id === id);
    if (!itemToRemove) return items;

    const filtered = items.filter((i) => i.id !== id);
    const siblings = filtered
      .filter((i) => i.boardId === itemToRemove.boardId)
      .sort((a, b) => a.order - b.order)
      .map((item, index) => ({ ...item, order: index }));

    const others = filtered.filter((i) => i.boardId !== itemToRemove.boardId);

    return [...others, ...siblings];
  }
}
