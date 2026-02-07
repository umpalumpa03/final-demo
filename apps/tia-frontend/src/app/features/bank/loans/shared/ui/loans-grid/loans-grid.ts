import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { LoanCard } from '../loan-card/loan-card';
import { ErrorStates } from '@tia/shared/lib/feedback/error-states/error-states';
import { ILoan } from '../../models/loan.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-loans-grid',
  imports: [LoanCard, ErrorStates, TranslatePipe],
  templateUrl: './loans-grid.html',
  styleUrl: './loans-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoansGrid {
  public readonly loans = input.required<ILoan[]>();
  public readonly variant = input<'default' | 'colored'>('default');
  public readonly emptyConfig = input.required<{
    title: string;
    message: string;
    button: string;
  }>();

  public readonly cardClick = output<string>();
  public readonly rename = output<{ id: string; name: string }>();
  public readonly emptyClick = output<void>();
}
