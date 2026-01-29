import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoansActions } from '../../../../store/loans.actions';
import { selectPrepaymentTypeOptions } from '../../../../store/loans.selectors';
import { IDropdownOption } from '../../../models/loan-request.model';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { CommonModule } from '@angular/common';
import { Radios } from '@tia/shared/lib/forms/radios/radios';
import { RadioOption } from '@tia/shared/lib/forms/models/radios.model';
import {
  PREPAYMENT_CALC_OPTIONS,
  PREPAYMENT_FORM_CONFIG,
} from '../../../config/loan-prepayment.config';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { ILoan } from '../../../models/loan.model';
import { PrepaymentCalculationPayload } from '../../../models/prepayment.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-prepayment-option-step',
  imports: [
    TextInput,
    Dropdowns,
    Radios,
    ButtonComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './prepayment-option-step.html',
  styleUrl: './prepayment-option-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrepaymentOptionStep {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  public readonly loan = input.required<ILoan>();
  public readonly cancel = output<void>();
  public readonly calculate = output<PrepaymentCalculationPayload>();

  protected readonly typeOptions$: Observable<IDropdownOption[]> =
    this.store.select(selectPrepaymentTypeOptions);

  protected readonly config = PREPAYMENT_FORM_CONFIG;
  protected readonly calculationOptions: RadioOption[] =
    PREPAYMENT_CALC_OPTIONS;

  public readonly form = this.fb.group({
    type: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(1)]],
    calculationOption: ['reduceMonthlyPayment', Validators.required],
  });

  constructor() {
    this.form.controls.type.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((type) => {
        const amountCtrl = this.form.controls.amount;
        const calcCtrl = this.form.controls.calculationOption;

        if (type === 'full') {
          amountCtrl.disable();
          calcCtrl.disable();
        } else {
          amountCtrl.enable();
          calcCtrl.enable();
        }
      });
  }

  public ngOnInit(): void {
    this.store.dispatch(LoansActions.loadPrepaymentOptions());
  }

  public onCalculate(): void {
    if (this.form.invalid && this.form.get('type')?.value !== 'full') {
      this.form.markAllAsTouched();
      return;
    }

    const rawValue = this.form.getRawValue();

    const payload: PrepaymentCalculationPayload = {
      loanId: this.loan().id,
      type: rawValue.type as 'full' | 'partial',
      amount: rawValue.type === 'partial' ? Number(rawValue.amount) : undefined,
      loanPartialPaymentType:
        rawValue.type === 'partial'
          ? rawValue.calculationOption || undefined
          : undefined,
    };

    this.calculate.emit(payload);
  }
}
