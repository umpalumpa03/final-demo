import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BaseInput } from './base-input';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

@Component({
  selector: 'test-input',
  template: `
    <input
      [value]="value()"
      [class]="fieldClasses()"
      [disabled]="isDisabled()"
      (input)="handleInput($event)"
      (blur)="handleBlur($event)"
      (focus)="handleFocus($event)"
    />
    @if (hasError()) {
      <span class="error">{{ errorMessage() }}</span>
    }
  `,
  standalone: true,
  imports: [CommonModule],
})
class TestInputComponent extends BaseInput {}

describe('BaseInput', () => {
  let component: TestInputComponent;
  let fixture: ComponentFixture<TestInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update value through writeValue', () => {
    component.writeValue('test');
    expect(component['value']()).toBe('test');
  });

  it('should handle null in writeValue', () => {
    component.writeValue(null);
    expect(component['value']()).toBe('');
  });

  it('should register and call onChange', () => {
    const fn = vi.fn();
    component.registerOnChange(fn);

    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = 'new';
    input.nativeElement.dispatchEvent(new Event('input'));

    expect(fn).toHaveBeenCalledWith('new');
  });

  it('should mark as touched on blur', () => {
    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.dispatchEvent(new Event('blur'));
    expect(component['touched']()).toBe(true);
  });

  it('should show error state manually', () => {
    fixture.componentRef.setInput('state', 'error');
    fixture.detectChanges();
    expect(component['hasError']()).toBe(true);
  });

  it('should generate correct CSS classes', () => {
    fixture.componentRef.setInput('state', 'error');
    fixture.detectChanges();
    expect(component['fieldClasses']()).toContain('text-input__field--error');
  });

  it('should show success state when valid with value', () => {
    fixture.componentRef.setInput('state', 'success');
    component.writeValue('valid value');
    fixture.detectChanges();
    expect(component['hasSuccess']()).toBe(true);
  });

  it('should emit validation change', () => {
    let emitted = false;
    component.validationChange.subscribe(() => {
      emitted = true;
    });

    component['internalValidationErrors'].set([
      { message: 'Error', type: 'manual' },
    ]);

    fixture.detectChanges();

    expect(emitted).toBe(true);
  });

  it('should set disabled state via setDisabledState', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    expect(component['isDisabled']()).toBe(true);
  });

  it('should emit valueChange on input', () => {
    const valueChangeSpy = vi.fn();
    component.valueChange.subscribe(valueChangeSpy);

    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = 'test value';
    input.nativeElement.dispatchEvent(new Event('input'));

    expect(valueChangeSpy).toHaveBeenCalledWith('test value');
  });

  it('should mark ngControl as touched on blur when ngControl exists', () => {
    const formControl = new FormControl('');
    const markAsTouchedSpy = vi.spyOn(formControl, 'markAsTouched');

    (component as any).ngControl = {
      control: formControl,
    };

    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.dispatchEvent(new Event('blur'));

    expect(markAsTouchedSpy).toHaveBeenCalled();
  });

  it('should handle blur event without ngControl', () => {
    (component as any).ngControl = null;

    const blurSpy = vi.fn();
    component.blur.subscribe(blurSpy);

    const input = fixture.debugElement.query(By.css('input'));
    const blurEvent = new Event('blur');
    input.nativeElement.dispatchEvent(blurEvent);

    expect(component['touched']()).toBe(true);
    expect(component['focused']()).toBe(false);
  });

  it('should handle focus event and emit', () => {
    const focusSpy = vi.fn();
    component.focus.subscribe(focusSpy);

    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.dispatchEvent(new Event('focus'));

    expect(component['focused']()).toBe(true);
  });

  it('should register onTouched callback', () => {
    const fn = vi.fn();
    component.registerOnTouched(fn);

    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.dispatchEvent(new Event('blur'));

    expect(fn).toHaveBeenCalled();
  });
});

