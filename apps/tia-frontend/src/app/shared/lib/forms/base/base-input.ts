import {
  input,
  output,
  signal,
  computed,
  inject,
  Directive,
  DoCheck,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import {
  InputConfig,
  InputState,
  InputSize,
  InputVariant,
  TextInputType,
  InputFieldValue,
  ValidationResult,
  InputError,
} from '../models/input.model';
import { ValidationService } from './utils/input.util';

@Directive()
export abstract class BaseInput implements ControlValueAccessor, DoCheck {
  protected validationService = inject(ValidationService);

  protected readonly ngControl = inject(NgControl, {
    self: true,
    optional: true,
  });

  public readonly config = input<InputConfig>({});
  public readonly state = input<InputState>('default');
  public readonly size = input<InputSize>('small');
  public readonly variant = input<InputVariant>('outlined');
  public readonly type = input<TextInputType>('text');

  public readonly valueChange = output<InputFieldValue>();
  public readonly blur = output<FocusEvent>();
  public readonly focus = output<FocusEvent>();
  public readonly validationChange = output<ValidationResult>();

  protected readonly value = signal<InputFieldValue>('');
  protected readonly touched = signal<boolean>(false);
  protected readonly focused = signal<boolean>(false);
  protected readonly internalDisabled = signal<boolean>(false);
  protected readonly internalValidationErrors = signal<InputError[]>([]);

  protected readonly _controlTouched = signal<boolean>(false);
  protected readonly _controlDirty = signal<boolean>(false);
  protected readonly _controlStatus = signal<string>('');

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  public ngDoCheck(): void {
    if (this.ngControl?.control) {
      const { touched, dirty, status } = this.ngControl.control;
      this._controlTouched.set(!!touched);
      this._controlDirty.set(!!dirty);
      this._controlStatus.set(status || '');
    }
  }

  protected readonly hasError = computed(() => {
    if (this.state() === 'error') return true;

    if (this.internalValidationErrors().length > 0) return true;

    return (
      this._controlStatus() === 'INVALID' &&
      (this._controlTouched() || this._controlDirty())
    );
  });
  protected readonly hasWarning = computed<boolean>(() => {
    return this.state() === 'warning';
  });

  protected readonly hasSuccess = computed<boolean>(() => {
    if (this.hasError()) return false;

    const status = this._controlStatus();
    const isTouched = this._controlTouched();
    const isDirty = this._controlDirty();
    const hasValue = this.value() !== '' && this.value() !== null;

    if (this.state() === 'success') {
      return hasValue;
    }

    if (!this.ngControl?.control) return false;

    return status === 'VALID' && (isTouched || isDirty) && hasValue;
  });

  protected readonly containerClasses = computed<string>(
    () => `text-input text-input--${this.size()}`,
  );

  protected readonly fieldClasses = computed<string>(() => {
    const error = this.hasError();
    const success = this.hasSuccess();
    const warning = this.hasWarning();

    return [
      'text-input__field',
      error ? 'text-input__field--error' : '',
      success ? 'text-input__field--success' : '',
      warning ? 'text-input__field--warning' : '',
      this.isDisabled() ? 'text-input__field--disabled' : '',
      this.isReadonly() ? 'text-input__field--readonly' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  protected readonly errorMessage = computed<string>(() => {
    this._controlStatus();

    const customError = this.config().errorMessage;
    if (customError) {
      return customError;
    }

    const control = this.ngControl?.control;

    if (control?.errors) {
      return this.validationService.getErrorMessage(control.errors);
    }

    const internalErrors = this.internalValidationErrors();
    if (internalErrors.length > 0) {
      return internalErrors[0].message;
    }

    return '';
  });

  protected setValidationErrors(errors: InputError[]): void {
    this.internalValidationErrors.set(errors);
    const result =
      errors.length > 0
        ? ValidationResult.invalid(errors)
        : ValidationResult.valid();
    this.validationChange.emit(result);
  }

  protected onChange: (value: InputFieldValue) => void = () => {};
  protected onTouched: () => void = () => {};

  public writeValue(value: InputFieldValue): void {
    this.value.set(value ?? '');
  }

  public registerOnChange(fn: (value: InputFieldValue) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.internalDisabled.set(isDisabled);
  }

  protected parseInputValue(target: HTMLInputElement): InputFieldValue {
    const { value, type, files } = target;
    switch (type) {
      case 'number':
        return value === '' ? null : Number(value);
      case 'file':
        return files;
      default:
        return value;
    }
  }

  protected handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!target) return;
    const parsedValue = this.parseInputValue(target);
    this.value.set(parsedValue);
    this.onChange(parsedValue);
    this.valueChange.emit(parsedValue);
  }

  protected handleBlur(event: FocusEvent): void {
    this.focused.set(false);
    this.touched.set(true);
    this.onTouched();
    this.blur.emit(event);
  }

  protected handleFocus(event: FocusEvent): void {
    this.focused.set(true);
    this.focus.emit(event);
  }

  protected readonly isDisabled = computed<boolean>(
    () => this.internalDisabled() || this.state() === 'disabled',
  );

  protected readonly isReadonly = computed<boolean>(
    () => this.config().readonly || this.state() === 'readonly',
  );
}
