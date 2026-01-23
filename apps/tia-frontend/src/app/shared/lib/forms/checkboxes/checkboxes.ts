import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  effect,
  output,
} from '@angular/core';
import { BaseInput } from '../base/base-input';
import { CheckboxConfig } from '../models/checkbox.model';
import { CHECKBOX_DEFAULTS } from '../config/checkbox.config';
import { generateUniqueId } from '../base/utils/input.util';

@Component({
  selector: 'lib-checkboxes',
  imports: [],
  templateUrl: './checkboxes.html',
  styleUrls: ['./checkboxes.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkboxes extends BaseInput {
  public override readonly config = input<CheckboxConfig>({});

  public readonly checked = input<boolean>(false);
  public readonly checkedChange = output<boolean>();

  private readonly defaultId = generateUniqueId('lib-checkbox');

  protected readonly mergedConfig = computed<CheckboxConfig>(() => ({
    ...CHECKBOX_DEFAULTS,
    id: this.config().id || this.defaultId,
    ...this.config(),
  }));

  protected override readonly isDisabled = computed<boolean>(() => {
    return (
      this.internalDisabled() ||
      this.state() === 'disabled' ||
      !!this.mergedConfig().disabled
    );
  });

  constructor() {
    super();
    effect(() => {
      const isChecked = this.checked();
      if (!this.ngControl) {
        this.value.set(isChecked);
      }
    });
  }

  protected override handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.checked;

    this.value.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);

    this.checkedChange.emit(newValue);
  }

  protected override parseInputValue(target: HTMLInputElement): boolean {
    return target.checked;
  }
}
