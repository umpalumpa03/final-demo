import { TestBed } from '@angular/core/testing';
import { TreeService } from './tree.service';
import { TreeItem, TreeGroupConfig } from '../model/drag.model';

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
    expect(result['g1'][0].id).toBe('i1');
    expect(result['g2']).toEqual([]);
  });

  it('should return original items if dragId or removeId is not found', () => {
    expect(service.reorderItems(mockItems, 'invalid', 'g1')).toBe(mockItems);
    expect(service.removeItem(mockItems, 'invalid')).toBe(mockItems);
  });

  it('should move item to a different group and normalize target orders', () => {
    const result = service.reorderItems(mockItems, 'i1', 'g2');
    const group2Items = result.filter((i) => i.groupId === 'g2');
    expect(group2Items.length).toBe(2);
    expect(group2Items.find((i) => i.id === 'i1')?.order).toBe(1);
  });

  it('should use reorderFn to insert item at specific position', () => {
    const reorderFn = (list: TreeItem[]) => [list[1], list[0]];
    const result = service.reorderItems(mockItems, 'i2', 'g1', 'i1', reorderFn);
    const g1 = result
      .filter((i) => i.groupId === 'g1')
      .sort((a, b) => a.order - b.order);
    expect(g1[0].id).toBe('i2');
  });

  it('should remove item and fix order gaps', () => {
    const items = [
      { id: '1', title: 'A', subtitle: '', groupId: 'g1', order: 0 },
      { id: '2', title: 'B', subtitle: '', groupId: 'g1', order: 1 },
    ];
    const result = service.removeItem(items, '1');
    expect(result[0].id).toBe('2');
    expect(result[0].order).toBe(0);
  });

  it('should remove group and its associated items', () => {
    const result = service.removeGroup(mockGroups, mockItems, 'g1');
    expect(result.groups.length).toBe(1);
    expect(result.items.every((i) => i.groupId !== 'g1')).toBe(true);
  });

  it('should toggle all items in a group', () => {
    let set = new Set<string>();
    set = service.toggleGroupChecked('g1', true, mockItems, set);
    expect(set.has('i1') && set.has('i2')).toBe(true);

    set = service.toggleGroupChecked('g1', false, mockItems, set);
    expect(set.size).toBe(0);
  });

  it('should toggle single item check state', () => {
    let set = new Set<string>();
    set = service.toggleItemChecked('i1', true, set);
    expect(set.has('i1')).toBe(true);
    set = service.toggleItemChecked('i1', false, set);
    expect(set.has('i1')).toBe(false);
  });

  it('should determine group check status correctly', () => {
    const set = new Set(['i1']);
    expect(service.isGroupPartiallyChecked('g1', mockItems, set)).toBe(true);
    expect(service.isGroupFullyChecked('g1', mockItems, set)).toBe(false);

    set.add('i2');
    expect(service.isGroupPartiallyChecked('g1', mockItems, set)).toBe(false);
    expect(service.isGroupFullyChecked('g1', mockItems, set)).toBe(true);

    expect(service.isGroupFullyChecked('invalid', [], set)).toBe(false);
    expect(service.isGroupPartiallyChecked('invalid', [], set)).toBe(false);
  });

  it('should convert set to array', () => {
    const set = new Set(['i1', 'i2']);
    expect(service.getCheckedItemIds(set)).toEqual(['i1', 'i2']);
  });
});
