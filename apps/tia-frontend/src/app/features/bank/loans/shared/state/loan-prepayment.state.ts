import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RadioOption } from '../models/prepayment.model';

@Injectable()
export class LoanPrepaymentState {
  private readonly translate = inject(TranslateService);

  public select = signal({
    label: this.translate.instant('loans.prepayment_wizard.form.type_label'),
    placeholder: this.translate.instant('loans.placeholders.select_type'),
    required: true,
    height: '3.6rem',
  });

  public amountInput = signal({
    label: this.translate.instant('loans.prepayment_wizard.form.amount_label'),
    placeholder: this.translate.instant('loans.placeholders.prepayment_amount'),
    prefixIcon: './images/svg/feature-loans/dollar.svg',
  });

  public calcRadios = signal({
    label: this.translate.instant(
      'loans.prepayment_wizard.form.calc_option_label',
    ),
    hasBorder: true,
  });

  public buttonTooltip = signal(
    this.translate.instant('loans.prepayment_wizard.tooltips.form_invalid'),
  );

  public radioOptions = signal<RadioOption[]>([
    {
      label: this.translate.instant(
        'loans.prepayment_wizard.radio_options.reduce_monthly_label',
      ),
      value: 'reduceMonthlyPayment',
      description: this.translate.instant(
        'loans.prepayment_wizard.radio_options.reduce_monthly_desc',
      ),
    },
    {
      label: this.translate.instant(
        'loans.prepayment_wizard.radio_options.reduce_term_label',
      ),
      value: 'reduceEndDateOfLoan',
      description: this.translate.instant(
        'loans.prepayment_wizard.radio_options.reduce_term_desc',
      ),
    },
  ]);
}
