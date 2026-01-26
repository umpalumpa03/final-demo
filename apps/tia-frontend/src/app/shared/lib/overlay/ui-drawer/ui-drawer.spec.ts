import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiDrawer } from './ui-drawer';
import { vi, describe, beforeEach, it, expect } from 'vitest';

if (typeof PointerEvent === 'undefined') {
  global.PointerEvent = class PointerEvent extends MouseEvent {
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
    }
  } as any;
}

describe('UiDrawer', () => {
  let component: UiDrawer;
  let fixture: ComponentFixture<UiDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiDrawer],
    }).compileComponents();

    fixture = TestBed.createComponent(UiDrawer);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Pointer Logic', () => {
    it('should initialize dragging on handle area', () => {
      const drawerEl = fixture.nativeElement.querySelector('.ui-drawer');
      drawerEl.setPointerCapture = vi.fn();

      const handleArea = fixture.nativeElement.querySelector(
        '.ui-drawer__handle-area',
      );
      const event = new PointerEvent('pointerdown', {
        clientY: 100,
        bubbles: true,
      });

      handleArea.dispatchEvent(event);

      expect(component.isDragging()).toBe(true);
      expect(drawerEl.style.transition).toBe('none');
    });

    it('should ignore pointerdown outside handle area', () => {
      const content = fixture.nativeElement.querySelector(
        '.ui-drawer__content',
      );
      const event = new PointerEvent('pointerdown', {
        clientY: 100,
        bubbles: true,
      });

      content.dispatchEvent(event);

      expect(component.isDragging()).toBe(false);
    });

    it('should update offset on pointermove', () => {
      component['isDragging'].set(true);
      component['startY'] = 100;

      const event = new PointerEvent('pointermove', { clientY: 300 });
      component.onPointerMove(event);

      expect(component.dragOffset()).toBe(200);
      expect(component.transformStyle()).toBe('translateY(200px)');
    });

    it('should prevent negative offset', () => {
      component['isDragging'].set(true);
      component['startY'] = 100;

      const event = new PointerEvent('pointermove', { clientY: 50 });
      component.onPointerMove(event);

      expect(component.dragOffset()).toBe(0);
    });

    it('should snap back when released under 50%', () => {
      const drawerEl = fixture.nativeElement.querySelector('.ui-drawer');
      vi.spyOn(drawerEl, 'offsetHeight', 'get').mockReturnValue(500);

      component['isDragging'].set(true);
      component['dragOffset'].set(100);

      component.onPointerUp();

      expect(component.dragOffset()).toBe(0);
      expect(component.isDragging()).toBe(false);
    });

    it('should close when released over 50%', () => {
      const spy = vi.spyOn(component.closed, 'emit');
      const drawerEl = fixture.nativeElement.querySelector('.ui-drawer');
      vi.spyOn(drawerEl, 'offsetHeight', 'get').mockReturnValue(500);

      component['isDragging'].set(true);
      component['dragOffset'].set(300);

      component.onPointerUp();

      expect(spy).toHaveBeenCalled();
      expect(component.isDragging()).toBe(false);
    });
  });

  describe('State Management', () => {
    it('should reset state via effect when closed', async () => {
      component['dragOffset'].set(150);
      component['isDragging'].set(true);

      fixture.componentRef.setInput('isOpen', false);
      await fixture.whenStable();

      expect(component.dragOffset()).toBe(0);
      expect(component.isDragging()).toBe(false);
    });

    it('should emit closed on escape key', () => {
      const spy = vi.spyOn(component.closed, 'emit');
      fixture.componentRef.setInput('isOpen', true);

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(spy).toHaveBeenCalled();
    });

    it('should not emit closed on escape if already closed', () => {
      const spy = vi.spyOn(component.closed, 'emit');
      fixture.componentRef.setInput('isOpen', false);

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
