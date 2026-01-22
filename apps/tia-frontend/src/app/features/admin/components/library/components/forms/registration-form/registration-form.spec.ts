import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationForm } from './registration-form';
import { COUNTRIES } from '../models/contact-forms.model';

describe('RegistrationForm', () => {
  let component: RegistrationForm;
  let fixture: ComponentFixture<RegistrationForm>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationForm],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationForm);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
