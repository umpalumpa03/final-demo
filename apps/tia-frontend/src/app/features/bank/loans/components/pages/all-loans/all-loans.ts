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

@Component({
  selector: 'app-all-loans',
  imports: [LoansGrid],
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
    this.store.loadLoans({ status: null });
  }

  public onRequestLoan(): void {
    this.container.isModalOpen.set(true);
  }
}
