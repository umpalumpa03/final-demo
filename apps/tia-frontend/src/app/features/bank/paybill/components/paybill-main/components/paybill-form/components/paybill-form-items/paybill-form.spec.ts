import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PaybillForm } from './paybill-form';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { EventEmitter } from '@angular/core';

describe('PaybillForm', () => {
  let component: PaybillForm;
  let fixture: ComponentFixture<PaybillForm>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillForm, TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [TranslateService, provideMockStore({})],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillForm);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
    fixture.componentRef.setInput(
      'paybillForm',
      new FormGroup({
        amount: new FormControl(0, Validators.required),
        accountNumber: new FormControl('', Validators.required),
      }),
    );
    fixture.componentRef.setInput('fields', []);

    fixture.detectChanges();
  });

  describe('Computed Signals', () => {
    it('should compute isVerified as true when verifiedDetails is valid', () => {
      fixture.componentRef.setInput('verifiedDetails', { valid: true });
      expect(component.isVerified()).toBe(true);
    });

    it('should compute isVerified as false when verifiedDetails is null or invalid', () => {
      fixture.componentRef.setInput('verifiedDetails', null);
      expect(component.isVerified()).toBe(false);
    });
  });

  describe('onSaveTemplate', () => {
    it('should emit saveTemplate with provider name', () => {
      const emitSpy = vi.spyOn(component.saveTemplate, 'emit');
      fixture.componentRef.setInput('provider', { name: 'Test Provider' });

      component.onSaveTemplate();
      expect(emitSpy).toHaveBeenCalledWith('Test Provider');
    });

    it('should emit empty string if no provider is present', () => {
      const emitSpy = vi.spyOn(component.saveTemplate, 'emit');
      fixture.componentRef.setInput('provider', null);

      component.onSaveTemplate();
      expect(emitSpy).toHaveBeenCalledWith('');
    });
  });

  describe('onSubmit', () => {
    it('should return early if isLoading is true', () => {
      const verifySpy = vi.spyOn(component.verify, 'emit');
      fixture.componentRef.setInput('isLoading', true);

      component.onSubmit();
      expect(verifySpy).not.toHaveBeenCalled();
    });

    it('should mark all as touched if form is invalid and not verified', () => {
      const form = component.paybillForm();
      const markSpy = vi.spyOn(form, 'markAllAsTouched');
      form.get('accountNumber')?.setValue('');

      component.onSubmit();
      expect(markSpy).toHaveBeenCalled();
    });

    it('should emit verify event when form is valid but not yet verified', () => {
      const verifySpy = vi.spyOn(component.verify, 'emit');
      const form = component.paybillForm();
      form.patchValue({ amount: 100, accountNumber: '12345' });
      fixture.componentRef.setInput('verifiedDetails', null);

      component.onSubmit();
      expect(verifySpy).toHaveBeenCalledWith({ value: form.getRawValue() });
    });

    it('should emit pay event when form is valid and verified', () => {
      const paySpy = vi.spyOn(component.pay, 'emit');
      const form = component.paybillForm();
      form.patchValue({ amount: 500, accountNumber: '12345' });
      fixture.componentRef.setInput('verifiedDetails', { valid: true });

      component.onSubmit();
      expect(paySpy).toHaveBeenCalledWith({
        amount: 500,
        value: form.getRawValue(),
      });
    });
  });

  it('should initialize with correct default values', () => {
    expect(component.isLoading()).toBe(false);
    expect(component.templateGroups()).toEqual([]);
  });
});