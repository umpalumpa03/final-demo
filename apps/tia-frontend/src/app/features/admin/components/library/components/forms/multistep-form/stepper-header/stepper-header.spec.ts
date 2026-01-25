import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepperHeader } from './stepper-header';

describe('StepperHeader', () => {
  let component: StepperHeader;
  let fixture: ComponentFixture<StepperHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(StepperHeader);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('content', [
      { label: 'From', key: 'from' },
      { label: 'To', key: 'to' },
    ]);
    fixture.componentRef.setInput('step', 1);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('computes states and lines for step 1 and step 2', async () => {
    // initial step is 1 (set in beforeEach)
    expect(component.isActive(0)).toBe(true);
    expect(component.isCompleted(0)).toBe(false);
    expect(component.isLineActive(0)).toBe(false);
    expect(component.showLine(0)).toBe(true);
    expect(component.showLine(1)).toBe(false);

    // move to step 2 and re-evaluate
    fixture.componentRef.setInput('step', 2);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isActive(1)).toBe(true);
    expect(component.isCompleted(0)).toBe(true);
    expect(component.isLineActive(0)).toBe(true);
    expect(component.showLine(0)).toBe(true);
    expect(component.showLine(1)).toBe(false);
  });

  it('handles single-item content', async () => {
    fixture.componentRef.setInput('content', [{ label: 'Only', key: 'only' }]);
    fixture.componentRef.setInput('step', 1);
    fixture.detectChanges();
    await fixture.whenStable();

    // single item: index 0 is active, no line should be shown
    expect(component.isActive(0)).toBe(true);
    expect(component.isCompleted(0)).toBe(false);
    expect(component.isLineActive(0)).toBe(false);
    expect(component.showLine(0)).toBe(false);
  });

  it('handles empty content gracefully', async () => {
    fixture.componentRef.setInput('content', []);
    fixture.componentRef.setInput('step', 1);
    fixture.detectChanges();
    await fixture.whenStable();

    // empty content: showLine should be false for index 0 and methods should not throw
    expect(component.showLine(0)).toBe(false);
    expect(component.isCompleted(0)).toBe(false);
    expect(component.isActive(0)).toBe(false);
    expect(component.isLineActive(0)).toBe(false);
  });
});
