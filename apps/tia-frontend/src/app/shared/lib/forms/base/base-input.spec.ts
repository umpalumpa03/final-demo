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
    type = 'text',
    files: FileList | null = null,
  ) => ({ target: { value, type, files } }) as unknown as Event;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestInput],
    }).compileComponents();

    fixture = TestBed.createComponent(TestInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should handle CVA writes and null normalization', () => {
    component.writeValue('test-value');
    expect(component['value']()).toBe('test-value');

    component.writeValue(null);
    expect(component['value']()).toBe('');
  });

  it('should parse inputs correctly (Text, Number, File) and propagate changes', () => {
    const changeSpy = vi.fn();
    component.registerOnChange(changeSpy);

    component['handleInput'](mockInputEvent('hello'));
    expect(changeSpy).toHaveBeenCalledWith('hello');

    fixture.componentRef.setInput('type', 'number');
    fixture.detectChanges();
    component['handleInput'](mockInputEvent('42', 'number'));
    expect(changeSpy).toHaveBeenCalledWith(42);

    component['handleInput'](mockInputEvent('', 'number'));
    expect(component['value']()).toBeNull();

    const mockFiles = {} as FileList;
    const parsedFile = component['parseInputValue']({
      value: '',
      type: 'file',
      files: mockFiles,
    } as HTMLInputElement);
    expect(parsedFile).toBe(mockFiles);
  });

  it('should handle lifecycle interactions (Focus, Blur, Disabled)', () => {
    const touchSpy = vi.fn();
    const blurSpy = vi.fn();
    const focusSpy = vi.fn();

    component.registerOnTouched(touchSpy);
    component.blur.subscribe(blurSpy);
    component.focus.subscribe(focusSpy);

    component['handleFocus']({} as FocusEvent);
    expect(component['focused']()).toBe(true);
    expect(focusSpy).toHaveBeenCalled();

    component['handleBlur']({} as FocusEvent);
    expect(component['focused']()).toBe(false);
    expect(component['touched']()).toBe(true);
    expect(touchSpy).toHaveBeenCalled();
    expect(blurSpy).toHaveBeenCalled();

    component.setDisabledState(true);
    expect(component['isDisabled']()).toBe(true);
  });

  it('should compute validation states (Success, Error, Readonly)', () => {
    fixture.componentRef.setInput('config', { readonly: true });
    expect(component['isReadonly']()).toBe(true);

    fixture.componentRef.setInput('config', { errorMessage: 'Custom Error' });
    expect(component['errorMessage']()).toBe('Custom Error');

    fixture.componentRef.setInput('state', 'success');
    fixture.detectChanges();

    component.writeValue('');
    expect(component['hasSuccess']()).toBe(false);

    component.writeValue('valid data');
    expect(component['hasSuccess']()).toBe(true);
  });
});
