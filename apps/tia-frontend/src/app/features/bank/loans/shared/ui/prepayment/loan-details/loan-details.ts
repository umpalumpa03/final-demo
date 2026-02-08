import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { ILoanDetails } from '../../../models/loan.model';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { CommonModule } from '@angular/common';
import { CLOSE_VARIANT } from '../../../config/loan-details.config';
import { PurposeFormatPipe } from '../../../pipes/purpose.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { RouteLoader } from '@tia/shared/lib/feedback/route-loader/route-loader';
import { LoansStore } from '../../../../store/loans.store';

@Component({
  selector: 'app-loan-details',
  imports: [
    UiModal,
    ButtonComponent,
    CommonModule,
    PurposeFormatPipe,
    TranslatePipe,
    RouteLoader,
  ],
  templateUrl: './loan-details.html',
  styleUrl: './loan-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanDetails implements OnInit {
  private readonly store = inject(LoansStore);
  public readonly buttonVariant = CLOSE_VARIANT;

  public readonly loan = input<ILoanDetails | null>(null);
  public readonly isLoading = input<boolean>(false);
  public readonly isOpen = input.required<boolean>();

  public readonly navigate = output<number>();

  public readonly close = output<void>();
  public readonly calculatePrepayment = output<ILoanDetails>();

  public ngOnInit(): void {
    this.store.loadPrepaymentOptions({});
  }

  protected onCalculate(): void {
    const currentLoan = this.loan();
    if (currentLoan) {
      this.calculatePrepayment.emit(currentLoan);
    }
  }
}
