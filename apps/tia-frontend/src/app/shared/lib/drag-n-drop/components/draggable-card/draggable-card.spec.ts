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

  it('should emit dragStart and prevent default browser behavior', () => {
    const event = { preventDefault: vi.fn() } as unknown as PointerEvent;
    const spy = vi.spyOn(component.dragStart, 'emit');

    component.onDragStartPoint(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(event);
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

  it('should toggle isViewable signal and emit change', () => {
    const spy = vi.spyOn(component.viewOptionChange, 'emit');
    const initialState = component.isViewable();

    component.onToggleView();

    expect(component.isViewable()).toBe(!initialState);
    expect(spy).toHaveBeenCalledWith(!initialState);
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
