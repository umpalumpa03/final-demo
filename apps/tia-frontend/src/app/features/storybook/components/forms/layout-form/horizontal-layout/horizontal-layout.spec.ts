import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HorizontalLayout } from './horizontal-layout';

describe('HorizontalLayout', () => {
  let fixture: ComponentFixture<HorizontalLayout>;
  let component: HorizontalLayout;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(HorizontalLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('emits value and resets when form is valid', () => {
    const spy = vi.spyOn(component.horizontalLayoutForm, 'emit');
    const value = {
      firstName: 'Jane',
      email: 'jane@example.com',
      message: 'hello',
    };

    component.horizontalForm.setValue(value);
    component.submitHorizontalLayout();

    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(value);
    expect(component.horizontalForm.value.firstName).toBe('');
  });
});
