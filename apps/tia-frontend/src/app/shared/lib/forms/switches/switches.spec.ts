import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Switches } from './switches';
import { By } from '@angular/platform-browser';

describe('Switches', () => {
  let component: Switches;
  let fixture: ComponentFixture<Switches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Switches],
    }).compileComponents();

    fixture = TestBed.createComponent(Switches);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update value and emit output on user interaction', () => {
    let emittedValue: boolean | undefined;
    component.checked.subscribe((val) => (emittedValue = val));

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    inputEl.checked = true;
    inputEl.dispatchEvent(new Event('change'));

    expect(component['value']()).toBe(true);
    expect(emittedValue).toBe(true);
  });

  it('should sync checked input and respect disabled config', () => {
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();
    expect(component['value']()).toBe(true);
    expect(component['isDisabled']()).toBe(false);

    fixture.componentRef.setInput('config', { disabled: true });
    fixture.detectChanges();

    expect(component['isDisabled']()).toBe(true);
  });
});
