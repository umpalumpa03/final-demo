import { Injectable } from '@angular/core';
import { TreeItem, TreeGroupConfig } from '../model/drag.model';
import { UNGROUPED_ID } from '../constants/drag.constants';

@Injectable({ providedIn: 'root' })
export class TreeService {
  public groupItemsByGroup(
    groups: TreeGroupConfig[],
    items: TreeItem[],
  ): Record<string, TreeItem[]> {
    const map: Record<string, TreeItem[]> = {};
    for (const group of groups) {
      map[group.id] = [];
    }
    if (!map[UNGROUPED_ID]) {
      map[UNGROUPED_ID] = [];
    }

    for (const item of items) {
      const targetId = item.groupId ?? UNGROUPED_ID;
      if (map[targetId]) {
        map[targetId].push(item);
      }
    }

    for (const groupId of Object.keys(map)) {
      map[groupId].sort((a, b) => a.order - b.order);
    }
    return map;
  }

  public reorderItems(
    items: TreeItem[],
    dragId: string,
    toGroupId: string | null,
    targetItemId?: string,
  ): TreeItem[] {
    const dragItem = items.find((i) => i.id === dragId);
    if (!dragItem) return items;

    const filteredItems = items.filter((i) => i.id !== dragId);
    const siblings = filteredItems
      .filter((i) => i.groupId === toGroupId)
      .sort((a, b) => a.order - b.order);
    const otherItems = filteredItems.filter((i) => i.groupId !== toGroupId);
    const newItem = { ...dragItem, groupId: toGroupId };

    let updatedSiblings: TreeItem[] = [];
    if (targetItemId) {
      const targetIndex = siblings.findIndex((i) => i.id === targetItemId);
      if (targetIndex !== -1) {
        updatedSiblings = [...siblings];
        const movingWithinGroup = dragItem.groupId === toGroupId;
        const isMovingDown =
          movingWithinGroup && dragItem.order < siblings[targetIndex].order;
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

  public removeItem(items: TreeItem[], id: string): TreeItem[] {
    const itemToRemove = items.find((i) => i.id === id);
    if (!itemToRemove) return items;
    const filtered = items.filter((item) => item.id !== id);
    const siblings = filtered
      .filter((i) => i.groupId === itemToRemove.groupId)
      .sort((a, b) => a.order - b.order);
    const others = filtered.filter((i) => i.groupId !== itemToRemove.groupId);
    const normalized = siblings.map((item, index) => ({
      ...item,
      order: index,
    }));
    return [...others, ...normalized];
  }

  public removeGroup(
    groups: TreeGroupConfig[],
    items: TreeItem[],
    groupId: string,
  ): { groups: TreeGroupConfig[]; items: TreeItem[] } {
    const filteredGroups = groups
      .filter((g) => g.id !== groupId)
      .map((g, index) => ({ ...g, order: index }));
    return {
      groups: filteredGroups,
      items: items.filter((i) => i.groupId !== groupId),
    };
  }

  public toggleGroupChecked(
    groupId: string,
    checked: boolean,
    items: TreeItem[],
    checkedItemIds: Set<string>,
  ): Set<string> {
    const newSet = new Set(checkedItemIds);
    const targetGroupId = groupId === UNGROUPED_ID ? null : groupId;
    const groupItems = items.filter((i) => i.groupId === targetGroupId);
    for (const item of groupItems) {
      checked ? newSet.add(item.id) : newSet.delete(item.id);
    }
    return newSet;
  }

  public toggleItemChecked(
    itemId: string,
    checked: boolean,
    checkedItemIds: Set<string>,
  ): Set<string> {
    const newSet = new Set(checkedItemIds);
    checked ? newSet.add(itemId) : newSet.delete(itemId);
    return newSet;
  }

  public isGroupFullyChecked(
    groupId: string,
    items: TreeItem[],
    checkedItemIds: Set<string>,
  ): boolean {
    const targetGroupId = groupId === UNGROUPED_ID ? null : groupId;
    const groupItems = items.filter((i) => i.groupId === targetGroupId);
    return (
      groupItems.length > 0 && groupItems.every((i) => checkedItemIds.has(i.id))
    );
  }

  public isGroupPartiallyChecked(
    groupId: string,
    items: TreeItem[],
    checkedItemIds: Set<string>,
  ): boolean {
    const targetGroupId = groupId === UNGROUPED_ID ? null : groupId;
    const groupItems = items.filter((i) => i.groupId === targetGroupId);
    const checkedCount = groupItems.filter((i) =>
      checkedItemIds.has(i.id),
    ).length;
    return checkedCount > 0 && checkedCount < groupItems.length;
  }

  public getCheckedItemIds(checkedItemIds: Set<string>): string[] {
    return Array.from(checkedItemIds);
  }
}
