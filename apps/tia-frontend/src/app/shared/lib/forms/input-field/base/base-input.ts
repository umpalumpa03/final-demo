import {
  input,
  output,
  signal,
  computed,
  inject,
  Directive,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  InputConfig,
  InputState,
  InputSize,
  InputVariant,
  TextInputType,
  InputFieldValue,
} from '../models/input.model';
import { ValidationResult, InputError } from '../models/input.model';
import { getValidationErrorMessage } from '@tia/shared/lib/forms/input-field/base/utils/input.util';

@Directive()
export abstract class BaseInput implements ControlValueAccessor, OnInit {
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
  protected readonly touched = signal(false);
  protected readonly focused = signal(false);
  protected readonly internalDisabled = signal(false);
  protected readonly internalValidationErrors = signal<InputError[]>([]);

  protected statusChanges = signal<string | null>(null);

  protected readonly destroyRef = inject(DestroyRef);

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  public ngOnInit(): void {
    if (this.ngControl?.control) {
      this.statusChanges.set(this.ngControl.control.status);

      this.ngControl.control.statusChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((status) => {
          this.statusChanges.set(status);
        });
    }
  }

  protected readonly hasError = computed<boolean>(() => {
    this.statusChanges();

    if (this.state() === 'error') return true;

    const control = this.ngControl?.control;
    if (!control) return false;

    return control.invalid && (control.touched || control.dirty);
  });
  protected readonly hasSuccess = computed<boolean>(() => {
    this.statusChanges();

    const hasValue = this.value() !== '' && this.value() !== null;

    if (this.state() === 'success') {
      return hasValue;
    }

    const control = this.ngControl?.control;
    if (!control) return false;

    return control.valid && (control.touched || control.dirty) && hasValue;
  });

  protected readonly containerClasses = computed<string>(
    () => `text-input text-input--${this.size()}`,
  );

  protected readonly fieldClasses = computed<string>(() => {
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

  protected readonly maxCharacters = computed<number>(
    () => this.config().validation?.maxLength || 0,
  );

  protected readonly errorMessage = computed<string>(() => {
    this.statusChanges();

    const customError = this.config().errorMessage;
    if (customError) {
      return customError;
    }

    const control = this.ngControl?.control;
    if (!control?.errors) {
      const internalErrors = this.internalValidationErrors();
      return internalErrors.length > 0 ? internalErrors[0].message : '';
    }

    return getValidationErrorMessage(control.errors);
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

  protected parseInputValue(
    rawValue: string,
    files: FileList | null,
  ): InputFieldValue {
    const inputType = this.type();

    switch (inputType) {
      case 'number':
        if (rawValue === '' || rawValue === null) return null;
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

  protected readonly isDisabled = computed<boolean>(
    () => this.internalDisabled() || this.state() === 'disabled',
  );

  protected readonly isReadonly = computed<boolean>(
    () => this.config().readonly || this.state() === 'readonly',
  );
}
