import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { IPrepaymentCalcResponse } from '../../../models/prepayment.model';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

@Component({
  selector: 'app-prepayment-review',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './prepayment-review.html',
  styleUrl: './prepayment-review.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrepaymentReview {
  public readonly calculationResult = input.required<IPrepaymentCalcResponse>();

  public readonly cancel = output<void>();
  public readonly confirmPay = output<void>();

  public isCurrency(text: string): boolean {
    const lowerText = text.toLowerCase();
    return (
      lowerText.includes('amount') ||
      lowerText.includes('savings') ||
      lowerText.includes('monthly payment') ||
      lowerText.includes('cost') ||
      lowerText.includes('interest')
    );
  }
}
