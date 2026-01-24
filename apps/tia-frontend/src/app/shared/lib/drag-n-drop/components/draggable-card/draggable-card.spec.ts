import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DraggableCard } from './draggable-card';
import { vi } from 'vitest';

describe('DraggableCard', () => {
  let component: DraggableCard;
  let fixture: ComponentFixture<DraggableCard>;

  const mockItem = {
    id: 'card-123',
    title: 'Test Task',
    subtitle: 'Test Subtitle',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraggableCard],
    }).compileComponents();

    fixture = TestBed.createComponent(DraggableCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('itemData', mockItem);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit dragStart only if target is the drag icon', () => {
    const dragIcon = document.createElement('div');
    dragIcon.classList.add('draggable-card__icon');

    const event = {
      target: dragIcon,
      preventDefault: vi.fn(),
    } as unknown as PointerEvent;

    const spy = vi.spyOn(component.dragStart, 'emit');

    component.onDragStartPoint(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(event);
  });

  it('should not emit dragStart if target is not the drag icon', () => {
    const otherElement = document.createElement('div');
    const event = {
      target: otherElement,
      preventDefault: vi.fn(),
    } as unknown as PointerEvent;

    const spy = vi.spyOn(component.dragStart, 'emit');

    component.onDragStartPoint(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit remove, edit, and add events', () => {
    const removeSpy = vi.spyOn(component.remove, 'emit');
    const editSpy = vi.spyOn(component.edit, 'emit');
    const addSpy = vi.spyOn(component.add, 'emit');

    component.onRemove();
    component.onEdit();
    component.onAdd();

    expect(removeSpy).toHaveBeenCalled();
    expect(editSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();
  });

  it('should toggle expanded model and emit event', () => {
    const spy = vi.spyOn(component.expandedChange, 'emit');
    const event = { stopPropagation: vi.fn() } as unknown as Event;

    component.onToggleExpanded(event);

    expect(component.expanded()).toBe(true);
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should update selectedPagination signal and emit value', () => {
    const spy = vi.spyOn(component.paginationChange, 'emit');
    const mockEvent = { target: { value: '40' } } as unknown as Event;

    component.onPaginationChange(mockEvent);

    expect(component.selectedPagination()).toBe(40);
    expect(spy).toHaveBeenCalledWith(40);
  });

  it('should compute dragging state from input fallback', () => {
    fixture.componentRef.setInput('isDragging', true);
    fixture.detectChanges();
    expect(component['computedIsDragging']()).toBe(true);
  });

  it('should compute drop target state from input fallback', () => {
    fixture.componentRef.setInput('isDropTarget', true);
    fixture.detectChanges();
    expect(component['computedIsDropTarget']()).toBe(true);
  });
});
