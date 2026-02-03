import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeContainer } from './tree-container';
import { TreeService } from '../../services/tree.service';

describe('TreeContainer', () => {
  let component: TreeContainer;
  let fixture: ComponentFixture<TreeContainer>;

  const mockGroups = [
    { id: 'g1', title: 'Group 1', expanded: false },
    { id: 'g2', title: 'Group 2', expanded: false },
  ];
  const mockItems = [
    { id: 'i1', title: 'Item 1', subtitle: '', groupId: 'g1', order: 0 },
    { id: 'i2', title: 'Item 2', subtitle: '', groupId: 'g1', order: 1 },
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

  it('should toggle expansion and emit', () => {
    const expandedSpy = vi.spyOn(component.expandedChange, 'emit');
    component.toggleExpanded('g1');
    expect(component.internalGroups()[0].expanded).toBe(true);
    expect(expandedSpy).toHaveBeenCalledWith({ id: 'g1', expanded: true });
  });

  it('should handle group reordering in handleDrop', () => {
    const spy = vi.spyOn(component.groupsChange, 'emit');
    component['handleDrop']('g2', 'g1');
    expect(component.internalGroups()[0].id).toBe('g2');
    expect(spy).toHaveBeenCalled();
  });

  it('should handle item move to a different group via group prefix', () => {
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

  it('should handle item reordering within same group', () => {
    const spy = vi.spyOn(component.itemReordered, 'emit');
    component['handleDrop']('i2', 'i1');
    const items = component.internalItems().filter((i) => i.groupId === 'g1');
    expect(items[0].id).toBe('i2');
    expect(spy).toHaveBeenCalled();
  });

  it('should remove item and group and update state', () => {
    component.onRemoveItem('i1');
    expect(component.internalItems().length).toBe(1);

    component.onRemoveGroup('g1');
    expect(component.internalGroups().length).toBe(1);
    expect(component.internalItems().length).toBe(0);
  });

  it('should handle checkbox selection logic', () => {
    const spy = vi.spyOn(component.checkedItemsChange, 'emit');

    component.onItemCheckedChange('i1', true);
    expect(component.isItemChecked('i1')).toBe(true);
    expect(component.isGroupIndeterminate('g1')).toBe(true);

    component.onGroupCheckedChange('g1', true);
    expect(component.isGroupChecked('g1')).toBe(true);
    expect(spy).toHaveBeenCalled();
  });

  it('should emit all passthrough UI events', () => {
    const editSpy = vi.spyOn(component.itemEdited, 'emit');
    const addSpy = vi.spyOn(component.itemAdded, 'emit');
    const viewSpy = vi.spyOn(component.viewOptionChanged, 'emit');
    const pagSpy = vi.spyOn(component.paginationChanged, 'emit');
    const btnSpy = vi.spyOn(component.buttonClicked, 'emit');

    component.onEditItem('i1');
    component.onAddItem('g1');
    component.onViewOptionChange('i1', false);
    component.onPaginationChange('i1', 20);
    component.onButtonClick('i1');

    expect(editSpy).toHaveBeenCalledWith('i1');
    expect(addSpy).toHaveBeenCalledWith('g1');
    expect(viewSpy).toHaveBeenCalledWith({ id: 'i1', isViewable: false });
    expect(pagSpy).toHaveBeenCalledWith({ id: 'i1', value: 20 });
    expect(btnSpy).toHaveBeenCalledWith('i1');
  });

  it('should return early in handleDrop if dragItem not found', () => {
    const spy = vi.spyOn(component.itemsChange, 'emit');
    component['handleDrop']('non-existent', 'g1');
    expect(spy).not.toHaveBeenCalled();
  });
});
