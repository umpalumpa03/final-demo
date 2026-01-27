import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { LoanCard } from '../../../shared/ui/loan-card/loan-card';
import { LoansActions } from '../../../store/loans.actions';
import { selectAllLoans } from '../../../store/loans.selectors';

@Component({
  selector: 'app-all-loans',
  imports: [CommonModule, LoanCard],
  templateUrl: './all-loans.html',
  styleUrl: './all-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllLoans implements OnInit {
  private store = inject(Store);

  protected readonly loans$ = this.store.select(selectAllLoans);

  public ngOnInit(): void {
    this.store.dispatch(LoansActions.loadLoans());
  }

  // ES IYOS JER ASE GADAKETDEBA
  protected onCardClick(id: string): void {
    console.log('Clicked', id);
  }

  protected onRenameLoan(event: { id: string; name: string }): void {
    this.store.dispatch(
      LoansActions.renameLoan({ id: event.id, name: event.name }),
    );
  }
}
