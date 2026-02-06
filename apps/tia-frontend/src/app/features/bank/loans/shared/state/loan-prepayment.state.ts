import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
}
