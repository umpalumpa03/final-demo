import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { BaseInput } from '../base/base-input';
import { generateUniqueId } from '../base/utils/input.util';
import { SELECT_DEFAULTS } from '../config/dropdowns.config';
import { SelectConfig } from '../models/dropdowns.model';
import { SelectOption } from '../models/input.model';

@Component({
  selector: 'lib-select',
  imports: [],
  templateUrl: './dropdowns.html',
  styleUrl: './dropdowns.scss',
})
export class Dropdowns extends BaseInput {
  private readonly elementRef = inject(ElementRef);

  public override readonly config = input<SelectConfig>({});
  public readonly options = input.required<SelectOption[]>();

  public readonly isOpen = signal(false);

  private readonly defaultId = generateUniqueId('lib-select');

  protected readonly mergedConfig = computed<SelectConfig>(() => ({
    ...SELECT_DEFAULTS,
    id: this.config().id || this.defaultId,
    ...this.config(),
  }));

  protected readonly displayValue = computed(() => {
    const currentVal = this.value();
    const selectedOption = this.options().find(
      (opt) => opt.value === currentVal,
    );

    return selectedOption
      ? selectedOption.label
      : this.mergedConfig().placeholder;
  });

  protected toggleDropdown(): void {
    if (this.isDisabled()) return;
    this.isOpen.update((v) => !v);
  }

  protected selectOption(option: SelectOption): void {
    if (option.disabled) return;

    this.value.set(option.value);
    this.onChange(option.value);
    this.valueChange.emit(option.value);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
