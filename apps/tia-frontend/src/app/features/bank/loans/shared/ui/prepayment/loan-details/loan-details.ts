import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ILoanDetails } from '../../../models/loan.model';
import { UiModal } from '@tia/shared/lib/overlay/ui-modal/ui-modal';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';
import { CommonModule } from '@angular/common';
import { CLOSE_VARIANT } from '../../../config/loan-details.config';
import { Spinner } from '@tia/shared/lib/feedback/spinner/spinner';
import { PurposeFormatPipe } from '../../../pipes/purpose.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-loan-details',
  imports: [
    UiModal,
    ButtonComponent,
    CommonModule,
    Spinner,
    PurposeFormatPipe,
    TranslatePipe,
  ],
  templateUrl: './loan-details.html',
  styleUrl: './loan-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanDetails {
  public readonly buttonVariant = CLOSE_VARIANT;

  public readonly loan = input<ILoanDetails | null>(null);
  public readonly isLoading = input<boolean>(false);
  public readonly isOpen = input.required<boolean>();

  protected readonly scrollContainer =
    viewChild<ElementRef<HTMLDivElement>>('scrollContainer');
  protected readonly showScrollButton = signal(false);

  public readonly close = output<void>();
  public readonly calculatePrepayment = output<ILoanDetails>();

  constructor() {
    effect(() => {
      const loan = this.loan();
      const isLoading = this.isLoading();
      const isOpen = this.isOpen();

      if (loan && !isLoading && isOpen) {
        setTimeout(() => this.checkScrollPosition(), 100);
      }
    });
  }

  protected onScroll(): void {
    this.checkScrollPosition();
  }

  private checkScrollPosition(): void {
    const el = this.scrollContainer()?.nativeElement;
    if (!el) return;

    const isAtBottom =
      Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 20;
    const isScrollable = el.scrollHeight > el.clientHeight;

    this.showScrollButton.set(isScrollable && !isAtBottom);
  }

  protected scrollToBottom(): void {
    const el = this.scrollContainer()?.nativeElement;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  protected onCalculate(): void {
    const currentLoan = this.loan();
    if (currentLoan) {
      this.calculatePrepayment.emit(currentLoan);
    }
  }
}
