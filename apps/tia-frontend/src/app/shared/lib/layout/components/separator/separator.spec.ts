import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Separator } from './separator';

describe('Separator', () => {
  let component: Separator;
  let fixture: ComponentFixture<Separator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Separator]
    }).compileComponents();

    fixture = TestBed.createComponent(Separator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should apply horizontal class by default', () => {
    const hostElement = fixture.nativeElement;
    expect(hostElement.classList).toContain('horizontal');
    expect(hostElement.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('should switch to vertical class when orientation is set', () => {
    // Setting signal input via componentRef
    fixture.componentRef.setInput('orientation', 'vertical');
    fixture.detectChanges();

    const hostElement = fixture.nativeElement;
    expect(hostElement.classList).toContain('vertical');
    expect(hostElement.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('should render the label when provided', () => {
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.detectChanges();

    const labelElement = fixture.nativeElement.querySelector('.label');
    expect(labelElement).toBeTruthy();
    expect(labelElement.textContent).toContain('Test Label');
  });

  it('should not render label elements if label is undefined', () => {
    const labelElement = fixture.nativeElement.querySelector('.label');
    expect(labelElement).toBeNull();
  });

  it('should update CSS variables based on inputs', () => {
    fixture.componentRef.setInput('color', 'red');
    fixture.componentRef.setInput('thickness', '5px');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.separator-container');
    // Using getPropertyValue to check the CSS Variables set via [ngStyle]
    const styles = getComputedStyle(container);
    expect(styles.getPropertyValue('--sep-color')).toBe('red');
    expect(styles.getPropertyValue('--sep-thickness')).toBe('5px');
  });
});