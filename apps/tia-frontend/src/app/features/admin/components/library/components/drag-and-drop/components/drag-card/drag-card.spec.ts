import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragCard } from './drag-card';
import { vi } from 'vitest';

describe('DragCard', () => {
  let component: DragCard;
  let fixture: ComponentFixture<DragCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragCard],
    }).compileComponents();

    fixture = TestBed.createComponent(DragCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onDragStart', () => {
    it('should set dragging state and register listeners', () => {
      const addSpy = vi.spyOn(document, 'addEventListener');
      const event = { clientX: 100, clientY: 200 } as PointerEvent;

      component.onDragStart('1', event);

      expect(component.draggingId()).toBe('1');
      expect(component.startX).toBe(100);
      expect(component.startY).toBe(200);
      expect(addSpy).toHaveBeenCalledWith(
        'pointermove',
        component.onPointerMove,
      );
      expect(addSpy).toHaveBeenCalledWith('pointerup', component.onPointerUp);
    });
  });

  describe('onPointerMove', () => {
    it('should update current position relative to start', () => {
      component.startX = 100;
      component.startY = 200;
      const event = { clientX: 150, clientY: 250 } as PointerEvent;

      component.onPointerMove(event);

      expect(component.currentX()).toBe(50);
      expect(component.currentY()).toBe(50);
    });
  });

  describe('onPointerUp', () => {
    it('should reset state and remove listeners', () => {
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
      expect(removeSpy).toHaveBeenCalledWith(
        'pointerup',
        component.onPointerUp,
      );
    });
  });

  describe('onRemove', () => {
    it('should remove item by id', () => {
      const initialLength = component.items.length;
      const firstItemId = component.items[0].id;

      component.onRemove(firstItemId);

      expect(component.items.length).toBe(initialLength - 1);
      expect(
        component.items.find((item) => item.id === firstItemId),
      ).toBeUndefined();
    });
  });
});
