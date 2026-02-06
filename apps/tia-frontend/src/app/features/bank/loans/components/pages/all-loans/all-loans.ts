import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { LoansStore } from '../../../store/loans.store';
import { LoansContainer } from '../../../container/loans-container';
import { LoansGrid } from '../../../shared/ui/loans-grid/loans-grid';

@Component({
  selector: 'app-all-loans',
  imports: [LoansGrid],
  templateUrl: './all-loans.html',
  styleUrl: './all-loans.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllLoans implements OnInit {
  protected readonly store = inject(LoansStore);
  private readonly container = inject(LoansContainer);

  protected readonly emptyConfig = {
    title: 'loans.empty.all.title',
    message: 'loans.empty.all.message',
    button: 'loans.empty.all.button',
  };

  public ngOnInit(): void {
    this.store.loadLoans({ status: null });
  }

  public onRequestLoan(): void {
    this.container.isModalOpen.set(true);
  }
}
