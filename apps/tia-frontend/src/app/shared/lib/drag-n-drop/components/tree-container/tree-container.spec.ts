import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeContainer } from './tree-container';
import { TreeService } from '../../services/tree.service';
import { UNGROUPED_ID } from '../../constants/drag.constants';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('TreeContainer', () => {
  let component: TreeContainer;
  let fixture: ComponentFixture<TreeContainer>;

  const mockGroups = [
    { id: 'g1', groupName: 'Group 1', expanded: false },
    { id: 'g2', groupName: 'Group 2', expanded: false },
  ];
  const mockItems = [
    { id: 'i1', title: 'Item 1', groupId: 'g1', order: 0 },
    { id: 'i2', title: 'Item 2', groupId: 'g1', order: 1 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeContainer],
      providers: [TreeService],
    }).compileComponents();

    fixture = TestBed.createComponent(TreeContainer);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('groups', mockGroups);
    fixture.componentRef.setInput('items', mockItems);

    fixture.detectChanges();
  });

  it('should include the Ungrouped category automatically at the end', () => {
    const groups = component.internalGroups();
    expect(groups.some((g) => g.id === UNGROUPED_ID)).toBe(true);
    expect(groups[groups.length - 1].id).toBe(UNGROUPED_ID);
  });

  it('should toggle expansion and emit for non-ungrouped groups', () => {
    const expandedSpy = vi.spyOn(component.expandedChange, 'emit');
    component.toggleExpanded('g1');

    const g1 = component.internalGroups().find((g) => g.id === 'g1');
    expect(g1?.expanded).toBe(true);
    expect(expandedSpy).toHaveBeenCalledWith({ id: 'g1', expanded: true });
  });

  it('should handle group reordering in handleDrop', () => {
    const spy = vi.spyOn(component.groupsChange, 'emit');

    vi.spyOn(component as any, 'calculateReorderedItems').mockReturnValue([
      mockGroups[1],
      mockGroups[0],
      { id: UNGROUPED_ID },
    ]);

    component['handleDrop']('group:g1', 'group:g2');

    expect(spy).toHaveBeenCalled();
    const groups = component.internalGroups();
    expect(groups[0].id).toBe('g2');
  });

  it('should handle item move to a different group', () => {
    const spy = vi.spyOn(component.itemMoved, 'emit');
    component['handleDrop']('i1', 'group:g2');

    expect(component.internalItems().find((i) => i.id === 'i1')?.groupId).toBe(
      'g2',
    );
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        itemId: 'i1',
        fromGroupId: 'g1',
        toGroupId: 'g2',
      }),
    );
  });

  it('should emit moveRedundant when dropping item into its own current group', () => {
    const spy = vi.spyOn(component.moveRedundant, 'emit');
    component['handleDrop']('i1', 'group:g1');
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should handle checkbox selection logic', () => {
    const spy = vi.spyOn(component.checkedItemsChange, 'emit');

    component.onItemCheckedChange('i1', true);
    expect(component.isItemChecked('i1')).toBe(true);
    expect(spy).toHaveBeenCalled();
  });

  it('should emit all UI interaction events', () => {
    const spies = {
      edit: vi.spyOn(component.itemEdited, 'emit'),
      groupEdit: vi.spyOn(component.groupEdited, 'emit'),
      add: vi.spyOn(component.itemAdded, 'emit'),
      view: vi.spyOn(component.viewOptionChanged, 'emit'),
      pag: vi.spyOn(component.paginationChanged, 'emit'),
      btn: vi.spyOn(component.buttonClicked, 'emit'),
    };

    component.onEditItem('i1');
    component.onEditGroup('g1');
    component.onAddItem('g1');
    component.onViewOptionChange('i1', false);
    component.onPaginationChange('i1', 20);
    component.onButtonClick('i1');

    expect(spies.edit).toHaveBeenCalledWith('i1');
    expect(spies.groupEdit).toHaveBeenCalledWith('g1');
    expect(spies.add).toHaveBeenCalledWith('g1');
    expect(spies.view).toHaveBeenCalledWith({ id: 'i1', isViewable: false });
    expect(spies.pag).toHaveBeenCalledWith({ id: 'i1', value: 20 });
    expect(spies.btn).toHaveBeenCalledWith('i1');
  });

  it('should return early in handleDrop for invalid scenarios', () => {
    const spy = vi.spyOn(component.itemsChange, 'emit');
    component['handleDrop']('non-existent', 'g1');
    component['handleDrop']('i1', 'invalid-target');

    expect(spy).not.toHaveBeenCalled();
  });
});
