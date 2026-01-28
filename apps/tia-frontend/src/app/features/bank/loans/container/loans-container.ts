import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LoanHeader } from '../shared/ui/loan-header/loan-header';
import { LoanNavigation } from '../shared/ui/loan-navigation/loan-navigation';
import { RouterModule } from '@angular/router';
import { RequestModal } from '../shared/ui/request-modal/request-modal';

@Component({
  selector: 'app-loans-container',
  imports: [LoanHeader, LoanNavigation, RouterModule, RequestModal],
  templateUrl: './loans-container.html',
  styleUrl: './loans-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoansContainer {
  protected isModalOpen = signal(false);
}
