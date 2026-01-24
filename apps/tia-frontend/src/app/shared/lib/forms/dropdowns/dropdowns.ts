import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  OnInit,
  signal,
} from '@angular/core';
import { BaseInput } from '../base/base-input';
import { generateUniqueId } from '../base/utils/input.util';
import { SELECT_DEFAULTS } from '../config/dropdowns.config';
import { SelectConfig, SelectValue } from '../models/dropdowns.model';
import { SelectOption } from '../models/dropdowns.model';

@Component({
  selector: 'lib-select',
  imports: [],
  templateUrl: './dropdowns.html',
  styleUrl: './dropdowns.scss',
})
export class Dropdowns extends BaseInput implements OnInit {
  private readonly elementRef = inject(ElementRef);

  public override readonly config = input<SelectConfig>({});
  public readonly options = input.required<SelectOption[]>();

  public override readonly value = model<SelectValue>(null);

  public readonly isOpen = signal(false);
  private readonly defaultId = generateUniqueId('lib-select');

  ngOnInit(): void {
    if (!this.ngControl && this.value() === null) {
      const configDefault = this.config().value;

      if (configDefault !== undefined && configDefault !== null) {
        this.value.set(configDefault);
      }
    }
  }

  protected override readonly isDisabled = computed<boolean>(() => {
    return (
      this.internalDisabled() ||
      this.state() === 'disabled' ||
      !!this.mergedConfig().disabled
    );
  });

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
