import {
  input,
  output,
  signal,
  computed,
  effect,
  inject,
  Directive,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import {
  InputConfig,
  InputState,
  InputSize,
  InputVariant,
  TextInputType,
  InputFieldValue,
} from '../models/input.model';
import { ValidationResult, InputError } from '../models/input.model';

@Directive()
export abstract class BaseInput implements ControlValueAccessor {
  protected ngControl = inject(NgControl, { self: true, optional: true });

  config = input<InputConfig>({});
  state = input<InputState>('default');
  size = input<InputSize>('small');
  variant = input<InputVariant>('outlined');
  type = input<TextInputType>('text');

  valueChange = output<InputFieldValue>();
  blur = output<FocusEvent>();
  focus = output<FocusEvent>();
  validationChange = output<ValidationResult>();

  protected value = signal<InputFieldValue>('');
  protected touched = signal(false);
  protected focused = signal(false);
  protected internalDisabled = signal(false);
  protected internalValidationErrors = signal<InputError[]>([]);

  protected formStatus = computed(() => {
    const control = this.ngControl?.control;
    if (!control) return null;

    return {
      valid: control.valid,
      invalid: control.invalid,
      touched: control.touched,
      dirty: control.dirty,
    };
  });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    effect(() => {
      const errors = this.internalValidationErrors();
      const result =
        errors.length > 0
          ? ValidationResult.invalid(errors)
          : ValidationResult.valid();
      this.validationChange.emit(result);
    });
  }

  protected hasError = computed(() => {
    if (this.state() === 'error') return true;

    const control = this.ngControl?.control;
    if (!control) return false;

    this.formStatus();

    return control.invalid && (control.touched || control.dirty);
  });

  protected hasSuccess = computed(() => {
    if (this.state() === 'success') return true;

    const control = this.ngControl?.control;
    if (!control) return false;

    this.formStatus();

    const hasValue = this.value() !== '';
    return control.valid && (control.touched || control.dirty) && hasValue;
  });

  protected containerClasses = computed(
    () => `text-input text-input--${this.size()}`,
  );

  protected fieldClasses = computed(() => {
    const error = this.hasError();
    const success = this.hasSuccess();

    return [
      'text-input__field',
      error ? 'text-input__field--error' : '',
      success ? 'text-input__field--success' : '',
      this.isDisabled() ? 'text-input__field--disabled' : '',
      this.isReadonly() ? 'text-input__field--readonly' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  protected maxCharacters = computed(
    () => this.config().validation?.maxLength || 0,
  );

  protected errorMessage = computed(() => {
    if (this.config().errorMessage) {
      return this.config().errorMessage;
    }

    const control = this.ngControl?.control;
    if (!control?.errors) {
      return this.internalValidationErrors()[0]?.message || '';
    }

    const errors = control.errors;

    const errorMessages: Record<string, string> = {
      required: 'This field is required',
      email: 'Invalid email address',
      pattern: 'Invalid format',
    };

    if (errors['minlength']) {
      return `Min length is ${errors['minlength'].requiredLength}`;
    }
    if (errors['maxlength']) {
      return `Max length is ${errors['maxlength'].requiredLength}`;
    }
    if (errors['min']) {
      return `Minimum value is ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `Maximum value is ${errors['max'].max}`;
    }

    const firstError = Object.keys(errors)[0];
    return errorMessages[firstError] || '';
  });

  protected onChange: (value: InputFieldValue) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(value: InputFieldValue): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: InputFieldValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.internalDisabled.set(isDisabled);
  }

  protected parseInputValue(
    rawValue: string,
    files: FileList | null,
  ): InputFieldValue {
    const inputType = this.type();

    switch (inputType) {
      case 'number':
        if (rawValue === '') return '';
        const num = Number(rawValue);
        return isNaN(num) ? rawValue : num;
      case 'file':
        return files;
      default:
        return rawValue;
    }
  }

  protected handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const rawValue = target.value;
    const files = target.files;
    const parsedValue = this.parseInputValue(rawValue, files);

    this.value.set(parsedValue);
    this.onChange(parsedValue);
    this.valueChange.emit(parsedValue);
  }

  protected handleBlur(event: FocusEvent): void {
    this.focused.set(false);
    this.touched.set(true);
    this.onTouched();

    if (this.ngControl?.control) {
      this.ngControl.control.markAsTouched();
    }

    this.blur.emit(event);
  }

  protected handleFocus(event: FocusEvent): void {
    this.focused.set(true);
    this.focus.emit(event);
  }

  protected isDisabled = computed(
    () => this.internalDisabled() || this.state() === 'disabled',
  );

  protected isReadonly = computed(
    () => this.config().readonly || this.state() === 'readonly',
  );
}
