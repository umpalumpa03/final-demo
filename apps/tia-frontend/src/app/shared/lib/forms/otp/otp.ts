import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  viewChildren,
} from '@angular/core';
import { BaseInput } from '../base/base-input';
import { generateUniqueId } from '../base/utils/input.util';
import { OTP_ALLOWED_KEYS, OTP_DEFAULTS } from '../config/otp.config';
import { OtpConfig, OtpDigit } from '../models/otp.model';

@Component({
  selector: 'lib-otp',
  imports: [],
  templateUrl: './otp.html',
  styleUrl: './otp.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Otp extends BaseInput implements AfterViewInit {
  readonly otpBoxes = viewChildren<ElementRef<HTMLInputElement>>('otpBox');

  public override readonly config = input<OtpConfig>({});
  public readonly isCentered = input<boolean>();
  public override readonly value = model<string>('');

  public readonly completed = output<string>();

  private readonly defaultId: string = generateUniqueId('lib-otp');

  protected readonly mergedConfig = computed<OtpConfig>(() => ({
    ...OTP_DEFAULTS,
    id: this.config().id || this.defaultId,
    ...this.config(),
  }));

  protected readonly valuesArray = computed<OtpDigit[]>(() => {
    const len = this.mergedConfig().length!;
    let val = this.value() || '';

    if (val.length < len) {
      val = val.padEnd(len, ' ');
    }

    const chars = val.split('');

    return Array.from({ length: len }, (_, i) => ({
      id: i,
      value: chars[i] === ' ' ? '' : chars[i],
    }));
  });

  constructor() {
    super();
  }

  protected readonly inputType = computed(() => {
    const type = this.mergedConfig().inputType;
    return type === 'number' ? 'tel' : type;
  });

  protected onDigitInput(event: Event, index: number): void {
    const inputEl = event.target as HTMLInputElement;
    let val: string = inputEl.value;

    if (this.mergedConfig().inputType === 'number') {
      val = val.replace(/[^0-9]/g, '');
    }
    if (val.length > 1) {
      val = val.slice(-1);
    }

    inputEl.value = val;

    this.updateValueAt(index, val);

    if (val && index < this.mergedConfig().length! - 1) {
      this.otpBoxes()[index + 1]?.nativeElement.focus();
    }
  }

  protected handleKeyDown(event: KeyboardEvent, index: number): void {
    const len: number = this.mergedConfig().length!;
    const isNumberType = this.mergedConfig().inputType === 'number';

    if (event.code === 'Space' || event.key === ' ') {
      event.preventDefault();
      return;
    }

    if (isNumberType) {
      const allowedKeys: readonly string[] = OTP_ALLOWED_KEYS;
      const isControl = event.ctrlKey || event.metaKey;

      if (
        !allowedKeys.includes(event.key) &&
        !isControl &&
        !/^[0-9]$/.test(event.key)
      ) {
        event.preventDefault();
        return;
      }
    }

    switch (event.key) {
      case 'Backspace':
        if (!event.target) return;
        const input = event.target as HTMLInputElement;

        if (input.value) {
          event.preventDefault();
          this.updateValueAt(index, '');
        } else if (index > 0) {
          event.preventDefault();
          const prevBox = this.otpBoxes()[index - 1]?.nativeElement;
          prevBox?.focus();
          this.updateValueAt(index - 1, '');
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (index > 0) this.otpBoxes()[index - 1]?.nativeElement.focus();
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (index < len - 1) this.otpBoxes()[index + 1]?.nativeElement.focus();
        break;
    }
  }

  protected handlePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData: string = event.clipboardData?.getData('text') || '';
    const config = this.mergedConfig();
    const len: number = config.length!;

    let cleanData = pastedData.trim();

    if (config.inputType === 'number') {
      cleanData = cleanData.replace(/[^0-9]/g, '');
    }

    cleanData = cleanData.slice(0, len);
    if (!cleanData) return;

    const paddedData = cleanData.padEnd(len, ' ');

    this.value.set(paddedData);
    this.onChange(paddedData);

    this.checkCompletion(paddedData);

    setTimeout(() => {
      const focusIndex = Math.min(cleanData.length, len) - 1;
      if (focusIndex >= 0) {
        this.otpBoxes()[focusIndex]?.nativeElement.focus();
      }
    });
  }

  private updateValueAt(index: number, val: string): void {
    const len: number = this.mergedConfig().length!;
    let currentVal = this.value() || '';

    if (currentVal.length < len) {
      currentVal = currentVal.padEnd(len, ' ');
    }

    const arr = currentVal.split('');

    arr[index] = val === '' ? ' ' : val;

    const finalString = arr.join('').substring(0, len);

    this.value.set(finalString);
    this.onChange(finalString);

    this.checkCompletion(finalString);
  }

  private checkCompletion(val: string): void {
    if (val.length === this.mergedConfig().length && !val.includes(' ')) {
      this.completed.emit(val);
    }
  }

  public ngAfterViewInit(): void {
    queueMicrotask(() => {
      this.otpBoxes()[0]?.nativeElement.focus();
    });
  }
}
