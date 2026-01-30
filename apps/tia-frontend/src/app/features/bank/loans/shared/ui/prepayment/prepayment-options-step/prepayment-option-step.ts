import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  Signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
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
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { startWith, map } from 'rxjs';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrepaymentOptionStep {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);

  public readonly loan = input.required<ILoan>();
  public readonly isLoading = input<boolean>(false);

  public readonly cancel = output<void>();
  public readonly calculate = output<PrepaymentCalculationPayload>();

  protected readonly typeOptions: Signal<IDropdownOption[]> =
    this.store.selectSignal(selectPrepaymentTypeOptions);

  protected readonly config = toSignal(
    this.translate.onLangChange.pipe(
      startWith({ lang: this.translate.getCurrentLang(), translations: null }),
      map(() => this.getTranslatedConfig()),
    ),
    { initialValue: this.getTranslatedConfig() },
  );

  protected readonly calculationOptions = toSignal(
    this.translate.onLangChange.pipe(
      startWith({ lang: this.translate.getCurrentLang(), translations: null }),
      map(() => this.getTranslatedOptions()),
    ),
    { initialValue: this.getTranslatedOptions() },
  );

  private getTranslatedConfig() {
    const t = (key?: string) => (key ? this.translate.instant(key) : undefined);
    const newConfig: any = { ...PREPAYMENT_FORM_CONFIG };

    Object.keys(newConfig).forEach((key) => {
      const field = { ...newConfig[key] };
      if (field.label) field.label = t(field.label);
      if (field.placeholder) field.placeholder = t(field.placeholder);
      newConfig[key] = field;
    });

    return newConfig;
  }

  private getTranslatedOptions(): RadioOption[] {
    const t = (key: string) => this.translate.instant(key);
    const prefix = 'loans.prepayment_wizard.radio_options';

    return PREPAYMENT_CALC_OPTIONS.map((opt) => {
      let labelKey = '';
      let descKey = '';

      if (opt.value === 'reduceMonthlyPayment') {
        labelKey = `${prefix}.reduce_monthly_label`;
        descKey = `${prefix}.reduce_monthly_desc`;
      } else if (opt.value === 'reduceEndDateOfLoan') {
        labelKey = `${prefix}.reduce_term_label`;
        descKey = `${prefix}.reduce_term_desc`;
      }

      return {
        ...opt,
        label: t(labelKey || opt.label),
        description: descKey ? t(descKey) : opt.description,
      };
    });
  }

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
    this.store.dispatch(LoansActions.loadPrepaymentOptions());

    const currentLoan = this.loan();
    if (currentLoan && currentLoan.loanAmount) {
      this.form.controls.amount.addValidators([
        Validators.max(currentLoan.loanAmount),
      ]);
      this.form.controls.amount.updateValueAndValidity();
    }
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
