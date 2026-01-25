import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { DragBase } from './drag-base';

@Component({
  selector: 'app-test-drag',
  template: '',
})
class TestDragComponent extends DragBase {
  public handleDropCalled = false;

  protected override handleDrop(dragId: string, dropId: string): void {
    this.handleDropCalled = true;
  }

  public triggerDragStart(id: string, event: PointerEvent): void {
    this.onDragStart(id, event);
  }

  public triggerPointerMove(event: PointerEvent): void {
    this.onPointerMove(event);
  }

  public triggerPointerUp(): void {
    this.onPointerUp();
  }

  public testCalculateReorder<T extends { id: string }>(
    items: T[],
    dragId: string,
    dropId: string,
  ): T[] {
    return this.calculateReorderedItems(items, dragId, dropId);
  }
}

describe('DragBase', () => {
  let component: TestDragComponent;
  let fixture: ComponentFixture<TestDragComponent>;

  beforeEach(async () => {
    document.elementFromPoint = vi.fn().mockReturnValue(null);

    await TestBed.configureTestingModule({
      imports: [TestDragComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly calculate reordered items', () => {
    const items = [{ id: '1' }, { id: '2' }, { id: '3' }];

    const forward = component.testCalculateReorder(items, '1', '2');
    expect(forward.map((i) => i.id)).toEqual(['2', '1', '3']);

    const backward = component.testCalculateReorder(items, '3', '1');
    expect(backward.map((i) => i.id)).toEqual(['3', '1', '2']);
  });

  it('should have initial null drag state', () => {
    expect(component.draggingId()).toBeNull();
    expect(component.dropTargetId()).toBeNull();
  });

  it('should set dragging state and register listeners on drag start', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');

    component.triggerDragStart('1', {
      clientX: 100,
      clientY: 200,
    } as PointerEvent);

    expect(component.draggingId()).toBe('1');
    expect(addSpy).toHaveBeenCalledWith('pointermove', expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith('pointerup', expect.any(Function));
  });

  it('should update position on pointer move', () => {
    component.triggerDragStart('1', {
      clientX: 100,
      clientY: 200,
    } as PointerEvent);

    component.triggerPointerMove({
      clientX: 150,
      clientY: 250,
    } as PointerEvent);

    expect(component['currentX']()).toBe(50);
    expect(component['currentY']()).toBe(50);
  });

  it('should call handleDrop when valid drop target exists', () => {
    component.triggerDragStart('1', {
      clientX: 100,
      clientY: 200,
    } as PointerEvent);
    component.dropTargetId.set('2');

    component.triggerPointerUp();

    expect(component.handleDropCalled).toBe(true);
  });

  it('should reset state on pointer up', () => {
    component.triggerDragStart('1', {
      clientX: 100,
      clientY: 200,
    } as PointerEvent);

    component.triggerPointerUp();

    expect(component.draggingId()).toBeNull();
    expect(component.dropTargetId()).toBeNull();
  });

  it('should compute dragging style', () => {
    component['currentX'].set(50);
    component['currentY'].set(100);

    expect(component.draggingStyle().transform).toBe('translate(50px, 100px)');
    expect(component.draggingStyle().zIndex).toBe(100);
  });

  it('should clean up listeners on destroy', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    component.ngOnDestroy();

    expect(removeSpy).toHaveBeenCalled();
  });
});
