import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { ScrollArea } from '@tia/shared/lib/layout/components/scroll-area/container/scroll-area';
import {
  selectDistributedAmount,
  selectSelectedTemplates,
} from '../../../../../store/paybill.selectors';
import { Store } from '@ngrx/store';
import { KeyValuePipe } from '@angular/common';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TemplatesPageActions } from '../../../../../store/paybill.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';

@Component({
  selector: 'app-bills-list',
  imports: [ScrollArea, KeyValuePipe, TextInput, ReactiveFormsModule],
  templateUrl: './bills-list.html',
  styleUrl: './bills-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillsList {
  private readonly store = inject(Store);
  public selectedItems = this.store.selectSignal(selectSelectedTemplates);
  public distributedAmount = this.store.selectSignal(selectDistributedAmount);
  public fb = inject(FormBuilder);

  public payForm = this.fb.group({});
  public isDistribution = input.required<boolean>();

  private formValues = toSignal(
    this.payForm.valueChanges.pipe(
      startWith(this.payForm.getRawValue()),
      map(() => this.payForm.getRawValue()),
    ),
    { initialValue: {} },
  );

  constructor() {
    effect(() => {
      const items = this.selectedItems();
      const shouldDisable = this.isDistribution();

      Object.keys(this.payForm.controls).forEach((key) => {
        this.payForm.removeControl(key, { emitEvent: false });
      });

      items.forEach((item) => {
        this.payForm.addControl(
          item.id,
          this.fb.control(
            { value: item.amountDue.toFixed(2), disabled: shouldDisable },
            [Validators.min(0), Validators.max(999)],
          ),
          { emitEvent: false },
        );
      });

      this.payForm.updateValueAndValidity({ emitEvent: true });
    });

    effect(() => {
      const distributed = this.distributedAmount();
      const items = this.selectedItems();

      if (distributed !== 0) {
        items.forEach((item) => {
          const control = this.payForm.get(item.id);
          control?.setValue(distributed.toFixed(2), { emitEvent: false });
        });
      } else {
        items.forEach((item) => {
          const control = this.payForm.get(item.id);
          control?.setValue(item.amountDue.toFixed(2), { emitEvent: false });
        });
      }
    });

    effect(() => {
      const values = this.formValues();

      if (!values || Object.keys(values).length === 0) return;

      const total = Object.values(values).reduce((sum, value) => {
        const numValue = parseFloat(value as string) || 0;
        return +sum! + numValue;
      }, 0);

      this.store.dispatch(
        TemplatesPageActions.setTotalAmount({ amount: +total! }),
      );
    });
  }
}
