import { Injectable } from '@angular/core';
import { TreeItem, TreeGroupConfig } from '../model/drag.model';

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

    for (const item of items) {
      if (map[item.groupId]) {
        map[item.groupId].push(item);
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
    toGroupId: string,
    targetItemId?: string,
    reorderFn?: (list: any[], dId: string, tId: string) => any[],
  ): TreeItem[] {
    const dragItem = items.find((i) => i.id === dragId);
    if (!dragItem) return items;

    const filteredItems = items.filter((i) => i.id !== dragId);
    const siblings = filteredItems
      .filter((i) => i.groupId === toGroupId)
      .sort((a, b) => a.order - b.order);

    let updatedSiblings: TreeItem[];

    if (targetItemId && reorderFn) {
      const tempSiblings = [...siblings, { ...dragItem, groupId: toGroupId }];
      updatedSiblings = reorderFn(tempSiblings, dragId, targetItemId);
    } else {
      updatedSiblings = [...siblings, { ...dragItem, groupId: toGroupId }];
    }

    const normalizedSiblings = updatedSiblings.map((item, index) => ({
      ...item,
      order: index,
    }));

    const otherItems = filteredItems.filter((i) => i.groupId !== toGroupId);
    return [...otherItems, ...normalizedSiblings];
  }

  public removeItem(items: TreeItem[], id: string): TreeItem[] {
    const removedItem = items.find((i) => i.id === id);
    if (!removedItem) return items;

    const filtered = items.filter((item) => item.id !== id);
    const affectedGroup = filtered
      .filter((i) => i.groupId === removedItem.groupId)
      .sort((a, b) => a.order - b.order)
      .map((item, index) => ({ ...item, order: index }));

    const otherItems = filtered.filter(
      (i) => i.groupId !== removedItem.groupId,
    );
    return [...otherItems, ...affectedGroup];
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
}
