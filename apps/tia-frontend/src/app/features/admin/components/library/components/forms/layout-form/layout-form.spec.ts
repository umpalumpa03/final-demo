import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutForm } from './layout-form';

describe('LayoutForm', () => {
  let component: LayoutForm;
  let fixture: ComponentFixture<LayoutForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutForm],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should emit and reset two column layout on valid submit', () => {
    const emitSpy = vi.spyOn(component.twoColumnLayoutForm, 'emit');

    component.twoColumnLayoutControl.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+15550000000',
    });

    component.submitTwoColomnLayout();

    expect(emitSpy).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+15550000000',
    });

    const raw = component.twoColumnLayoutControl.getRawValue();
    expect(raw.firstName).toBe('');
    expect(raw.lastName).toBe('');
    expect(raw.email).toBe('');
    expect(raw.phone).toBe('');
  });

  it('should not emit two column layout when invalid and mark touched', () => {
    const emitSpy = vi.spyOn(component.twoColumnLayoutForm, 'emit');

    component.twoColumnLayoutControl.setValue({
      firstName: 'J',
      lastName: '',
      email: 'not-an-email',
      phone: '',
    });

    component.submitTwoColomnLayout();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(component.twoColumnLayoutControl.touched).toBeTruthy();
  });

  it('should emit and reset horizontal layout on valid submit', () => {
    const emitSpy = vi.spyOn(component.horizontalLayoutForm, 'emit');

    component.horizontalForm.setValue({
      firstName: 'Alice',
      email: 'alice@example.com',
      message: 'Hello',
    });

    component.submitHorizontalLayout();

    expect(emitSpy).toHaveBeenCalledWith({
      firstName: 'Alice',
      email: 'alice@example.com',
      message: 'Hello',
    });

    const raw = component.horizontalForm.getRawValue();
    expect(raw.firstName).toBe('');
    expect(raw.email).toBe('');
    expect(raw.message).toBe('');
  });

  it('should not emit horizontal layout when invalid and mark touched', () => {
    const emitSpy = vi.spyOn(component.horizontalLayoutForm, 'emit');

    component.horizontalForm.setValue({
      firstName: '',
      email: 'invalid',
      message: '',
    });

    component.submitHorizontalLayout();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(component.horizontalForm.touched).toBeTruthy();
  });
});
