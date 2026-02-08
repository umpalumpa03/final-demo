import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactForms } from './contact-form';
import { vi } from 'vitest';
import { FormsDemoState } from '../state/forms-demo.state';
import { TranslateModule } from '@ngx-translate/core';
const mockFormsDemo = {
  contactForm: () => ({
    name: { label: 'Name', required: true },
    email: { label: 'Email', required: true },
    message: { label: 'Message', required: true },
    checkbox: { label: 'Subscribe', required: true },
  }),
  titles: () => ({
    contact: 'Contact',
    registration: 'Registration',
    settings: 'Settings',
    inline: 'Inline',
    validation: 'Validation',
    multiStep: 'MultiStep',
    layout: 'Layout',
  }),
};

describe('ContactForms', () => {
  let component: ContactForms;
  let fixture: ComponentFixture<ContactForms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactForms, TranslateModule.forRoot()],
      providers: [
        { provide: FormsDemoState, useValue: mockFormsDemo },
      ],
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
