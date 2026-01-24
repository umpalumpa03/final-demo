import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  model,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { BaseInput } from '../base/base-input';
import { generateUniqueId } from '../base/utils/input.util';
import { OTP_DEFAULTS } from '../config/otp.config';
import { OtpConfig, OtpDigit } from '../models/otp.model';

@Component({
  selector: 'lib-otp',
  imports: [],
  templateUrl: './otp.html',
  styleUrl: './otp.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Otp extends BaseInput {
  @ViewChildren('otpBox')
  private readonly otpBoxes!: QueryList<ElementRef<HTMLInputElement>>;

  public override readonly config = input<OtpConfig>({});
  public override readonly value = model<string>('');

  private readonly defaultId: string = generateUniqueId('lib-otp');

  protected readonly mergedConfig = computed<OtpConfig>(() => ({
    ...OTP_DEFAULTS,
    id: this.config().id || this.defaultId,
    ...this.config(),
  }));

protected readonly valuesArray = computed<OtpDigit[]>(() => {
    const len = this.mergedConfig().length!;
    const val = this.value() || '';
    const chars = val.split('').slice(0, len);
    
    return Array.from({ length: len }, (_, i) => ({
      id: i,             
      value: chars[i] || '' 
    }));
  });

  constructor() {
    super();
  }

  protected onDigitInput(event: Event, index: number): void {
    const inputEl = event.target as HTMLInputElement;
    let val: string = inputEl.value;

    if (val.length > 1) {
      val = val.slice(-1);
    }

    inputEl.value = val;
    this.updateValueAt(index, val);

    if (val && index < this.mergedConfig().length! - 1) {
      this.otpBoxes.get(index + 1)?.nativeElement.focus();
    }
  }

  protected handleKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    const len: number = this.mergedConfig().length!;

    switch (event.key) {
      case 'Backspace':
        event.preventDefault();
        if (!input.value && index > 0) {
          this.updateValueAt(index - 1, '');
          this.otpBoxes.get(index - 1)?.nativeElement.focus();
        } else {
          this.updateValueAt(index, '');
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (index > 0) this.otpBoxes.get(index - 1)?.nativeElement.focus();
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (index < len - 1)
          this.otpBoxes.get(index + 1)?.nativeElement.focus();
        break;
    }
  }

  protected handlePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData: string = event.clipboardData?.getData('text') || '';
    const len: number = this.mergedConfig().length!;
    const cleanData: string = pastedData.trim().slice(0, len);

    if (!cleanData) return;

    this.value.set(cleanData);
    this.onChange(cleanData);

    setTimeout(() => {
      const focusIndex: number = Math.min(cleanData.length, len) - 1;
      if (focusIndex >= 0) {
        this.otpBoxes.get(focusIndex)?.nativeElement.focus();
      }
    });
  }

  private updateValueAt(index: number, val: string): void {
    const currentVal: string = this.value() || '';
    const len: number = this.mergedConfig().length!;
    const arr: string[] = currentVal.padEnd(len, ' ').split('');

    arr[index] = val || ' ';

    const finalString: string = arr.join('').trimEnd();
    this.value.set(finalString);
    this.onChange(finalString);
  }
}
