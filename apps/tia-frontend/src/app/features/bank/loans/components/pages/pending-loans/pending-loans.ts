import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { LoansStore } from '../../../store/loans.store';
import { Router } from '@angular/router';
import { ILoan } from '../../../shared/models/loan.model';
import { LoansGrid } from '../../../shared/ui/loans-grid/loans-grid';
import { LOANS_ROUTES } from '../../../shared/config/loans-redirect.config';

@Component({
  selector: 'app-pending-loans',
  imports: [LoansGrid],
  templateUrl: './pending-loans.html',
  styleUrl: './pending-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingLoans {
  protected readonly store = inject(LoansStore);
  private readonly router = inject(Router);

  protected readonly emptyConfig = {
    title: 'loans.empty.pending.title',
    message: 'loans.empty.pending.message',
    button: 'loans.empty.pending.button',
  };

  ngOnInit() {
    this.store.loadLoans({ status: 1 });
  }

  navigateToAll() {
    this.router.navigate([LOANS_ROUTES.ALL]);
  }
}
