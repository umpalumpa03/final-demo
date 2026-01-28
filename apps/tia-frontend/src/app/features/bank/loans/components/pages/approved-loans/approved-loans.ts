import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { LoansActions } from '../../../store/loans.actions';
import { selectFilteredLoans } from '../../../store/loans.selectors';
import { LoanCard } from '../../../shared/ui/loan-card/loan-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-approved-loans',
  imports: [LoanCard, CommonModule],
  templateUrl: './approved-loans.html',
  styleUrl: './approved-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovedLoans implements OnInit {
  private store = inject(Store);

  protected readonly approvedLoans$ = this.store.select(selectFilteredLoans(2));

  public ngOnInit(): void {
    this.store.dispatch(LoansActions.loadLoans());
  }

  // ES AXLA IYOS SHEMDEG PR-ZE DAVAMATEB MODALEBS DA AMOISHLEBA
  protected onCardClick(id: string) {
    console.log('Clicked', id);
  }

  protected onRenameLoan(event: { id: string; name: string }): void {
    this.store.dispatch(
      LoansActions.renameLoan({ id: event.id, name: event.name }),
    );
  }
}
