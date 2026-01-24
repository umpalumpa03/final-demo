import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeContainer } from './tree-container';
import { TreeService } from '../../services/tree.service';
import { vi } from 'vitest';

describe('TreeContainer', () => {
  let component: TreeContainer;
  let fixture: ComponentFixture<TreeContainer>;

  const mockGroups = [{ id: 'g1', title: 'Group 1', expanded: false }];
  const mockItems = [
    { id: 'i1', title: 'Item 1', subtitle: '', groupId: 'g1', order: 0 },
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

  it('should remove item and update state', () => {
    const itemsSpy = vi.spyOn(component.itemsChange, 'emit');

    component.onRemoveItem('i1');

    expect(component.internalItems().length).toBe(0);
    expect(itemsSpy).toHaveBeenCalled();
  });

  it('should remove group and associated items', () => {
    const groupsSpy = vi.spyOn(component.groupsChange, 'emit');

    component.onRemoveGroup('g1');

    expect(component.internalGroups().length).toBe(0);
    expect(component.internalItems().length).toBe(0);
    expect(groupsSpy).toHaveBeenCalled();
  });

  it('should initialize signals from inputs', () => {
    expect(component.internalGroups().length).toBe(1);
    expect(component.internalItems().length).toBe(1);
  });
});
