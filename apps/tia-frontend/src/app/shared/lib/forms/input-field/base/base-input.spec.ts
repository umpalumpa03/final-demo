import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BaseInput } from './base-input';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@tia/shared/lib/forms/input-field/base/utils/input.util', () => ({
  getValidationErrorMessage: () => 'MOCK_ERROR',
}));

@Component({
  selector: 'test-input',
  template: '',
  providers: [{ provide: NgControl, useValue: null }],
})
class TestInput extends BaseInput {}

describe('BaseInput', () => {
  let component: TestInput;
  let fixture: ComponentFixture<TestInput>;

  const mockInputEvent = (
    value: string,
    type: string = 'text',
    files: FileList | null = null,
  ) =>
    ({
      target: {
        value,
        type,
        files,
      },
    }) as unknown as Event;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestInput],
    }).compileComponents();

    fixture = TestBed.createComponent(TestInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should handle value writes and null normalization', () => {
    component.writeValue('test');
    expect(component['value']()).toBe('test');

    component.writeValue(null);
    expect(component['value']()).toBe('');
  });

  it('should handle input events, parsing, and propagation', () => {
    const spy = vi.fn();
    component.registerOnChange(spy);

    component['handleInput'](mockInputEvent('hello'));
    expect(spy).toHaveBeenCalledWith('hello');
    expect(component['value']()).toBe('hello');

    fixture.componentRef.setInput('type', 'number');
    fixture.detectChanges();

    component['handleInput'](mockInputEvent('42', 'number'));
    expect(spy).toHaveBeenCalledWith(42);

    component['handleInput'](mockInputEvent('', 'number'));
    expect(component['value']()).toBeNull();
  });

  it('should handle blur and touch state', () => {
    const spy = vi.fn();
    component.registerOnTouched(spy);

    component['handleBlur']({} as FocusEvent);
    expect(spy).toHaveBeenCalled();
    expect(component['touched']()).toBe(true);
  });

  it('should compute disabled and readonly states correctly', () => {
    component.setDisabledState(true);
    expect(component['isDisabled']()).toBe(true);

    component.setDisabledState(false);
    fixture.componentRef.setInput('state', 'disabled');
    expect(component['isDisabled']()).toBe(true);
  });

  it('should compute validation messages and success state', () => {
    fixture.componentRef.setInput('config', { errorMessage: 'Config Error' });
    expect(component['errorMessage']()).toBe('Config Error');

    fixture.componentRef.setInput('state', 'success');
    component.writeValue('');
    expect(component['hasSuccess']()).toBe(false);

    component.writeValue('valid');
    expect(component['hasSuccess']()).toBe(true);
  });

  it('should handle focus events and emit outputs', () => {
    const focusSpy = vi.fn();
    component.focus.subscribe(focusSpy);
    component['handleFocus']({} as FocusEvent);
    expect(component['focused']()).toBe(true);
    expect(focusSpy).toHaveBeenCalled();
  });

  it('should compute readonly state and handle file inputs', () => {
    fixture.componentRef.setInput('config', { readonly: true });
    expect(component['isReadonly']()).toBe(true);

    const files = {} as FileList;
    const event = mockInputEvent('', 'file', files);

    const parsed = component['parseInputValue'](
      event.target as HTMLInputElement,
    );
    expect(parsed).toBe(files);
  });

  it('should set validation errors and emit validation changes', () => {
    const validationSpy = vi.fn();
    component.validationChange.subscribe(validationSpy);
    component['setValidationErrors']([{ type: 'test', message: 'Error' }]);
    expect(validationSpy).toHaveBeenCalled();
  });
});
