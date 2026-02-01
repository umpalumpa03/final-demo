import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'lib-select',
  imports: [],
  templateUrl: './dropdowns.html',
  styleUrl: './dropdowns.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dropdowns extends BaseInput implements OnInit {
  private readonly elementRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private static currentMaxZIndex = 1000;

  public readonly maxVisibleItems = input<number>(5);

  public override readonly config = input<SelectConfig>({});
  public readonly options = input.required<SelectOption[]>();

  public override readonly value = model<SelectValue>(null);

  public readonly isOpen = signal(false);
  protected readonly zIndex = signal(4);
  private readonly defaultId = generateUniqueId('lib-select');
  private assignedZIndex: number | null = null;

  constructor() {
    super();

    effect(() => {
      if (this.isOpen()) {
        Dropdowns.currentMaxZIndex++;
        this.assignedZIndex = Dropdowns.currentMaxZIndex;
        this.zIndex.set(this.assignedZIndex);
      } else {
        this.zIndex.set(1);
        this.assignedZIndex = null;
      }
    });

    afterNextRender(() => {
      fromEvent<MouseEvent>(document, 'click', { capture: true })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event) => {
          if (!this.elementRef.nativeElement.contains(event.target as Node)) {
            if (this.isOpen()) {
              this.isOpen.set(false);
            }
          }
        });
    });
  }

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

  protected toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    if (this.isDisabled()) return;
    this.isOpen.update((v) => !v);
  }

  protected readonly dropdownMaxHeight = computed(() => {
    const optionHeightRem = 4;
    return `${this.maxVisibleItems() * optionHeightRem}rem`;
  });

  protected selectOption(option: SelectOption): void {
    if (option.disabled) return;

    this.value.set(option.value);

    this.onChange(option.value);
    this.valueChange.emit(option.value);
    this.isOpen.set(false);
  }
}
