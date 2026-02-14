import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { ScrollArea } from '@tia/shared/lib/layout/components/scroll-area/container/scroll-area';
import {
  selectSelectedTemplates,
  selectDistributedAmount,
  selectSelectedSenderAccountId,
} from '../../../../store/paybill.selectors';
import { Store } from '@ngrx/store';
import { KeyValuePipe } from '@angular/common';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TemplatesPageActions } from '../../../../store/paybill.actions';
import { BillPaymentRequest } from '../../models/paybill-templates.model';
import { startWith } from 'rxjs';

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

      const total = items.reduce((sum, item) => sum + item.amountDue, 0);
      this.store.dispatch(
        TemplatesPageActions.setTotalAmount({ amount: total }),
      );
      this.store.dispatch(
        TemplatesPageActions.setPaymentsForm({ payments: this.buildPayload() }),
      );
    });

    effect(() => {
      const distributed = this.distributedAmount();
      if (distributed !== 0) {
        this.selectedItems().forEach((item) => {
          const control = this.payForm.get(item.id);
          control?.setValue(distributed.toFixed(2), { emitEvent: false });
        });
      } else {
        this.selectedItems().forEach((item) => {
          const control = this.payForm.get(item.id);
          control?.setValue(item.amountDue.toFixed(2), { emitEvent: false });
        });
      }
    });

    effect(() => {
      this.payForm.valueChanges.pipe(startWith()).subscribe((values) => {
        if (!values || Object.keys(values).length === 0) return;

        const total = Object.values(values).reduce((sum, value) => {
          const numValue = parseFloat(value as string) || 0;
          return +sum! + numValue;
        }, 0);

        this.store.dispatch(
          TemplatesPageActions.setTotalAmount({ amount: +total! }),
        );
        this.store.dispatch(
          TemplatesPageActions.setPaymentsForm({
            payments: this.buildPayload(),
          }),
        );
      });
    });
  }

  public buildPayload(): BillPaymentRequest[] {
    const senderAccountId = this.store.selectSignal(
      selectSelectedSenderAccountId,
    );
    const items = this.selectedItems();
    const formValues = this.payForm.getRawValue() as Record<string, string>;

    return items.map((item) => ({
      serviceId: item.serviceId,
      identification: item.identification,
      amount: +formValues[item.id],
      senderAccountId: senderAccountId()!,
    }));
  }

  public preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }
}
