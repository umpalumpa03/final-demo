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

@Component({
  selector: 'app-approved-loans',
  imports: [LoansGrid],
  templateUrl: './approved-loans.html',
  styleUrl: './approved-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovedLoans implements OnInit {
  protected readonly store = inject(LoansStore);
  private readonly router = inject(Router);

  protected readonly emptyConfig = {
    title: 'loans.empty.approved.title',
    message: 'loans.empty.approved.message',
    button: 'loans.empty.approved.button',
  };

  ngOnInit() {
    this.store.loadLoans({ status: 2 });
  }

  navigateToAll() {
    this.router.navigate([LOANS_ROUTES.ALL]);
  }
}
