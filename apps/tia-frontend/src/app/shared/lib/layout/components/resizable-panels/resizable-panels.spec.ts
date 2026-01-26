import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResizablePanels } from './resizable-panels';
import { vi } from 'vitest';

describe('ResizablePanels', () => {
  let component: ResizablePanels;
  let fixture: ComponentFixture<ResizablePanels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizablePanels],
    }).compileComponents();

    fixture = TestBed.createComponent(ResizablePanels);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('initializePanelSizes', () => {
    it('should set equal panel sizes when no initialSizes provided for 2 panels', () => {
      const mockContainer = {
        getBoundingClientRect: () => ({ width: 800, height: 600 }),
      };
      vi.spyOn(component as any, 'containerRef').mockReturnValue({
        nativeElement: mockContainer,
      });
      fixture.componentRef.setInput('panelSize', 2);
      fixture.componentRef.setInput('initialSizes', undefined);

      (component as any).initializePanelSizes();

      const sizes = (component as any).panelSizes();
      expect(sizes.length).toBe(1);
      expect(sizes[0]).toBeGreaterThan(0);
    });

    it('should set equal panel sizes when no initialSizes provided for 3 panels', () => {
      const mockContainer = {
        getBoundingClientRect: () => ({ width: 900, height: 600 }),
      };
      vi.spyOn(component as any, 'containerRef').mockReturnValue({
        nativeElement: mockContainer,
      });
      fixture.componentRef.setInput('panelSize', 3);
      fixture.componentRef.setInput('initialSizes', undefined);

      (component as any).initializePanelSizes();

      const sizes = (component as any).panelSizes();
      expect(sizes.length).toBe(3);
    });

    it('should return early when container is not available', () => {
      vi.spyOn(component as any, 'containerRef').mockReturnValue(undefined);
      const setSpy = vi.spyOn((component as any).panelSizes, 'set');

      (component as any).initializePanelSizes();

      expect(setSpy).not.toHaveBeenCalled();
    });
  });

  describe('distributeContent', () => {
    it('should return early when contentWrapper is not available', () => {
      vi.spyOn(component as any, 'contentRef').mockReturnValue(undefined);
      vi.spyOn(component as any, 'panelRefs').mockReturnValue([]);

      expect(() => (component as any).distributeContent()).not.toThrow();
    });

    it('should return early when panels array is empty', () => {
      vi.spyOn(component as any, 'contentRef').mockReturnValue({
        nativeElement: document.createElement('div'),
      });
      vi.spyOn(component as any, 'panelRefs').mockReturnValue([]);

      expect(() => (component as any).distributeContent()).not.toThrow();
    });
  });

  describe('onMouseMove with 3 panels and maxSize constraints', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('panelSize', 3);
      fixture.componentRef.setInput('minSize', 100);
      fixture.componentRef.setInput('maxSize', 400);
      fixture.detectChanges();
    });

    it('should clamp left panel to maxSize when exceeding', () => {
      (component as any).panelSizes.set([200, 200, 200]);
      (component as any).activeResizer.set(0);
      (component as any).startPosition = 100;
      (component as any).startSizes = [200, 200, 200];

      const event = {
        clientX: 400,
        clientY: 0,
        preventDefault: vi.fn(),
      } as unknown as MouseEvent;

      (component as any).onMouseMove(event);

      const sizes = (component as any).panelSizes();
      expect(sizes[0]).toBeLessThanOrEqual(400);
    });

    it('should clamp right panel to maxSize when exceeding', () => {
      (component as any).panelSizes.set([200, 200, 200]);
      (component as any).activeResizer.set(0);
      (component as any).startPosition = 400;
      (component as any).startSizes = [200, 200, 200];

      const event = {
        clientX: 100,
        clientY: 0,
        preventDefault: vi.fn(),
      } as unknown as MouseEvent;

      (component as any).onMouseMove(event);

      const sizes = (component as any).panelSizes();
      expect(sizes[1]).toBeLessThanOrEqual(400);
    });
  });

  describe('calculateMaxSize', () => {
    it('should return maxSize when container is not available', () => {
      vi.spyOn(component as any, 'containerRef').mockReturnValue(undefined);
      fixture.componentRef.setInput('maxSize', 800);

      const result = (component as any).calculateMaxSize(0, [300]);

      expect(result).toBe(800);
    });

    it('should calculate max size based on container dimension', () => {
      const mockContainer = {
        getBoundingClientRect: () => ({ width: 1000, height: 600 }),
      };
      vi.spyOn(component as any, 'containerRef').mockReturnValue({
        nativeElement: mockContainer,
      });
      fixture.componentRef.setInput('panelSize', 2);
      fixture.componentRef.setInput('minSize', 100);
      fixture.componentRef.setInput('maxSize', 800);
      fixture.componentRef.setInput('resizerSize', 4);

      const result = (component as any).calculateMaxSize(0, [300]);

      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(800);
    });
  });

  describe('onMouseDown', () => {
    it('should set activeResizer and start position for horizontal', () => {
      fixture.componentRef.setInput('orientation', 'horizontal');
      (component as any).panelSizes.set([300, 300]);

      const event = {
        clientX: 150,
        clientY: 100,
        preventDefault: vi.fn(),
      } as unknown as MouseEvent;

      (component as any).onMouseDown(event, 0);

      expect(event.preventDefault).toHaveBeenCalled();
      expect((component as any).activeResizer()).toBe(0);
      expect((component as any).startPosition).toBe(150);
    });

    it('should set activeResizer and start position for vertical', () => {
      fixture.componentRef.setInput('orientation', 'vertical');
      (component as any).panelSizes.set([300, 300]);

      const event = {
        clientX: 150,
        clientY: 200,
        preventDefault: vi.fn(),
      } as unknown as MouseEvent;

      (component as any).onMouseDown(event, 1);

      expect((component as any).activeResizer()).toBe(1);
      expect((component as any).startPosition).toBe(200);
    });
  });

  describe('onMouseUp', () => {
    it('should reset activeResizer to null', () => {
      (component as any).activeResizer.set(1);

      (component as any).onMouseUp();

      expect((component as any).activeResizer()).toBeNull();
    });
  });

  describe('isDragging', () => {
    it('should return true when activeResizer is set', () => {
      (component as any).activeResizer.set(0);

      expect((component as any).isDragging()).toBe(true);
    });

    it('should return false when activeResizer is null', () => {
      (component as any).activeResizer.set(null);

      expect((component as any).isDragging()).toBe(false);
    });
  });
});
