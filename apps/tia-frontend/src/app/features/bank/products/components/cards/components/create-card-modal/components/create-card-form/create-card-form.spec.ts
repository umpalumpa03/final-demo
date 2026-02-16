import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateCardForm } from './create-card-form';
import { CardForm } from 'apps/tia-frontend/src/app/features/bank/products/components/cards/models/card-form.model';
import { TranslateModule } from '@ngx-translate/core';

describe('CreateCardForm', () => {
  let component: CreateCardForm;
  let fixture: ComponentFixture<CreateCardForm>;
  let formGroup: FormGroup<CardForm>;

  beforeEach(() => {
    const fb = new FormBuilder();
    formGroup = fb.group({
      cardName: fb.nonNullable.control('Test'),
      cardCategory: fb.nonNullable.control<'DEBIT' | 'CREDIT'>('DEBIT'),
      cardType: fb.nonNullable.control<'VISA' | 'MASTERCARD'>('VISA'),
      accountId: fb.nonNullable.control('acc-1'),
      design: fb.nonNullable.control('design-1'),
    });

    TestBed.configureTestingModule({
      imports: [CreateCardForm, TranslateModule.forRoot()],
    });

    fixture = TestBed.createComponent(CreateCardForm);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('formGroup', formGroup);
    fixture.componentRef.setInput('categoryOptions', []);
    fixture.componentRef.setInput('typeOptions', []);
    fixture.componentRef.setInput('accountOptions', []);
    fixture.componentRef.setInput('isCreating', false);
  });
  it('should emit formSubmit when form is valid', () => {
    const emitSpy = vi.fn();
    component.formSubmit.subscribe(emitSpy);
    fixture.componentRef.setInput('formConfigs', {
      cardName: { placeholder: 'Enter text' },
      accountId: { placeholder: 'Choose option' },
    });

    component['onSubmit']();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit formCancel on cancel', () => {
    const emitSpy = vi.fn();
    component.formCancel.subscribe(emitSpy);

    component['onCancel']();

    expect(emitSpy).toHaveBeenCalled();
  });
//   it('should not emit formSubmit when form is invalid', () => {
//   formGroup.patchValue({ cardName: '', accountId: '' });
//   formGroup.markAsTouched();
  
//   const emitSpy = vi.fn();
//   component.formSubmit.subscribe(emitSpy);

//   component['onSubmit']();

//   expect(emitSpy).not.toHaveBeenCalled();
// });
});
