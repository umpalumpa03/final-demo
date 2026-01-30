import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { IPrepaymentCalcResponse } from '../../../models/prepayment.model';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { PREPAYMENT_CURRENCY_KEYWORDS } from '../../../config/loan-prepayment.config';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-prepayment-review',
  imports: [CommonModule, ButtonComponent, TranslatePipe],
  templateUrl: './prepayment-review.html',
  styleUrl: './prepayment-review.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrepaymentReview {
  public readonly calculationResult = input.required<IPrepaymentCalcResponse>();

  public readonly isLoading = input<boolean>(false);

  public readonly currencyCode = input<string>('GEL');

  protected readonly currencyKeywords = PREPAYMENT_CURRENCY_KEYWORDS;

  public readonly cancel = output<void>();
  public readonly confirmPay = output<void>();

  public isCurrency(text: string): boolean {
    const lowerText = text.toLowerCase();
    return this.currencyKeywords.some((keyword) => lowerText.includes(keyword));
  }
}
