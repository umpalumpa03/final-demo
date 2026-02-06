import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoansStore } from '../../../store/loans.store';
import { Router } from '@angular/router';
import { LOANS_ROUTES } from '../../../shared/config/loans-redirect.config';
import { LoansGrid } from '../../../shared/ui/loans-grid/loans-grid';

@Component({
  selector: 'app-declined-loans',
  imports: [LoansGrid],
  templateUrl: './declined-loans.html',
  styleUrl: './declined-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeclinedLoans {
  protected readonly store = inject(LoansStore);
  private readonly router = inject(Router);

  protected readonly emptyConfig = {
    title: 'loans.empty.approved.title',
    message: 'loans.empty.approved.message',
    button: 'loans.empty.approved.button',
  };

  ngOnInit() {
    this.store.loadLoans({ status: 3 });
  }

  navigateToAll() {
    this.router.navigate([LOANS_ROUTES.ALL]);
  }
}
