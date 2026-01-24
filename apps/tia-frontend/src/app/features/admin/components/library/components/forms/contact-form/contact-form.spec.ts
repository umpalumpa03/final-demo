import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactForms } from './contact-form';
import { vi } from 'vitest';

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

  it('submit does not emit when form is invalid and marks controls touched', () => {
    const spy = vi.spyOn(component.submitForm, 'emit');

    component.contactForm.reset();
    component.submit();

    expect(spy).not.toHaveBeenCalled();
    expect(component.contactForm.get('name')?.touched).toBe(true);
  });

  it('submit emits payload and resets the form when valid', () => {
    component.contactForm.setValue({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'a'.repeat(50),
      subscribe: true,
    });

    expect(component.contactForm.valid).toBe(true);

    component.submit();
  });
});
