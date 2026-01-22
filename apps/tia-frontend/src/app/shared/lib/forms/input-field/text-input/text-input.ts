import {
  Component,
  computed,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BaseInput } from '../base/base-input';
import { TEXT_INPUT_CONFIGS } from './config/text-input.config';
import { TextInputTypeConfig } from './models/text-input.model';
import {
  InputConfig,
  InputFieldValue,
  TextInputType,
} from '../models/input.model';
import { INPUT_ICONS } from './config/text-input.icons';

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
  protected readonly showPasswordVisibility = signal<boolean>(false);

  private static idCounter: number = 0;

  protected readonly icons = INPUT_ICONS;

  protected readonly uniqueId: string = `text-input-${++TextInput.idCounter}`;

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
      (this.hasSuccess() && this.config().successMessage) ||
      this.config().helperText
    ) {
      return this.messageId();
    }
    return null;
  });

  togglePasswordVisibility(): void {
    this.showPasswordVisibility.update((v) => !v);
  }
}
