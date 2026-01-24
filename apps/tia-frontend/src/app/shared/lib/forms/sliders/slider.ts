import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
} from '@angular/core';
import { BaseInput } from '../base/base-input';
import { generateUniqueId } from '../base/utils/input.util';
import { SLIDER_DEFAULTS } from '../config/slider.config';
import { SliderConfig } from '../models/slider.model';

@Component({
  selector: 'lib-slider',
  imports: [],
  templateUrl: './slider.html',
  styleUrl: './slider.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Slider extends BaseInput {
  public override readonly config = input<SliderConfig>({});

  public override readonly value = model<number>(0);

  private readonly defaultId = generateUniqueId('lib-slider');

  protected readonly mergedConfig = computed<SliderConfig>(() => ({
    ...SLIDER_DEFAULTS,
    ...this.config(),
    id: this.config().id || this.defaultId,
  }));

  protected override readonly isDisabled = computed<boolean>(() => {
    return (
      this.internalDisabled() ||
      this.state() === 'disabled' ||
      !!this.mergedConfig().disabled
    );
  });

  protected readonly fillPercentage = computed(() => {
    const val = this.value() ?? 0;
    const { min = 0, max = 100 } = this.mergedConfig();

    if (max === min) return 0;
    if (val < min) return 0;
    if (val > max) return 100;

    return ((val - min) / (max - min)) * 100;
  });

  protected onInput(event: Event): void {
    if (this.isDisabled()) return;

    const target = event.target as HTMLInputElement;
    const numValue = parseFloat(target.value);

    this.value.set(numValue);
    this.onChange(numValue);
    this.valueChange.emit(numValue);
  }

  constructor() {
    super();
    effect(() => {
      if (this.value() === null) {
        this.value.set(this.mergedConfig().min ?? 0);
      }
    });
  }
}
