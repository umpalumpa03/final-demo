import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInput } from '@tia/shared/lib/forms/input-field/text-input';
import { Dropdowns } from '@tia/shared/lib/forms/dropdowns/dropdowns';
import { CommonModule } from '@angular/common';
import { Radios } from '@tia/shared/lib/forms/radios/radios';
import { RadioOption } from '@tia/shared/lib/forms/models/radios.model';
import { PREPAYMENT_CALC_OPTIONS } from '../../../config/loan-prepayment.config';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { ILoan } from '../../../models/loan.model';
import { PrepaymentCalculationPayload } from '../../../models/prepayment.model';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { startWith, map } from 'rxjs';
import { LoansStore } from '../../../../store/loans.store';
import { LoanPrepaymentState } from '../../../state/loan-prepayment.state';

@Component({
  selector: 'app-prepayment-option-step',
  imports: [
    TextInput,
    Dropdowns,
    Radios,
    ButtonComponent,
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './prepayment-option-step.html',
  styleUrl: './prepayment-option-step.scss',
  providers: [LoanPrepaymentState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrepaymentOptionStep {
  private readonly store = inject(LoansStore);
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);
  public readonly loanPrepayment = inject(LoanPrepaymentState);

  public readonly loan = input.required<ILoan>();
  public readonly isLoading = input<boolean>(false);

  public readonly cancel = output<void>();
  public readonly calculate = output<PrepaymentCalculationPayload>();

  protected readonly typeOptions = this.store.prepaymentTypeOptions;

  public readonly form = this.fb.group({
    type: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(50)]],
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
    this.store.loadPrepaymentOptions({});

    const currentLoan = this.loan();
    if (currentLoan && currentLoan.loanAmount) {
      this.form.controls.amount.addValidators([
        Validators.max(currentLoan.loanAmount),
      ]);
      this.form.controls.amount.updateValueAndValidity();
    }
  }

  public onCalculate(): void {
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