describe('BaseInput Parsing & Value Handling', () => {
  let component: TestInputComponent;
  let fixture: ComponentFixture<TestInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestInputComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should parse "number" input type correctly', () => {
    fixture.componentRef.setInput('type', 'number');
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'));

    input.nativeElement.value = '123';
    input.nativeElement.dispatchEvent(new Event('input'));
    expect(component['value']()).toBe(123);

    input.nativeElement.value = '';
    input.nativeElement.dispatchEvent(new Event('input'));
    expect(component['value']()).toBe('');

    input.nativeElement.value = '-';
    input.nativeElement.dispatchEvent(new Event('input'));
    expect(component['value']()).toBe('-');
  });

  it('should handle "file" input type', () => {
    fixture.componentRef.setInput('type', 'file');
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'));

    const mockFile = new File([''], 'filename.txt');
    const mockFileList = {
      0: mockFile,
      length: 1,
      item: () => mockFile,
    } as unknown as FileList;

    Object.defineProperty(input.nativeElement, 'files', {
      value: mockFileList,
    });

    input.nativeElement.dispatchEvent(new Event('input'));

    expect(component['value']()).toBe(mockFileList);
  });

  it('should pass through raw value for text types', () => {
    fixture.componentRef.setInput('type', 'text');
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = 'Hello World';
    input.nativeElement.dispatchEvent(new Event('input'));

    expect(component['value']()).toBe('Hello World');
  });
});

describe('BaseInput Extended State Logic', () => {
  let component: TestInputComponent;
  let fixture: ComponentFixture<TestInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestInputComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should NOT show success if value is empty, even if valid', () => {
    const formControl = new FormControl('');
    (component as any).ngControl = { control: formControl };
    formControl.markAsTouched();

    component.writeValue('');
    fixture.detectChanges();

    expect(component['hasSuccess']()).toBe(false);
  });

  it('should NOT show success if control is untouched/pristine', () => {
    const formControl = new FormControl('valid value');
    (component as any).ngControl = { control: formControl };

    component.writeValue('valid value');
    fixture.detectChanges();

    expect(component['hasSuccess']()).toBe(false);
  });

  it('should NOT show error if control is invalid but untouched', () => {
    const formControl = new FormControl('', Validators.required);
    (component as any).ngControl = { control: formControl };

    fixture.detectChanges();

    expect(component['hasError']()).toBe(false);
  });

  it('should emit validationChange with valid result when errors clear', () => {
    let lastResult: any;
    component.validationChange.subscribe((res) => (lastResult = res));

    component['internalValidationErrors'].set([
      { type: 'test', message: 'error' },
    ]);
    fixture.detectChanges();
    expect(lastResult.isValid).toBe(false);

    component['internalValidationErrors'].set([]);
    fixture.detectChanges();
    expect(lastResult.isValid).toBe(true);
    expect(lastResult.errors).toEqual([]);
  });
});

