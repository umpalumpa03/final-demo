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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { TemplatesPageActions } from '../../../../../store/paybill.actions';
import { selectDistributedAmount } from '../../../../../store/paybill.selectors';

@Component({
  selector: 'app-payment-distribution',
  imports: [ButtonComponent, TextInput, ReactiveFormsModule, CurrencyPipe],
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
  public amountControl = new FormControl('');

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

          if (this.distributionMode() === 'equal') {
            this.store.dispatch(
              TemplatesPageActions.setTotalAmount({
                amount: +value!,
              }),
            );
          }

          this.store.dispatch(
            TemplatesPageActions.setDistributedAmount({
              amount: distributedAmount,
            }),
          );
        }),
      )
      .subscribe();
  }
}
