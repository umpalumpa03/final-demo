import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InlineForm } from './inline-form';

describe('InlineForm', () => {
  let component: InlineForm;
  let fixture: ComponentFixture<InlineForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InlineForm],
    }).compileComponents();

    fixture = TestBed.createComponent(InlineForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as touched and not emit when invalid', () => {
    const emitSpy = vi.spyOn(component.submitInlineForm, 'emit');

    expect(component.inlineForm.invalid).toBe(true);

    component.submit();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(component.inlineForm.get('email')?.touched).toBe(true);
  });

  it('should emit email and reset form when valid', () => {
    const emitSpy = vi.spyOn(component.submitInlineForm, 'emit');

    component.inlineForm.setValue({ email: 'user@example.com' });
    expect(component.inlineForm.valid).toBe(true);

    component.submit();

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith('user@example.com');

    expect(component.inlineForm.invalid).toBe(true);
    expect(component.inlineForm.get('email')?.value).toBe('');
  });
});
