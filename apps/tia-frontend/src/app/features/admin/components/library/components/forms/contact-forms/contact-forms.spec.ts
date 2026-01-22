import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ContactForms } from './contact-forms';

describe('ContactForms', () => {
  let component: ContactForms;
  let fixture: ComponentFixture<ContactForms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactForms],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactForms);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('form should be invalid initially', () => {
    expect(component.contactForm.valid).toBe(false);
    expect(component.name.valid).toBe(false);
    expect(component.email.valid).toBe(false);
    expect(component.message.valid).toBe(false);
    expect(component.subscribe.value).toBe(false);
  });

  it('should emit payload and reset when form valid on submit', () => {
    vi.spyOn(component.submitForm, 'emit');

    component.contactForm.setValue({
      name: 'Test',
      email: 'Test@test.com',
      message: 'A'.repeat(50),
      subscribe: true,
    });

    expect(component.contactForm.valid).toBe(true);

    component.submit();

    expect(component.submitForm.emit).toHaveBeenCalledWith({
      name: 'Test',
      email: 'Test@test.com',
      message: 'A'.repeat(50),
      subscribe: true,
    });

    expect(component.contactForm.pristine).toBe(true);
    expect(component.contactForm.getRawValue().subscribe).toBe(false);
  });

  it('should not emit when form invalid', () => {
    vi.spyOn(component.submitForm, 'emit');
    component.submit();
    expect(component.submitForm.emit).not.toHaveBeenCalled();
  });
});
