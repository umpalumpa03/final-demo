import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoansStore } from '../../../store/loans.store';
import { Router } from '@angular/router';
import { LOANS_ROUTES } from '../../../shared/config/loans-redirect.config';
import { LoansGrid } from '../../../shared/ui/loans-grid/loans-grid';
import { LoanDashboardState } from '../../../shared/state/loan-dashboard.state';

@Component({
  selector: 'app-declined-loans',
  imports: [LoansGrid],
  templateUrl: './declined-loans.html',
  styleUrl: './declined-loans.scss',
  providers: [LoanDashboardState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeclinedLoans {
  protected readonly store = inject(LoansStore);
  private readonly router = inject(Router);
  public readonly emptyState = inject(LoanDashboardState);

  ngOnInit() {
    this.store.loadLoans({ status: 3 });
  }

  public navigateToAll(): void {
    this.router.navigate([LOANS_ROUTES.ALL], {
      queryParamsHandling: 'merge',
    });
  }
}
