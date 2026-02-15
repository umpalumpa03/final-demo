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
  protected readonly icons = INPUT_ICONS;

  protected getDateValue(): string | number | null {
    const val = this.value();
    if (typeof val === 'string' || typeof val === 'number') {
      return val;
    }
    return null;
  }

  protected readonly isDateType = computed<boolean>(
    () => this.type() === 'date',
  );

  protected readonly uniqueId =
    this.validationService.generateUniqueId('text-input');
  protected readonly isCapsLockOn = signal<boolean>(false);

  protected readonly labelIconUrl = computed(() => {
    const iconPath = this.mergedConfig().labelIconUrl;
    return iconPath ? `url('${iconPath}')` : null;
  });

  protected readonly prefixIconUrl = computed(() => {
    const iconPath = this.mergedConfig().icon;
    return iconPath ? `url('/${iconPath}')` : null;
  });

  protected readonly suffixIconUrl = computed(() => {
    const iconPath = this.showPasswordVisibility()
      ? this.icons.EYE_OFF
      : this.icons.EYE;
    return `url('/${iconPath}')`;
  });

  protected readonly isPasswordType = computed<boolean>(
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
    if (this.type() === 'password') {
      return this.showPasswordVisibility() ? 'text' : 'password';
    }
    return this.type();
  });

  protected readonly messageId = computed<string>(
    () => `${this.mergedConfig().id}-msg`,
  );

  protected readonly getDisplayValue = computed<InputFieldValue>(() => {
    if (this.inputType() === 'file') return '';
    const val = this.value();

    if (this.isDateType() && typeof val === 'string' && val) {
      const parts = val.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }
    return val ?? '';
  });

  protected readonly ariaDescribedBy = computed<string | null>(() => {
    if (
      this.hasError() ||
      this.hasWarning() ||
      (this.hasSuccess() && this.config().successMessage) ||
      this.config().helperText
    ) {
      return this.messageId();
    }
    return null;
  });

  protected override handleInput(event: Event): void {
    if (this.isDateType()) {
      this.handleDateMask(event);
    } else {
      super.handleInput(event);
    }

    if (this.isDateType()) {
      this.validateDateInput();
    }
  }

  protected toggleDatePicker(): void {
    if (!this.isDisabled() && !this.isReadonly()) {
      this.isDatePickerOpen.update((v) => !v);
    }
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

  private handleDateMask(event: Event): void {
    const input = event.target as HTMLInputElement;
    const originalValue = input.value;
    let cursorPosition = input.selectionStart || 0;

    let cleaned = originalValue.replace(/[^0-9/]/g, '');

    const hasSlashes = cleaned.includes('/');
    let formattedDate = '';

    if (hasSlashes) {
      const parts = cleaned.split('/');

      let day = parts[0]?.substring(0, 2) || '';
      if (day.length === 2 && Number(day) > 31) {
        day = '31';
      }

      let month = parts[1]?.substring(0, 2) || '';
      if (month.length === 2 && Number(month) > 12) {
        month = '12';
      }

      const year = parts[2]?.substring(0, 4) || '';

      formattedDate = day;
      if (parts.length > 1 || day.length === 2) {
        formattedDate += '/' + month;
      }
      if (parts.length > 2 || month.length === 2) {
        formattedDate += '/' + year;
      }
    } else {
      const digits = cleaned.replace(/\D/g, '');

      let d = digits.slice(0, 2);
      let m = '';
      let y = '';

      if (d.length === 2 && Number(d) > 31) d = '31';

      if (digits.length > 2) {
        m = digits.slice(2, 4);
        if (m.length === 2 && Number(m) > 12) m = '12';
      }

      if (digits.length > 4) {
        y = digits.slice(4, 8);
      }

      formattedDate = d;
      if (digits.length > 2) {
        formattedDate += '/' + m;
      }
      if (digits.length > 4) {
        formattedDate += '/' + y;
      }
    }

    input.value = formattedDate;

    if (
      originalValue.length < formattedDate.length &&
      cursorPosition === originalValue.length
    ) {
      cursorPosition = formattedDate.length;
    }
    input.setSelectionRange(cursorPosition, cursorPosition);

    this.updateDateModel(formattedDate);
  }

  private updateDateModel(formattedStr: string): void {
    if (formattedStr.length === 10) {
      const [day, month, year] = formattedStr.split('/');

      if (day.length === 2 && month.length === 2 && year.length === 4) {
        const isoDate = `${year}-${month}-${day}`;
        const d = new Date(isoDate);

        if (!isNaN(d.getTime())) {
          this.value.set(isoDate);
          this.onChange(isoDate);
          this.valueChange.emit(isoDate);
          return;
        }
      }
    }

    if (formattedStr === '') {
      this.value.set(null);
      this.onChange(null);
      this.valueChange.emit(null);
    }
  }

  private validateDateInput(): void {
    const type = this.inputType();
    const val = this.value();
    const config = this.mergedConfig();

    if (type !== 'date' || !val) {
      if (this.internalValidationErrors().length > 0) {
        this.setValidationErrors([]);
      }
      return;
    }

    const inputDate = val.toString();
    const min = config.min?.toString();
    const max = config.max?.toString();
    const errors: InputError[] = [];

    if (min && inputDate < min) {
      const msg = this.translate.instant('common.validation.min', { min });
      errors.push(new InputError('min', msg));
    }

    if (max && inputDate > max) {
      const msg = this.translate.instant('common.validation.max', { max });
      errors.push(new InputError('max', msg));
    }

    this.setValidationErrors(errors);
  }

  protected checkCapsLock(event: Event): void {
    if (event instanceof KeyboardEvent) {
      const isOn = event.getModifierState('CapsLock');
      this.isCapsLockOn.set(isOn);
    }
  }

  protected override handleBlur(event: FocusEvent): void {
    this.isCapsLockOn.set(false);
    super.handleBlur(event);
  }

  protected togglePasswordVisibility(): void {
    this.showPasswordVisibility.update((v) => !v);
  }
}
