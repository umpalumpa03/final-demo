import {
  Component,
  computed,
  signal,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core'; // 1. Import TranslateService
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

@Component({
  selector: 'lib-text-input',
  templateUrl: './text-input.html',
  styleUrls: ['./text-input.scss'],
  host: {
    '[class]': 'containerClasses()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInput extends BaseInput {
  private readonly translate = inject(TranslateService);

  protected readonly showPasswordVisibility = signal<boolean>(false);
  protected readonly icons = INPUT_ICONS;

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
    super.handleInput(event);

    this.validateDateInput();
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