describe('BaseInput Error Messages', () => {
  let component: TestInputComponent;
  let fixture: ComponentFixture<TestInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestInputComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return minlength error message', () => {
    const formControl = new FormControl('ab', Validators.minLength(5));
    (component as any).ngControl = { control: formControl };
    formControl.markAsTouched();

    expect(component['errorMessage']()).toBe('Min length is 5');
  });

  it('should return maxlength error message', () => {
    const formControl = new FormControl(
      'toolongvalue',
      Validators.maxLength(5),
    );
    (component as any).ngControl = { control: formControl };
    formControl.markAsTouched();

    expect(component['errorMessage']()).toBe('Max length is 5');
  });

  it('should return min value error message', () => {
    const formControl = new FormControl(3, Validators.min(10));
    (component as any).ngControl = { control: formControl };
    formControl.markAsTouched();

    expect(component['errorMessage']()).toBe('Minimum value is 10');
  });

  it('should return max value error message', () => {
    const formControl = new FormControl(100, Validators.max(50));
    (component as any).ngControl = { control: formControl };
    formControl.markAsTouched();

    expect(component['errorMessage']()).toBe('Maximum value is 50');
  });

  it('should return pattern error message', () => {
    const formControl = new FormControl('abc', Validators.pattern(/^[0-9]+$/));
    (component as any).ngControl = { control: formControl };
    formControl.markAsTouched();

    expect(component['errorMessage']()).toBe('Invalid format');
  });

  it('should return required error message', () => {
    const formControl = new FormControl('', Validators.required);
    (component as any).ngControl = { control: formControl };
    formControl.markAsTouched();

    expect(component['errorMessage']()).toBe('This field is required');
  });

  it('should return email error message', () => {
    const formControl = new FormControl('invalid', Validators.email);
    (component as any).ngControl = { control: formControl };
    formControl.markAsTouched();

    expect(component['errorMessage']()).toBe('Invalid email address');
  });

  it('should return config error message when provided', () => {
    fixture.componentRef.setInput('config', { errorMessage: 'Custom error' });
    fixture.detectChanges();

    expect(component['errorMessage']()).toBe('Custom error');
  });

  it('should return internal validation error message', () => {
    (component as any).ngControl = null;
    component['internalValidationErrors'].set([
      { type: 'custom', message: 'Internal error' },
    ]);

    expect(component['errorMessage']()).toBe('Internal error');
  });

  it('should return empty string for unknown error type', () => {
    const formControl = new FormControl('');
    formControl.setErrors({ unknownError: true });
    (component as any).ngControl = { control: formControl };

    expect(component['errorMessage']()).toBe('');
  });

  it('should return empty string when no errors', () => {
    (component as any).ngControl = null;
    component['internalValidationErrors'].set([]);

    expect(component['errorMessage']()).toBe('');
  });
});

describe('BaseInput Logic Coverage', () => {
  let component: TestInputComponent;
  let fixture: ComponentFixture<TestInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestInputComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should cover error logic when state is manually set', () => {
    fixture.componentRef.setInput('state', 'error');
    fixture.detectChanges();

    expect(component['hasError']()).toBe(true);
    expect(component['fieldClasses']()).toContain('text-input__field--error');
  });

  it('should cover success logic when state is manually set', () => {
    fixture.componentRef.setInput('state', 'success');
    component.writeValue('some value');
    fixture.detectChanges();

    expect(component['hasSuccess']()).toBe(true);
    expect(component['fieldClasses']()).toContain('text-input__field--success');
  });

  it('should cover readonly and size logic', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.componentRef.setInput('config', { readonly: true });
    fixture.detectChanges();

    expect(component['isReadonly']()).toBe(true);
    expect(component['containerClasses']()).toContain('text-input--large');
    expect(component['fieldClasses']()).toContain(
      'text-input__field--readonly',
    );
  });

  it('should cover disabled logic from state', () => {
    fixture.componentRef.setInput('state', 'disabled');
    fixture.detectChanges();

    expect(component['isDisabled']()).toBe(true);
    expect(component['fieldClasses']()).toContain(
      'text-input__field--disabled',
    );
  });

  it('should cover readonly from state', () => {
    fixture.componentRef.setInput('state', 'readonly');
    fixture.detectChanges();

    expect(component['isReadonly']()).toBe(true);
  });

  it('should return 0 when maxCharacters is not set', () => {
    fixture.componentRef.setInput('config', {});
    fixture.detectChanges();

    expect(component['maxCharacters']()).toBe(0);
  });

  it('should return maxLength from config validation', () => {
    fixture.componentRef.setInput('config', { validation: { maxLength: 100 } });
    fixture.detectChanges();

    expect(component['maxCharacters']()).toBe(100);
  });

  it('should compute formStatus when control exists', () => {
    const formControl = new FormControl('test');
    (component as any).ngControl = { control: formControl };

    const status = component['formStatus']();

    expect(status).toEqual({
      valid: true,
      invalid: false,
      touched: false,
      dirty: false,
    });
  });

  it('should return null formStatus when no control', () => {
    (component as any).ngControl = null;

    expect(component['formStatus']()).toBeNull();
  });
});
