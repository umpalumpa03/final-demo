import { TestBed } from '@angular/core/testing';
import { TreeService } from './tree.service';
import { TreeItem, TreeGroupConfig } from '../model/drag.model';
import { vi } from 'vitest';

describe('TreeService', () => {
  let service: TreeService;

  const mockGroups: TreeGroupConfig[] = [
    { id: 'g1', title: 'Group 1' },
    { id: 'g2', title: 'Group 2' },
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

  it('should group items by groupId and sort by order', () => {
    const unordered: TreeItem[] = [
      { id: 'i2', title: 'B', subtitle: '', groupId: 'g1', order: 1 },
      { id: 'i1', title: 'A', subtitle: '', groupId: 'g1', order: 0 },
    ];
    const result = service.groupItemsByGroup(mockGroups, unordered);

    expect(result['g1'].length).toBe(2);
    expect(result['g1'][0].id).toBe('i1');
    expect(result['g1'][1].id).toBe('i2');
    expect(result['g2']).toEqual([]);
  });

  it('should move item to a different group and normalize target orders', () => {
    const result = service.reorderItems(mockItems, 'i1', 'g2');
    const group2Items = result.filter((i) => i.groupId === 'g2');
    const group1Items = result.filter((i) => i.groupId === 'g1');

    expect(group2Items.length).toBe(2);
    expect(group2Items.find((i) => i.id === 'i1')?.order).toBe(1);
    expect(group1Items[0].id).toBe('i2');
    expect(group1Items[0].order).toBe(1);
  });

  it('should use reorderFn to insert item at specific position', () => {
    const reorderFn = (list: any[]) => [list[1], list[0]];
    const items: TreeItem[] = [
      { id: 'i1', title: 'A', subtitle: '', groupId: 'g1', order: 0 },
      { id: 'i2', title: 'B', subtitle: '', groupId: 'g1', order: 1 },
    ];

    const result = service.reorderItems(items, 'i2', 'g1', 'i1', reorderFn);
    const group1 = result
      .filter((i) => i.groupId === 'g1')
      .sort((a, b) => a.order - b.order);

    expect(group1[0].id).toBe('i2');
    expect(group1[0].order).toBe(0);
    expect(group1[1].id).toBe('i1');
    expect(group1[1].order).toBe(1);
  });

  it('should remove item and fix order gaps for the affected group', () => {
    const items: TreeItem[] = [
      { id: 'i1', title: 'A', subtitle: '', groupId: 'g1', order: 0 },
      { id: 'i2', title: 'B', subtitle: '', groupId: 'g1', order: 1 },
      { id: 'i3', title: 'C', subtitle: '', groupId: 'g1', order: 2 },
    ];

    const result = service.removeItem(items, 'i2');

    expect(result.length).toBe(2);
    expect(result.find((i) => i.id === 'i3')?.order).toBe(1);
    expect(result.find((i) => i.id === 'i1')?.order).toBe(0);
  });

  it('should remove group and its associated items', () => {
    const result = service.removeGroup(mockGroups, mockItems, 'g1');

    expect(result.groups.length).toBe(1);
    expect(result.groups[0].id).toBe('g2');
    expect(result.items.length).toBe(1);
    expect(result.items[0].id).toBe('i3');
  });

  it('should return original items if dragId is not found', () => {
    const result = service.reorderItems(mockItems, 'invalid', 'g1');
    expect(result).toEqual(mockItems);
  });
});
