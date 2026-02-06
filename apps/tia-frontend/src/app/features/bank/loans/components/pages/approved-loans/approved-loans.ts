import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { LoansStore } from '../../../store/loans.store';
import { Router } from '@angular/router';
import { LoansGrid } from '../../../shared/ui/loans-grid/loans-grid';
import { LOANS_ROUTES } from '../../../shared/config/loans-redirect.config';
import { LoanDashboardState } from '../../../shared/state/loan-dashboard.state';

@Component({
  selector: 'app-approved-loans',
  imports: [LoansGrid],
  templateUrl: './approved-loans.html',
  styleUrl: './approved-loans.scss',
  providers: [LoanDashboardState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovedLoans implements OnInit {
  protected readonly store = inject(LoansStore);
  private readonly router = inject(Router);
  public readonly emptyState = inject(LoanDashboardState);

  ngOnInit() {
    this.store.loadLoans({ status: 2 });
  }

  navigateToAll() {
    this.router.navigate([LOANS_ROUTES.ALL]);
  }
}
