import { TestBed } from '@angular/core/testing';
import { TreeService } from './tree.service';
import { TreeItem, TreeGroupConfig } from '../model/drag.model';
import { UNGROUPED_ID } from '../constants/drag.constants';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('TreeService', () => {
  let service: TreeService;

  const mockGroups: TreeGroupConfig[] = [
    { id: 'g1', groupName: 'Group 1' },
    { id: 'g2', groupName: 'Group 2' },
  ];

  const mockItems: TreeItem[] = [
    { id: 'i1', title: 'A', subtitle: '', groupId: 'g1', order: 0 },
    { id: 'i2', title: 'B', subtitle: '', groupId: 'g1', order: 1 },
    { id: 'i3', title: 'C', subtitle: '', groupId: 'g2', order: 0 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeService);
  });

  it('should handle items with no groupId by placing them in UNGROUPED_ID', () => {
    const items: TreeItem[] = [
      { id: 'orphan', title: 'Orphan', subtitle: '', groupId: null, order: 0 },
    ];
    const result = service.groupItemsByGroup([], items);

    expect(result[UNGROUPED_ID]).toBeDefined();
    expect(result[UNGROUPED_ID][0].id).toBe('orphan');
  });

  it('should handle reordering items DOWN within the same group', () => {
    const result = service.reorderItems(mockItems, 'i1', 'g1', 'i2');
    const g1Items = result
      .filter((i) => i.groupId === 'g1')
      .sort((a, b) => a.order - b.order);

    expect(g1Items[0].id).toBe('i2');
    expect(g1Items[1].id).toBe('i1');
    expect(g1Items[1].order).toBe(1);
  });

  it('should handle reordering items UP within the same group', () => {
    const result = service.reorderItems(mockItems, 'i2', 'g1', 'i1');
    const g1Items = result
      .filter((i) => i.groupId === 'g1')
      .sort((a, b) => a.order - b.order);

    expect(g1Items[0].id).toBe('i2');
    expect(g1Items[1].id).toBe('i1');
  });

  it('should return original items if moving to same group without targetItemId', () => {
    const result = service.reorderItems(mockItems, 'i1', 'g1');
    expect(result).toBe(mockItems);
  });

  it('should append to end if targetItemId is not found in siblings', () => {
    const result = service.reorderItems(mockItems, 'i1', 'g2', 'non-existent');
    const g2Items = result
      .filter((i) => i.groupId === 'g2')
      .sort((a, b) => a.order - b.order);

    expect(g2Items[g2Items.length - 1].id).toBe('i1');
  });

  it('should handle UNGROUPED_ID in toggle and check methods', () => {
    const items: TreeItem[] = [
      { id: 'i1', title: 'A', subtitle: '', groupId: null, order: 0 },
    ];
    let set = new Set<string>();

    set = service.toggleGroupChecked(UNGROUPED_ID, true, items, set);
    expect(set.has('i1')).toBe(true);

    expect(service.isGroupFullyChecked(UNGROUPED_ID, items, set)).toBe(true);
    expect(service.isGroupPartiallyChecked(UNGROUPED_ID, items, set)).toBe(
      false,
    );
  });

  it('should return original items when removing non-existent item', () => {
    const result = service.removeItem(mockItems, '999');
    expect(result).toBe(mockItems);
  });
  it('should handle moving an item to a completely new group (Hits cross-group branches)', () => {
    const result = service.reorderItems(mockItems, 'i1', 'g2');

    const i1 = result.find((i) => i.id === 'i1');
    const g2Items = result.filter((i) => i.groupId === 'g2');

    expect(i1?.groupId).toBe('g2');
    expect(i1?.order).toBe(1);
    expect(g2Items.length).toBe(2);
  });

  it('should remove a group and filter out all its items (Hits removeGroup branch)', () => {
    const { groups, items } = service.removeGroup(mockGroups, mockItems, 'g1');

    expect(groups.length).toBe(1);
    expect(groups[0].id).toBe('g2');
    expect(items.length).toBe(1);
    expect(items[0].id).toBe('i3');
  });

  it('should handle reordering within the same group without a target item (Hits early return branch)', () => {
    const result = service.reorderItems(mockItems, 'i1', 'g1');
    expect(result).toBe(mockItems);
  });

  it('should return empty array if all items are removed one by one (Hits normalization branch)', () => {
    const step1 = service.removeItem(mockItems, 'i1');
    const step2 = service.removeItem(step1, 'i2');
    const step3 = service.removeItem(step2, 'i3');

    expect(step3.length).toBe(0);
  });
});
