import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ResizableHorizontal } from './resizable-horizontal';

// We need a test host to project content into the component
@Component({
  standalone: true,
  imports: [ResizableHorizontal],
  template: `
    <app-resizable-horizontal [panelSize]="2" [initialWidths]="[200]">
      <div id="panel1">Left Content</div>
      <div id="panel2">Right Content</div>
    </app-resizable-horizontal>
  `
})
class TestHostComponent {}

describe('ResizableHorizontal', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: ResizableHorizontal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, ResizableHorizontal]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    // Access the actual component instance from the host
    const debugEl = fixture.debugElement.query(el => el.componentInstance instanceof ResizableHorizontal);
    component = debugEl.componentInstance;
    
    fixture.detectChanges(); // Triggers afterNextRender logic
  });

  it('should distribute projected content into panels', () => {
    const panels = fixture.nativeElement.querySelectorAll('.panel');
    expect(panels.length).toBe(2);
    expect(panels[0].textContent).toContain('Left Content');
    expect(panels[1].textContent).toContain('Right Content');
  });

  it('should set initial panel width from input', () => {
    const firstPanel = fixture.nativeElement.querySelector('.panel');
    // Using inline style check since width is bound to [style.width]
    expect(firstPanel.style.width).toBe('200px');
  });

  it('should update width when dragging the resizer', () => {
    const resizer = fixture.nativeElement.querySelector('.resizer');
    
    // 1. Simulate Mouse Down
    const mouseDown = new MouseEvent('mousedown', { clientX: 100 });
    resizer.dispatchEvent(mouseDown);
    
    // 2. Simulate Mouse Move (Move 50px to the right)
    const mouseMove = new MouseEvent('mousemove', { clientX: 150 });
    document.dispatchEvent(mouseMove);
    fixture.detectChanges();

    // Initial 200px + 50px move = 250px
    const firstPanel = fixture.nativeElement.querySelector('.panel');
    expect(firstPanel.style.width).toBe('250px');
  });

  it('should respect minWidth constraint', () => {
    // Set minWidth to 100 via componentRef if needed, but here we use default 100
    const resizer = fixture.nativeElement.querySelector('.resizer');
    
    // Mouse down at 100
    resizer.dispatchEvent(new MouseEvent('mousedown', { clientX: 100 }));
    
    // Move mouse far to the left to try to make width 0
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: -500 }));
    fixture.detectChanges();

    const firstPanel = fixture.nativeElement.querySelector('.panel');
    expect(firstPanel.style.width).toBe('100px'); // Clamped to minWidth
  });

  it('should stop resizing on mouseup', () => {
    const resizer = fixture.nativeElement.querySelector('.resizer');
    
    // Start drag
    resizer.dispatchEvent(new MouseEvent('mousedown', { clientX: 100 }));
    // Release
    document.dispatchEvent(new MouseEvent('mouseup'));
    fixture.detectChanges();

    // Move mouse again
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 200 }));
    fixture.detectChanges();

    // Width should not have changed from initial 200px
    const firstPanel = fixture.nativeElement.querySelector('.panel');
    expect(firstPanel.style.width).toBe('200px');
  });
});