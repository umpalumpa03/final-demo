import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, Validators, NgControl } from '@angular/forms';
import { BaseInput } from './base-input';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@tia/shared/lib/forms/input-field/base/utils/input.util', () => ({
  getValidationErrorMessage: (errors: any) => {
    if (!errors) return '';
    if (errors.required) return 'MOCK_REQUIRED';
    if (errors.minlength) return 'MOCK_MINLENGTH';
    return 'MOCK_ERROR';
  },
}));

@Component({
  selector: 'test-input',
  template: '',
  providers: [{ provide: NgControl, useValue: null }],
})
class TestInputImplementation extends BaseInput {}

describe('BaseInput Logic (No DOM)', () => {
  let component: TestInputImplementation;
  let fixture: ComponentFixture<TestInputImplementation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestInputImplementation],
    }).compileComponents();

    fixture = TestBed.createComponent(TestInputImplementation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should write value directly to signal', () => {
    component.writeValue('test-value');
    expect(component['value']()).toBe('test-value');
  });

  it('should handle null value in writeValue', () => {
    component.writeValue(null);
    expect(component['value']()).toBe('');
  });

  it('should register onChange and call it on input', () => {
    const onChangeSpy = vi.fn();
    component.registerOnChange(onChangeSpy);

    const mockEvent = { target: { value: 'new-val', files: null } } as any;
    component['handleInput'](mockEvent);

    expect(onChangeSpy).toHaveBeenCalledWith('new-val');
    expect(component['value']()).toBe('new-val');
  });

  it('should register onTouched and call it on blur', () => {
    const onTouchedSpy = vi.fn();
    component.registerOnTouched(onTouchedSpy);

    component['handleBlur']({} as FocusEvent);

    expect(onTouchedSpy).toHaveBeenCalled();
    expect(component['touched']()).toBe(true);
  });

  it('should handle focus', () => {
    const focusSpy = vi.fn();
    component.focus.subscribe(focusSpy);

    component['handleFocus']({} as FocusEvent);

    expect(component['focused']()).toBe(true);
    expect(focusSpy).toHaveBeenCalled();
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component['isDisabled']()).toBe(true);

    expect(component['fieldClasses']()).toContain(
      'text-input__field--disabled',
    );
  });

  it('should parse number type correctly', () => {
    fixture.componentRef.setInput('type', 'number');
    fixture.detectChanges();

    const mockEvent = { target: { value: '42' } } as any;
    component['handleInput'](mockEvent);

    expect(component['value']()).toBe(42);
  });

  it('should return null for empty number input', () => {
    fixture.componentRef.setInput('type', 'number');
    fixture.detectChanges();

    const mockEvent = { target: { value: '' } } as any;
    component['handleInput'](mockEvent);

    expect(component['value']()).toBe(null);
  });

  it('should return correct CSS classes for size and state', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.componentRef.setInput('state', 'error');
    fixture.detectChanges();

    expect(component['containerClasses']()).toContain('text-input--large');
    expect(component['fieldClasses']()).toContain('text-input__field--error');
  });

  it('should use error message from config if provided', () => {
    fixture.componentRef.setInput('config', {
      errorMessage: 'Custom Config Error',
    });
    fixture.detectChanges();

    expect(component['errorMessage']()).toBe('Custom Config Error');
  });

  it('should use utility function for ngControl errors', () => {
    const mockControl = new FormControl('', Validators.required);
    mockControl.markAsTouched();

    (component as any).ngControl = { control: mockControl };

    component.ngOnInit();
    mockControl.updateValueAndValidity();

    expect(component['errorMessage']()).toBe('MOCK_REQUIRED');
  });

  it('should use internal validation errors if no ngControl', () => {
    (component as any).ngControl = null;

    component['setValidationErrors']([
      { type: 'manual', message: 'Internal Error' },
    ]);

    expect(component['errorMessage']()).toBe('Internal Error');
  });

  it('should emit validationChange', () => {
    let emittedResult: any;
    component.validationChange.subscribe((res) => (emittedResult = res));

    component['setValidationErrors']([{ type: 'manual', message: 'Err' }]);

    expect(emittedResult.isValid).toBe(false);
  });

  it('should not show success if value is empty', () => {
    fixture.componentRef.setInput('state', 'success');
    component.writeValue('');
    fixture.detectChanges();

    expect(component['hasSuccess']()).toBe(false);
  });
});
