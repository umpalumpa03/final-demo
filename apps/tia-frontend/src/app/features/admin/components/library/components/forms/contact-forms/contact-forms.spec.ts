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

  it('should mark all fields as touched when submitting invalid form', () => {
    expect(component.name.touched).toBe(false);
    expect(component.email.touched).toBe(false);
    expect(component.message.touched).toBe(false);
    expect(component.subscribe.touched).toBe(false);

    component.submit();

    expect(component.name.touched).toBe(true);
    expect(component.email.touched).toBe(true);
    expect(component.message.touched).toBe(true);
    expect(component.subscribe.touched).toBe(true);
  });
  //     expect(component.name).toBe(component.contactForm.controls.name);
  //     expect(component.email).toBe(component.contactForm.controls.email);
  //     expect(component.message).toBe(component.contactForm.controls.message);
  //     expect(component.subscribe).toBe(component.contactForm.controls.subscribe);
  //   });
  // });
});
