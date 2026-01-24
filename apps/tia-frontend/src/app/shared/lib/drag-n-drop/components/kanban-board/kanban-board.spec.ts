import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KanbanBoard } from './kanban-board';
import { KanbanService } from '../../services/kanban.service';
import { vi } from 'vitest';

describe('KanbanBoard', () => {
  let component: KanbanBoard;
  let fixture: ComponentFixture<KanbanBoard>;
  let mockService: any;

  const mockBoards = [
    { id: 'todo', title: 'To Do' },
    { id: 'done', title: 'Done' },
  ];
  const mockItems = [
    { id: '1', title: 'Task 1', boardId: 'todo', order: 0 },
    { id: '2', title: 'Task 2', boardId: 'todo', order: 1 },
  ];

  beforeEach(async () => {
    mockService = {
      groupItemsByBoard: vi.fn().mockReturnValue({ todo: mockItems, done: [] }),
      reorderItems: vi.fn(),
      removeItem: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [KanbanBoard],
      providers: [{ provide: KanbanService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(KanbanBoard);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('boards', mockBoards);
    fixture.componentRef.setInput('items', mockItems);

    fixture.detectChanges();
  });

  it('should initialize internalItems and grouped items via signals', () => {
    expect(component.internalItems().length).toBe(2);
    expect(mockService.groupItemsByBoard).toHaveBeenCalled();
    expect(component.itemsByBoard()['todo']).toBeDefined();
  });

  it('should call service and emit events on handleDrop', () => {
    const updatedMock = [...mockItems];
    mockService.reorderItems.mockReturnValue(updatedMock);
    const itemsChangeSpy = vi.spyOn(component.itemsChange, 'emit');

    component['handleDrop']('1', 'board:done');

    expect(mockService.reorderItems).toHaveBeenCalledWith(
      expect.any(Array),
      '1',
      'done',
      undefined,
    );
    expect(component.internalItems()).toEqual(updatedMock);
    expect(itemsChangeSpy).toHaveBeenCalled();
  });

  it('should emit cardReordered when dropped in same board', () => {
    const reorderedMock = [mockItems[1], mockItems[0]];
    mockService.reorderItems.mockReturnValue(reorderedMock);
    const reorderedSpy = vi.spyOn(component.cardReordered, 'emit');
    component['handleDrop']('1', '2');

    expect(reorderedSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        cardId: '1',
        boardId: 'todo',
      }),
    );
  });

  it('should call removeItem and update state on remove', () => {
    const filteredMock = [mockItems[1]];
    mockService.removeItem.mockReturnValue(filteredMock);
    const removeSpy = vi.spyOn(component.cardRemoved, 'emit');

    component.onRemove('1');

    expect(mockService.removeItem).toHaveBeenCalledWith(expect.any(Array), '1');
    expect(component.internalItems()).toEqual(filteredMock);
    expect(removeSpy).toHaveBeenCalledWith('1');
  });

  it('should set dragging state via base class handler', () => {
    const event = { clientX: 0, clientY: 0 } as PointerEvent;
    component.onDragStartHandler('1', event);
    expect(component.draggingId()).toBe('1');
  });
});
