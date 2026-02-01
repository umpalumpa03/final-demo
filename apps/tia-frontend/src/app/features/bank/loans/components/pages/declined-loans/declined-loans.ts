import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoanCard } from '../../../shared/ui/loan-card/loan-card';
import { CommonModule } from '@angular/common';
import { LoansStore } from '../../../store/loans.store';
import { TranslatePipe } from '@ngx-translate/core';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { Router } from '@angular/router';

@Component({
  selector: 'app-declined-loans',
  imports: [LoanCard, CommonModule, ErrorStates, TranslatePipe],
  templateUrl: './declined-loans.html',
  styleUrl: './declined-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeclinedLoans {
  protected readonly store = inject(LoansStore);
  private readonly router = inject(Router);

  protected readonly declinedLoans = this.store.loansWithAccountInfo;

  public ngOnInit(): void {
    this.store.loadLoans(3);
  }

  public onRenameLoan(event: { id: string; name: string }): void {
    this.store.renameLoan({ id: event.id, name: event.name });
  }

  public navigateToAllLoans(): void {
    this.router.navigate(['bank/loans/all']);
  }
}
