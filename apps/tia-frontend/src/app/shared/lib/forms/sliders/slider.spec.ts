import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Slider } from './slider';

describe('Slider', () => {
  let component: Slider;
  let fixture: ComponentFixture<Slider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Slider],
    }).compileComponents();

    fixture = TestBed.createComponent(Slider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update value on input event', () => {
    const inputElement = document.createElement('input');
    inputElement.value = '50';
    const mockEvent = { target: inputElement } as unknown as Event;

    component['onInput'](mockEvent);

    expect(component.value()).toBe(50);
  });

  it('should calculate fill percentage correctly based on min and max', () => {
    fixture.componentRef.setInput('config', { min: 0, max: 200 });
    fixture.componentRef.setInput('value', 100);
    fixture.detectChanges();

    expect(component['fillPercentage']()).toBe(50);

    fixture.componentRef.setInput('value', 0);
    fixture.detectChanges();
    expect(component['fillPercentage']()).toBe(0);
  });
});
