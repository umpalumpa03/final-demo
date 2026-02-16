import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { LoansStore } from '../../../store/loans.store';
import { LoansContainer } from '../../../container/loans-container';
import { LoansGrid } from '../../../shared/ui/loans-grid/loans-grid';
import { LoanDashboardState } from '../../../shared/state/loan-dashboard.state';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-all-loans',
  imports: [LoansGrid, ErrorStates, TranslatePipe],
  templateUrl: './all-loans.html',
  styleUrl: './all-loans.scss',
  providers: [LoanDashboardState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllLoans implements OnInit {
  protected readonly store = inject(LoansStore);
  private readonly container = inject(LoansContainer);
  public readonly emptyState = inject(LoanDashboardState);

  public ngOnInit(): void {
    this.loadData();
  }

  public onRequestLoan(): void {
    this.container.isModalOpen.set(true);
  }

  public loadData(): void {
    // Always force refresh when loading from this page so that
    // previous errors (e.g. invalid OTP) are cleared and the
    // grid is shown again without needing a hard reload.
    this.store.loadLoans({ status: null, forceChange: true });
  }
}
