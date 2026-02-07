import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoansStore } from '../../../store/loans.store';
import { Router } from '@angular/router';
import { LoansGrid } from '../../../shared/ui/loans-grid/loans-grid';
import { LOANS_ROUTES } from '../../../shared/config/loans-redirect.config';
import { LoanDashboardState } from '../../../shared/state/loan-dashboard.state';

@Component({
  selector: 'app-pending-loans',
  imports: [LoansGrid],
  templateUrl: './pending-loans.html',
  styleUrl: './pending-loans.scss',
  providers: [LoanDashboardState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingLoans {
  protected readonly store = inject(LoansStore);
  private readonly router = inject(Router);
  public readonly emptyState = inject(LoanDashboardState);

  ngOnInit() {
    this.store.loadLoans({ status: 1 });
  }

  public navigateToAll(): void {
    this.router.navigate([LOANS_ROUTES.ALL], {
      queryParamsHandling: 'merge',
    });
  }
}
