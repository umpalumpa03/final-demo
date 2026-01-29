import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ILoan } from '../../../models/loan.model';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { CommonModule } from '@angular/common';
import { CLOSE_VARIANT } from '../../../config/loan-details.config';

@Component({
  selector: 'app-loan-details',
  imports: [UiModal, ButtonComponent, CommonModule],
  templateUrl: './loan-details.html',
  styleUrl: './loan-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanDetails {
  public readonly buttonVariant = CLOSE_VARIANT;
  public readonly loan = input<ILoan | null>(null);
  public readonly isOpen = input.required<boolean>();

  public readonly close = output<void>();
  public readonly calculatePrepayment = output<ILoan>();

  protected onCalculate(): void {
    const currentLoan = this.loan();
    if (currentLoan) {
      this.calculatePrepayment.emit(currentLoan);
    }
  }
}
