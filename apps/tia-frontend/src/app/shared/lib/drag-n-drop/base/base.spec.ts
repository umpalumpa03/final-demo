import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { DragBase } from './base';

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

  public triggerPointerUp(): void {
    this.onPointerUp();
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
