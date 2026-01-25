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

describe('ResizablePanels', () => {
  describe('Horizontal orientation', () => {
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
  });

  describe('Vertical orientation', () => {
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
  });
});
