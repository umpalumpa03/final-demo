import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
} from '@angular/core';
import { BaseInput } from '../base/base-input';
import { SWITCH_DEFAULTS } from '../config/switches.config';
import { SwitchConfig } from '../models/switches.model';

@Component({
  selector: 'lib-switches',
  imports: [],
  templateUrl: './switches.html',
  styleUrl: './switches.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Switches extends BaseInput {
  public override readonly config = input<SwitchConfig>({});

  public readonly checked = model<boolean>(false);

  private readonly defaultId =
    this.validationService.generateUniqueId('lib-switch');

  protected readonly mergedConfig = computed<SwitchConfig>(() => ({
    ...SWITCH_DEFAULTS,
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
      if (!this.ngControl) {
        this.value.set(this.checked());
      }
    });
  }

  protected override handleInput(event: Event): void {
    if (this.isDisabled()) return;

    const target = event.target as HTMLInputElement;
    const newValue = target.checked;

    this.value.set(newValue);
    this.checked.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }

  protected override parseInputValue(target: HTMLInputElement): boolean {
    return target.checked;
  }
}
