import { Component, computed, effect, input, output } from '@angular/core';
import { BaseInput } from '../base/base-input';
import { generateUniqueId } from '../base/utils/input.util';
import { RADIO_DEFAULTS } from '../config/radios.config';
import {
  RadioGroupConfig,
  RadioOption,
  RadioValue,
} from '../models/radios.model';

@Component({
  selector: 'lib-radios',
  imports: [],
  templateUrl: './radios.html',
  styleUrl: './radios.scss',
})
export class Radios extends BaseInput {
  public override readonly config = input<RadioGroupConfig>({});
  public readonly options = input.required<RadioOption[]>();

  public readonly initialValue = input<RadioValue>();

  public readonly valueChangeSignal = output<RadioValue>();

  protected readonly groupName = generateUniqueId('radio-group');

  protected readonly mergedConfig = computed<RadioGroupConfig>(() => ({
    ...RADIO_DEFAULTS,
    ...this.config(),
  }));

  selectOption(optionValue: RadioValue): void {
    if (this.isDisabled()) return;

    this.value.set(optionValue);
    this.onChange(optionValue);
    this.valueChange.emit(optionValue);
    this.valueChangeSignal.emit(optionValue);
  }
  constructor() {
    super();
    effect(() => {
      const initial = this.mergedConfig().initialValue;
      const currentValue = this.value();

      if (
        initial !== undefined &&
        (currentValue === null ||
          currentValue === undefined ||
          currentValue === '')
      ) {
        this.value.set(initial);
      }
    });
  }

  isOptionDisabled(option: RadioOption): boolean {
    return this.isDisabled() || !!option.disabled;
  }
}
