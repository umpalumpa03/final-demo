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

  it('should emit selected color when clicked', () => {
    const testColor = 'red';
    fixture.componentRef.setInput('color', testColor);
    fixture.detectChanges();

    let emittedValue: string | undefined;
    component.selected.subscribe((value) => (emittedValue = value));

    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);

    expect(emittedValue).toBe(testColor);
  });
});
