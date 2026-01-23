import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  effect,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseInput } from '../base/base-input';
import { CheckboxConfig } from '../models/checkbox.model';
import { CHECKBOX_DEFAULTS } from '../config/checkbox.config';
import { generateUniqueId } from '../base/utils/input.util'; // შენი უტილიტა

@Component({
  selector: 'lib-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkboxes.html',
  styleUrls: ['./checkboxes.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkbox extends BaseInput {
  public override readonly config = input<CheckboxConfig>({});

  // ✅ 1. ვამატებთ სტანდარტულ ინფუთს და აუთფუთს (ფორმების გარეშე მუშაობისთვის)
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
      this.internalDisabled() || // ფორმიდან (setDisabledState)
      this.state() === 'disabled' || // პირდაპირი ინფუთიდან
      !!this.mergedConfig().disabled // კონფიგურაციიდან
    );
  });

  constructor() {
    super();
    // ✅ 2. სინქრონიზაცია: თუ [checked] შეიცვლება გარედან და არ გვაქვს ფორმა,
    // განვაახლოთ შიდა value
    effect(() => {
      const isChecked = this.checked();
      // თუ ngControl არ გვაქვს, ანუ უბრალო ბაინდინგია
      if (!this.ngControl) {
        this.value.set(isChecked);
      }
    });
  }

  // ✅ 3. Override: როცა მომხმარებელი აკლიკებს, ვაახლებთ ყველაფერს
  protected override handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.checked;

    // A. შიდა სთეითის განახლება (BaseInput-ის ლოგიკა)
    this.value.set(newValue);
    this.onChange(newValue); // ReactiveForms-ისთვის
    this.valueChange.emit(newValue);

    // B. Native Binding-ისთვის ემიტერი
    this.checkedChange.emit(newValue);
  }

  // ფორმებისთვის გვჭირდება, რომ value სწორად წავიკითხოთ
  protected override parseInputValue(target: HTMLInputElement): boolean {
    return target.checked;
  }
}
