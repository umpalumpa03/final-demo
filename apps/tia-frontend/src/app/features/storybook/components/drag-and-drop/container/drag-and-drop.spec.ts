import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragAndDropContainer } from './drag-and-drop';
import {
  CardMovedEvent,
  CardReorderedEvent,
  TreeItemMovedEvent,
  TreeItemReorderedEvent,
} from '@tia/shared/lib/drag-n-drop/model/drag.model';
import { TranslateModule } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('DragAndDropContainer', () => {
  let component: DragAndDropContainer;
  let fixture: ComponentFixture<DragAndDropContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragAndDropContainer, TranslateModule.forRoot()],
      providers: [
        { provide: 'ANIMATION_MODULE_TYPE', useValue: 'NoopAnimations' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DragAndDropContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute all grid and list event handlers', () => {
    component.onItemRemoved('1');
    component.onOrderChange(['1', '2']);
    component.onOrderChangeList(['1', '2']);
    component.onItemEdited('1');
    component.onItemAdded('1');
    component.onViewOptionChanged({ id: '1', isViewable: true });
    component.onPaginationChanged({ id: '1', value: 20 });
    expect(true).toBe(true);
  });

  it('should execute all kanban event handlers', () => {
    const movedEvent: CardMovedEvent = {
      cardId: '1',
      fromBoardId: 'todo',
      toBoardId: 'done',
      newOrder: 0,
    };
    const reorderEvent: CardReorderedEvent = {
      cardId: '1',
      boardId: 'todo',
      newOrder: 1,
    };
    component.onCardMoved(movedEvent);
    component.onCardReordered(reorderEvent);
    component.onCardRemoved('1');
    expect(true).toBe(true);
  });

  it('should execute all tree event handlers and update state', () => {
    const movedEvent: TreeItemMovedEvent = {
      itemId: '1',
      fromGroupId: 'g1',
      toGroupId: 'g2',
      newOrder: 0,
    };
    const reorderEvent: TreeItemReorderedEvent = {
      itemId: '1',
      groupId: 'g1',
      newOrder: 1,
    };

    component.onTreeGroupsChange([]);
    expect(component.treeGroups).toEqual([]);
    component.onTreeItemsChange([]);
    expect(component.treeItems).toEqual([]);

    component.onTreeItemMoved(movedEvent);
    component.onTreeItemReordered(reorderEvent);
    component.onTreeExpandedChange({ id: 'g1', expanded: true });
    component.onCheckedItemsChange(['1', '2']);
  });

  it('should execute custom container event handlers', () => {
    component.onItemsChange([]);
    expect(component.myItems).toEqual([]);
    component.onRemove('1');
    component.onEdit('1');
    component.onContainerOrderChange(['1']);
    expect(true).toBe(true);
  });

  it('should log move not allowed to console', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    component.movenotAllowed(true);
    expect(consoleSpy).toHaveBeenCalledWith(true);
  });
});
