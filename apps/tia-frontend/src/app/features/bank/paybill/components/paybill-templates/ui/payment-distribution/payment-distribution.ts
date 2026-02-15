import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { TemplatesPageActions } from '../../../../store/paybill.actions';
import {
  selectDistributedAmount,
  selectSelectedTemplates,
} from '../../../../store/paybill.selectors';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-distribution',
  imports: [
    ButtonComponent,
    TextInput,
    ReactiveFormsModule,
    CurrencyPipe,
    TranslatePipe,
  ],
  templateUrl: './payment-distribution.html',
  styleUrl: './payment-distribution.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentDistribution implements OnInit {
  private readonly store = inject(Store);
  public distributionMode = signal<'individual' | 'equal'>('individual');
  public selectedItemsLength = input<number>();

  public isDistribution = output<boolean>();

  public onDistributionChange(mode: 'individual' | 'equal'): void {
    this.distributionMode.set(mode);
    mode === 'equal'
      ? this.isDistribution.emit(true)
      : this.isDistribution.emit(false);

    this.amountControl.setValue('');
  }

  private readonly destroyRef = inject(DestroyRef);
  public amountControl = new FormControl('', [
    Validators.min(10),
    Validators.max(99999),
  ]);
  public distributedAmount = this.store.selectSignal(selectDistributedAmount);

  ngOnInit(): void {
    this.amountControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
        tap((value) => {
          const distributedAmount = value
            ? +value / (this.selectedItemsLength() ?? 1)
            : 0;
          const billValue = this.store
            .selectSignal(selectSelectedTemplates)()
            .reduce((acc, cur) => acc + cur.amountDue, 0);

          if (this.distributionMode() === 'equal' && distributedAmount) {
            this.store.dispatch(
              TemplatesPageActions.setTotalAmount({
                amount: +value!,
              }),
            );
          } else {
            this.store.dispatch(
              TemplatesPageActions.setTotalAmount({
                amount: billValue,
              }),
            );
          }

          this.store.dispatch(
            TemplatesPageActions.setDistributedAmount({
              amount: distributedAmount,
            }),
          );
          if (distributedAmount) {
            this.store.dispatch(
              TemplatesPageActions.setFormValid({
                isValid: distributedAmount > 0,
              }),
            );
          }
        }),
      )
      .subscribe();
  }

  public preventNegativeInput(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const key = event.key;

    if (key === '-' || key === 'e') {
      event.preventDefault();
      return;
    }

    if (
      ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(key)
    ) {
      return;
    }

    if (value === '0' && /\d/.test(key)) {
      event.preventDefault();
      return;
    }

    const decimalSeparator =
      [',', '.'].find((sep) => value.includes(sep)) ?? null;

    const integerPart = decimalSeparator
      ? value.split(decimalSeparator)[0]
      : value;
    if (
      integerPart.length >= 5 &&
      /\d/.test(key) &&
      key !== '.' &&
      key !== ','
    ) {
      event.preventDefault();
      return;
    }

    if (decimalSeparator) {
      if (key === '.' || key === ',') {
        event.preventDefault();
        return;
      }

      const decimals = value.split(decimalSeparator)[1] || '';
      if (decimals.length >= 2 && /\d/.test(key)) {
        event.preventDefault();
      }
    }
  }
}
