import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  model,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { BaseInput } from '../base/base-input';
import { generateUniqueId } from '../base/utils/input.util';
import { OTP_DEFAULTS } from '../config/otp.config';
import { OtpConfig } from '../models/otp.model';

@Component({
  selector: 'lib-otp',
  imports: [],
  templateUrl: './otp.html',
  styleUrl: './otp.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Otp extends BaseInput {
  public override readonly config = input<OtpConfig>({});

  public override readonly value = model<string>('');

  @ViewChildren('otpBox') otpBoxes!: QueryList<ElementRef<HTMLInputElement>>;

  private readonly defaultId = generateUniqueId('lib-otp');

  protected readonly mergedConfig = computed<OtpConfig>(() => ({
    ...OTP_DEFAULTS,
    id: this.config().id || this.defaultId,
    ...this.config(),
  }));

  protected readonly valuesArray = signal<string[]>([]);

  constructor() {
    super();

    effect(() => {
      const len = this.mergedConfig().length || 6;
      const current = this.valuesArray();
      if (current.length !== len) {
        this.valuesArray.set(new Array(len).fill(''));
      }
    });

    effect(() => {
      const val = this.value() || '';
      const len = this.mergedConfig().length || 6;

      const newArr = val.split('').slice(0, len);
      while (newArr.length < len) newArr.push('');

      if (newArr.join('') !== this.valuesArray().join('')) {
        this.valuesArray.set(newArr);
      }
    });
  }

  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let val = input.value;

    if (val.length > 1) {
      val = val.slice(-1);
    }

    input.value = val;

    this.updateArrayAt(index, val);

    if (val && index < (this.mergedConfig().length || 6) - 1) {
      this.otpBoxes.get(index + 1)?.nativeElement.focus();
    }
  }

  handleKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    switch (event.key) {
      case 'Backspace':
        if (!input.value && index > 0) {
          this.updateArrayAt(index - 1, '');
          this.otpBoxes.get(index - 1)?.nativeElement.focus();
        } else {
          this.updateArrayAt(index, '');
        }
        break;
      case 'ArrowLeft':
        if (index > 0) this.otpBoxes.get(index - 1)?.nativeElement.focus();
        break;
      case 'ArrowRight':
        if (index < (this.mergedConfig().length || 6) - 1) {
          this.otpBoxes.get(index + 1)?.nativeElement.focus();
        }
        break;
    }
  }

  handlePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const cleanData = pastedData.trim().slice(0, this.mergedConfig().length);

    if (!cleanData) return;

    this.value.set(cleanData);
    this.onChange(cleanData);
    this.valueChange.emit(cleanData);

    setTimeout(() => {
      const focusIndex =
        Math.min(cleanData.length, this.mergedConfig().length || 6) - 1;
      if (focusIndex >= 0) {
        this.otpBoxes.get(focusIndex)?.nativeElement.focus();
      }
    });
  }

  private updateArrayAt(index: number, val: string) {
    const arr = [...this.valuesArray()];
    arr[index] = val;
    this.valuesArray.set(arr);

    const finalString = arr.join('');
    this.value.set(finalString);
    this.onChange(finalString);
    this.valueChange.emit(finalString);
  }
}
