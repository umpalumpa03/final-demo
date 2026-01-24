import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ResizableHorizontal } from './resizable-horizontal';

@Component({
  standalone: true,
  imports: [ResizableHorizontal],
  template: `
    <app-resizable-horizontal [panelSize]="2" [initialWidths]="[200]">
      <div id="panel1">Left Content</div>
      <div id="panel2">Right Content</div>
    </app-resizable-horizontal>
  `,
})
class TestHostComponent {}

describe('ResizableHorizontal', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: ResizableHorizontal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, ResizableHorizontal],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    const debugEl = fixture.debugElement.query(
      (el) => el.componentInstance instanceof ResizableHorizontal,
    );
    component = debugEl.componentInstance;

    fixture.detectChanges();
  });

  it('should set initial panel width from input', () => {
    const firstPanel = fixture.nativeElement.querySelector(
      '.ta-resizable-panel',
    );
    expect(firstPanel.style.width).toBe('200px');
  });

  it('should update width when dragging the resizer', () => {
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
    expect(firstPanel.style.width).toBe('250px');
  });

  it('should stop resizing on mouseup', () => {
    const resizer = fixture.nativeElement.querySelector(
      '.ta-resizable-resizer',
    );

    resizer.dispatchEvent(new MouseEvent('mousedown', { clientX: 100 }));
    document.dispatchEvent(new MouseEvent('mouseup'));
    fixture.detectChanges();

    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 200 }));
    fixture.detectChanges();

    const firstPanel = fixture.nativeElement.querySelector(
      '.ta-resizable-panel',
    );
    expect(firstPanel.style.width).toBe('200px');
  });
});
