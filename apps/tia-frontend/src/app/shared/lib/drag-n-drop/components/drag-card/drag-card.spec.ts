import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragCard } from './drag-card';
import { vi } from 'vitest';

describe('DragCard', () => {
  let component: DragCard;
  let fixture: ComponentFixture<DragCard>;

  const mockItems = [
    { id: '1', title: 'Item 1', subtitle: 'Subtitle 1' },
    { id: '2', title: 'Item 2', subtitle: 'Subtitle 2' },
    { id: '3', title: 'Item 3', subtitle: 'Subtitle 3' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragCard],
    }).compileComponents();

    fixture = TestBed.createComponent(DragCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', mockItems);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize internalItems from input', () => {
    expect(component.internalItems.length).toBe(3);
    expect(component.internalItems[0].id).toBe('1');
  });

  it('should set dragging state and register listeners on drag start', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    const event = { clientX: 100, clientY: 200 } as PointerEvent;

    component.onDragStart('1', event);

    expect(component.draggingId()).toBe('1');
    expect(addSpy).toHaveBeenCalledWith('pointermove', component.onPointerMove);
    expect(addSpy).toHaveBeenCalledWith('pointerup', component.onPointerUp);
  });

  it('should update current position on pointer move', () => {
    document.elementFromPoint = vi.fn().mockReturnValue(null);
    component.onDragStart('1', { clientX: 100, clientY: 200 } as PointerEvent);

    component.onPointerMove({ clientX: 150, clientY: 250 } as PointerEvent);

    expect(component.currentX()).toBe(50);
    expect(component.currentY()).toBe(50);
  });

  it('should reset state and remove listeners on pointer up', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');
    component.draggingId.set('1');
    component.currentX.set(50);
    component.currentY.set(50);

    component.onPointerUp();

    expect(component.draggingId()).toBeNull();
    expect(component.currentX()).toBe(0);
    expect(component.currentY()).toBe(0);
    expect(removeSpy).toHaveBeenCalledWith(
      'pointermove',
      component.onPointerMove,
    );
    expect(removeSpy).toHaveBeenCalledWith('pointerup', component.onPointerUp);
  });

  it('should remove item and emit events on remove', () => {
    const itemsChangeSpy = vi.spyOn(component.itemsChange, 'emit');
    const itemRemovedSpy = vi.spyOn(component.itemRemoved, 'emit');

    component.onRemove('1');

    expect(component.internalItems.length).toBe(2);
    expect(
      component.internalItems.find((item) => item.id === '1'),
    ).toBeUndefined();
    expect(itemsChangeSpy).toHaveBeenCalledWith(component.internalItems);
    expect(itemRemovedSpy).toHaveBeenCalledWith('1');
  });

  it('should remove event listeners on destroy', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    component.ngOnDestroy();

    expect(removeSpy).toHaveBeenCalledWith(
      'pointermove',
      component.onPointerMove,
    );
    expect(removeSpy).toHaveBeenCalledWith('pointerup', component.onPointerUp);
  });
});
