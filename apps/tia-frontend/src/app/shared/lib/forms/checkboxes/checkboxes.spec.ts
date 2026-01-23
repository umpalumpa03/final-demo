import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Checkboxes } from './checkboxes';
import { By } from '@angular/platform-browser';

describe('Checkboxes', () => {
  let component: Checkboxes;
  let fixture: ComponentFixture<Checkboxes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkboxes],
    }).compileComponents();

    fixture = TestBed.createComponent(Checkboxes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update value and emit changes on input event', () => {
    let outputValue: boolean | undefined;
    component.checkedChange.subscribe((val) => (outputValue = val));

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

    inputEl.checked = true;
    inputEl.dispatchEvent(new Event('change'));

    expect(component['value']()).toBe(true);
    expect(outputValue).toBe(true);
  });

  it('should sync internal value from checked input and handle disabled state', () => {
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();
    expect(component['value']()).toBe(true);
    expect(component['isDisabled']()).toBe(false);

    fixture.componentRef.setInput('config', { disabled: true });
    fixture.detectChanges();
    expect(component['isDisabled']()).toBe(true);
  });
});
