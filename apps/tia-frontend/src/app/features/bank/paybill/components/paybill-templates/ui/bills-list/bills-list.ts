import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  OnInit,
  untracked,
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
export class BillsList implements OnInit {
  private readonly store = inject(Store);
  public selectedItems = this.store.selectSignal(selectSelectedTemplates);
  public distributedAmount = this.store.selectSignal(selectDistributedAmount);
  public fb = inject(FormBuilder);

  public payForm = this.fb.group({});
  public isDistribution = input.required<boolean>();

  public senderAccountId = this.store.selectSignal(
    selectSelectedSenderAccountId,
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
            [Validators.required, Validators.min(0.01), Validators.max(99999)],
          ),
          { emitEvent: false },
        );
      });

      const total = items.reduce((sum, item) => sum + item.amountDue, 0);
      this.store.dispatch(
        TemplatesPageActions.setTotalAmount({ amount: total }),
      );
      this.store.dispatch(
        TemplatesPageActions.setPaymentsForm({
          payments: untracked(() => this.buildPayload()),
        }),
      );

      this.store.dispatch(
        TemplatesPageActions.setFormValid({ isValid: this.payForm.valid }),
      );
    });

    effect(() => {
      const distributed = this.distributedAmount();
      const items = untracked(() => this.selectedItems());

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
  }

  ngOnInit() {
    this.payForm.valueChanges.pipe().subscribe((values) => {
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

      this.store.dispatch(
        TemplatesPageActions.setFormValid({ isValid: this.payForm.valid }),
      );
    });
  }

  public buildPayload(): BillPaymentRequest[] {
    const items = this.selectedItems();
    const formValues = this.payForm.getRawValue() as Record<string, string>;

    return items.map((item) => ({
      serviceId: item.serviceId,
      identification: item.identification,
      amount: +formValues[item.id],
      senderAccountId: this.senderAccountId()!,
    }));
  }

  public preventNegative(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const key = event.key;

    if (key === '-') {
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
