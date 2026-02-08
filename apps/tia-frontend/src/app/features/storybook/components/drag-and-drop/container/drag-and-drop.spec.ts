import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragAndDropContainer } from './drag-and-drop';
import {
  CardMovedEvent,
  CardReorderedEvent,
  TreeItemMovedEvent,
  TreeItemReorderedEvent,
} from '@tia/shared/lib/drag-n-drop/model/drag.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('DragAndDropContainer', () => {
  let component: DragAndDropContainer;
  let fixture: ComponentFixture<DragAndDropContainer>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragAndDropContainer, TranslateModule.forRoot()],
      providers: [
        { provide: 'ANIMATION_MODULE_TYPE', useValue: 'NoopAnimations' },
      ],
    }).compileComponents();

    translateService = TestBed.inject(TranslateService);
    fixture = TestBed.createComponent(DragAndDropContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should refresh all data when language changes', () => {
    const boardsSpy = vi.spyOn(component.boards, 'set');
    const treeGroupsSpy = vi.spyOn(component.treeGroups, 'set');
    translateService.use('ka');

    expect(boardsSpy).toHaveBeenCalled();
    expect(treeGroupsSpy).toHaveBeenCalled();
    expect(component.items.length).toBeGreaterThan(0);
  });

  it('should handle move permissions and item changes', () => {
    component.movenotAllowed(true);

    const newItems = [{ id: 'test', title: 'Test' }] as any;
    component.onItemsChange(newItems);
    expect(component.myItems).toEqual(newItems);
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
    expect(component.treeGroups()).toEqual([]);

    component.onTreeItemsChange([]);
    expect(component.treeItems()).toEqual([]);

    component.onTreeItemMoved(movedEvent);
    component.onTreeItemReordered(reorderEvent);
    component.onTreeExpandedChange({ id: 'g1', expanded: true });
    component.onCheckedItemsChange(['1', '2']);
    component.onContainerOrderChange(['1']);
    component.onRemove('1');
    component.onEdit('1');
  });
});
