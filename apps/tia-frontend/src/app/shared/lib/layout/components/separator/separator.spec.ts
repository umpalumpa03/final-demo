import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Separator } from './separator';

describe('Separator', () => {
  let component: Separator;
  let fixture: ComponentFixture<Separator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Separator],
    }).compileComponents();

    fixture = TestBed.createComponent(Separator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should apply horizontal class by default', () => {
    const separatorElement =
      fixture.nativeElement.querySelector('.ta-separator');
    expect(separatorElement.classList).toContain('separator--horizontal');
  });

  it('should switch to vertical class when orientation is set', () => {
    fixture.componentRef.setInput('orientation', 'vertical');
    fixture.detectChanges();

    const separatorElement =
      fixture.nativeElement.querySelector('.ta-separator');
    expect(separatorElement.classList).toContain('separator--vertical');
  });

  it('should render the label when provided', () => {
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.detectChanges();

    const labelElement = fixture.nativeElement.querySelector(
      '.ta-separator-label',
    );
    expect(labelElement).toBeTruthy();
    expect(labelElement.textContent).toContain('Test Label');
  });

  it('should not render label elements if label is undefined', () => {
    const labelElement = fixture.nativeElement.querySelector(
      '.ta-separator-label',
    );
    expect(labelElement).toBeNull();
  });

  it('should update CSS variables based on inputs', () => {
    fixture.componentRef.setInput('thickness', '5px');
    fixture.detectChanges();

    const separatorElement =
      fixture.nativeElement.querySelector('.ta-separator');
    expect(separatorElement.style.getPropertyValue('--sep-thickness')).toBe(
      '5px',
    );
  });
});
