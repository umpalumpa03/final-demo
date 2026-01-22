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
});
