import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorSwitch } from './color-switch';
import { By } from '@angular/platform-browser';

describe('ColorSwitch', () => {
  let component: ColorSwitch;
  let fixture: ComponentFixture<ColorSwitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorSwitch],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorSwitch);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('color', 'default-blue');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply the correct color class based on input', () => {
    const testColor = 'ocean-blue';

    fixture.componentRef.setInput('color', testColor);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.classList).toContain(testColor);
  });

  it('should show active state when isActive is true', () => {
    fixture.componentRef.setInput('isActive', true);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    const innerDiv = fixture.debugElement.query(By.css('button > div'));

    expect(button.nativeElement.classList).toContain('active');
    expect(innerDiv).toBeTruthy();
  });

  it('should hide content when isActive is false', () => {
    fixture.componentRef.setInput('isActive', false);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    const innerDiv = fixture.debugElement.query(By.css('button > div'));

    expect(button.nativeElement.classList).not.toContain('active');
    expect(innerDiv).toBeNull();
  });
});
