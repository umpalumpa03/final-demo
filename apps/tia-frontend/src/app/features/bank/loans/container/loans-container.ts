import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoanHeader } from '../shared/ui/loan-header/loan-header';
import { LoanNavigation } from '../shared/ui/loan-navigation/loan-navigation';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-loans-container',
  imports: [LoanHeader, LoanNavigation, RouterModule],
  templateUrl: './loans-container.html',
  styleUrl: './loans-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoansContainer {}
