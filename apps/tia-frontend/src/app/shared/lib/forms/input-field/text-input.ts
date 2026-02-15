import {
  Component,
  computed,
  signal,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseInput } from '../base/base-input';
import { TEXT_INPUT_CONFIGS } from '../config/text-input.config';
import { TextInputTypeConfig } from './models/text-input.model';
import {
  InputConfig,
  InputError,
  InputFieldValue,
  TextInputType,
} from '../models/input.model';
import { INPUT_ICONS } from '../config/text-input.icons';
import { DatePicker } from './date-picker/date-picker';
import {
  formatDateDisplay,
  maskDateInput,
  parseDateToIso,
} from './utils/date-input.util';
import {
  formatNumberDisplay,
  sanitizeNumberInput,
} from './utils/number-input.util';

@Component({
  selector: 'lib-text-input',
  templateUrl: './text-input.html',
  styleUrls: ['./text-input.scss'],
  imports: [DatePicker],
  host: {
    '[class]': 'containerClasses()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInput extends BaseInput {
  private readonly translate = inject(TranslateService);

  protected readonly showPasswordVisibility = signal<boolean>(false);
  protected readonly isDatePickerOpen = signal<boolean>(false);
  protected readonly isCapsLockOn = signal<boolean>(false);
  protected readonly icons = INPUT_ICONS;

  protected readonly uniqueId =
    this.validationService.generateUniqueId('text-input');

  protected readonly isDateType = computed(() => this.type() === 'date');
  protected readonly isPasswordType = computed(
    () => this.type() === 'password',
  );

  protected readonly mergedConfig = computed<
    Required<TextInputTypeConfig> & InputConfig
  >(() => {
    const defaultConfig = TEXT_INPUT_CONFIGS[this.type()] || {};
    const userConfig = this.config();
    const effectiveIcon =
      userConfig.prefixIcon !== undefined
        ? userConfig.prefixIcon
        : defaultConfig.icon;

    return {
      ...defaultConfig,
      ...userConfig,
      icon: effectiveIcon,
      id: userConfig.id || this.uniqueId,
    } as Required<TextInputTypeConfig> & InputConfig;
  });

  protected readonly inputType = computed<TextInputType>(() => {
    if (this.type() === 'password')
      return this.showPasswordVisibility() ? 'text' : 'password';
    if (this.type() === 'number') return 'text';
    return this.type();
  });

  protected readonly labelIconUrl = computed(() =>
    this.mergedConfig().labelIconUrl
      ? `url('${this.mergedConfig().labelIconUrl}')`
      : null,
  );
  protected readonly prefixIconUrl = computed(() =>
    this.mergedConfig().icon ? `url('/${this.mergedConfig().icon}')` : null,
  );

  protected readonly suffixIconUrl = computed(() => {
    const iconPath = this.showPasswordVisibility()
      ? this.icons.EYE_OFF
      : this.icons.EYE;
    return `url('/${iconPath}')`;
  });

  protected readonly messageId = computed(
    () => `${this.mergedConfig().id}-msg`,
  );

  protected readonly getDisplayValue = computed<InputFieldValue>(() => {
    if (this.inputType() === 'file') return '';
    const val = this.value();

    if (this.isDateType()) return formatDateDisplay(String(val));
    if (typeof val === 'number') return formatNumberDisplay(val);

    return val ?? '';
  });

  protected readonly ariaDescribedBy = computed<string | null>(() => {
    const hasMsg =
      this.hasError() ||
      this.hasWarning() ||
      (this.hasSuccess() && this.config().successMessage) ||
      this.config().helperText;
    return hasMsg ? this.messageId() : null;
  });

  protected override handleInput(event: Event): void {
    if (this.isDateType()) {
      this.handleDateMask(event);
    } else if (this.type() === 'number') {
      this.handleNumberInput(event);
    } else {
      super.handleInput(event);
    }

    if (this.isDateType()) this.validateDateInput();
  }

  private handleNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const originalValue = input.value;
    const cleaned = sanitizeNumberInput(originalValue);

    if (originalValue !== cleaned) input.value = cleaned;

    this.value.set(cleaned);

    const numValue =
      cleaned === '' || cleaned === '.' || cleaned === '-'
        ? null
        : Number(cleaned);
    this.onChange(numValue);
    this.valueChange.emit(numValue);
  }

  private handleDateMask(event: Event): void {
    const input = event.target as HTMLInputElement;
    const { value, cursor } = maskDateInput(
      input.value,
      input.selectionStart || 0,
    );

    input.value = value;
    input.setSelectionRange(cursor, cursor);

    const isoDate = parseDateToIso(value);

    if (isoDate || value === '') {
      const payload = value === '' ? null : isoDate;
      this.value.set(payload);
      this.onChange(payload);
      this.valueChange.emit(payload);
    }
  }

  protected getDateValue(): string | number | null {
    const val = this.value();
    return typeof val === 'string' || typeof val === 'number' ? val : null;
  }

  protected toggleDatePicker(): void {
    if (!this.isDisabled() && !this.isReadonly())
      this.isDatePickerOpen.update((v) => !v);
  }

  protected handleDateSelected(dateStr: string): void {
    this.value.set(dateStr);
    this.onChange(dateStr);
    this.valueChange.emit(dateStr);
    this.isDatePickerOpen.set(false);
    this.validateDateInput();
  }

  protected closeDatePicker(): void {
    this.isDatePickerOpen.set(false);
  }

  private validateDateInput(): void {
    if (this.inputType() !== 'date' || !this.value()) {
      if (this.internalValidationErrors().length > 0)
        this.setValidationErrors([]);
      return;
    }

    const inputDate = this.value()?.toString() || '';
    const { min, max } = this.mergedConfig();
    const errors: InputError[] = [];

    if (min && inputDate < min.toString()) {
      errors.push(
        new InputError(
          'min',
          this.translate.instant('common.validation.min', { min }),
        ),
      );
    }
    if (max && inputDate > max.toString()) {
      errors.push(
        new InputError(
          'max',
          this.translate.instant('common.validation.max', { max }),
        ),
      );
    }

    this.setValidationErrors(errors);
  }

  protected checkCapsLock(event: Event): void {
    if (event instanceof KeyboardEvent)
      this.isCapsLockOn.set(event.getModifierState('CapsLock'));
  }

  protected override handleBlur(event: FocusEvent): void {
    this.isCapsLockOn.set(false);
    super.handleBlur(event);
  }

  protected togglePasswordVisibility(): void {
    this.showPasswordVisibility.update((v) => !v);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    this.checkCapsLock(event);
    if (this.type() === 'number') {
      if (event.ctrlKey || event.metaKey) return;
      const allowedKeys = [
        'Backspace',
        'Tab',
        'End',
        'Home',
        'ArrowLeft',
        'ArrowRight',
        'Delete',
      ];
      if (/^[0-9]$/.test(event.key)) return;
      if (
        event.key === '.' &&
        !(event.target as HTMLInputElement).value.includes('.')
      )
        return;
      if (allowedKeys.includes(event.key)) return;
      event.preventDefault();
    }
  }
}
