import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ResizablePanels } from './resizable-panels';

@Component({
  imports: [ResizablePanels],
  template: `
    <app-resizable-panels [panelSize]="2" [initialSizes]="[200]">
      <div id="panel1">Left Content</div>
      <div id="panel2">Right Content</div>
    </app-resizable-panels>
  `,
})
class TestHostComponent {}

@Component({
  imports: [ResizablePanels],
  template: `
    <app-resizable-panels
      orientation="vertical"
      [panelSize]="2"
      [initialSizes]="[150]"
    >
      <div id="panel1">Top Content</div>
      <div id="panel2">Bottom Content</div>
    </app-resizable-panels>
  `,
})
class TestVerticalHostComponent {}

@Component({
  imports: [ResizablePanels],
  template: `
    <app-resizable-panels [panelSize]="3" [initialSizes]="[200, 200]">
      <div id="panel1">Left</div>
      <div id="panel2">Center</div>
      <div id="panel3">Right</div>
    </app-resizable-panels>
  `,
})
class TestThreePanelHostComponent {}

describe('ResizablePanels', () => {
  describe('Horizontal orientation (2 panels)', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: ResizablePanels;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestHostComponent, ResizablePanels],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      const debugEl = fixture.debugElement.query(
        (el) => el.componentInstance instanceof ResizablePanels,
      );
      component = debugEl.componentInstance;

      fixture.detectChanges();
    });

    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should set initial panel size from input', () => {
      const firstPanel = fixture.nativeElement.querySelector(
        '.ta-resizable-panel',
      );
      expect(firstPanel.style.getPropertyValue('--panel-size')).toBe('200px');
    });

    it('should update panel size when dragging the resizer horizontally', () => {
      const resizer = fixture.nativeElement.querySelector(
        '.ta-resizable-resizer',
      );

      const mouseDown = new MouseEvent('mousedown', { clientX: 100 });
      resizer.dispatchEvent(mouseDown);

      const mouseMove = new MouseEvent('mousemove', { clientX: 150 });
      document.dispatchEvent(mouseMove);
      fixture.detectChanges();

      const firstPanel = fixture.nativeElement.querySelector(
        '.ta-resizable-panel',
      );
      expect(firstPanel.style.getPropertyValue('--panel-size')).toBe('250px');
    });

    it('should return "auto" for last panel in 2-panel mode', () => {
      expect(component['getPanelSize'](1)).toBe('auto');
    });

    it('should return pixel value for first panel', () => {
      expect(component['getPanelSize'](0)).toBe('200px');
    });

    it('should identify last panel correctly in 2-panel mode', () => {
      expect(component['isLastPanel'](0)).toBe(false);
      expect(component['isLastPanel'](1)).toBe(true);
    });

    it('should show resizer after first panel only', () => {
      expect(component['showResizerAfter'](0)).toBe(true);
      expect(component['showResizerAfter'](1)).toBe(false);
    });

    it('should not be dragging initially', () => {
      expect(component['isDragging']()).toBe(false);
    });

    it('should set active resizer on mouse down', () => {
      const resizer = fixture.nativeElement.querySelector(
        '.ta-resizable-resizer',
      );
      const mouseDown = new MouseEvent('mousedown', { clientX: 100 });
      resizer.dispatchEvent(mouseDown);

      expect(component['isDragging']()).toBe(true);
      expect(component['isResizerDragging'](0)).toBe(true);
    });

    it('should clear active resizer on mouse up', () => {
      const resizer = fixture.nativeElement.querySelector(
        '.ta-resizable-resizer',
      );
      const mouseDown = new MouseEvent('mousedown', { clientX: 100 });
      resizer.dispatchEvent(mouseDown);

      component['onMouseUp']();

      expect(component['isDragging']()).toBe(false);
    });
  });

  describe('Vertical orientation (2 panels)', () => {
    let fixture: ComponentFixture<TestVerticalHostComponent>;
    let component: ResizablePanels;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestVerticalHostComponent, ResizablePanels],
      }).compileComponents();

      fixture = TestBed.createComponent(TestVerticalHostComponent);
      const debugEl = fixture.debugElement.query(
        (el) => el.componentInstance instanceof ResizablePanels,
      );
      component = debugEl.componentInstance;

      fixture.detectChanges();
    });

    it('should apply vertical modifier class', () => {
      const container = fixture.nativeElement.querySelector('.ta-resizable');
      expect(container.classList.contains('resizable--vertical')).toBe(true);
    });

    it('should set initial panel size from input', () => {
      const firstPanel = fixture.nativeElement.querySelector(
        '.ta-resizable-panel',
      );
      expect(firstPanel.style.getPropertyValue('--panel-size')).toBe('150px');
    });

    it('should compute isVertical as true', () => {
      expect(component['isVertical']()).toBe(true);
    });
  });

  describe('Three panel mode', () => {
    let fixture: ComponentFixture<TestThreePanelHostComponent>;
    let component: ResizablePanels;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestThreePanelHostComponent, ResizablePanels],
      }).compileComponents();

      fixture = TestBed.createComponent(TestThreePanelHostComponent);
      const debugEl = fixture.debugElement.query(
        (el) => el.componentInstance instanceof ResizablePanels,
      );
      component = debugEl.componentInstance;

      fixture.detectChanges();
    });

    it('should render 3 panels', () => {
      const panels = fixture.nativeElement.querySelectorAll(
        '.ta-resizable-panel',
      );
      expect(panels.length).toBe(3);
    });

    it('should render 2 resizers for 3 panels', () => {
      const resizers = fixture.nativeElement.querySelectorAll(
        '.ta-resizable-resizer',
      );
      expect(resizers.length).toBe(2);
    });

    it('should not identify any panel as last in 3-panel mode (flex)', () => {
      expect(component['isLastPanel'](0)).toBe(false);
      expect(component['isLastPanel'](1)).toBe(false);
      expect(component['isLastPanel'](2)).toBe(false);
    });

    it('should identify last panel in three mode correctly', () => {
      expect(component['isLastPanelInThreeMode'](0)).toBe(false);
      expect(component['isLastPanelInThreeMode'](1)).toBe(false);
      expect(component['isLastPanelInThreeMode'](2)).toBe(true);
    });

    it('should generate correct panel indices', () => {
      expect(component['panelIndices']()).toEqual([0, 1, 2]);
    });
  });
});
