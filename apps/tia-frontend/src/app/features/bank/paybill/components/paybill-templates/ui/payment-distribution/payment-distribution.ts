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
  public amountControl = new FormControl('', [Validators.min(5)]);
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
            console.log('END___');
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
        }),
      )
      .subscribe();
  }

  public preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }
}
