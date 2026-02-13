import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

export interface DeclineFormLabels {
  declineSection: string;
  declinePlaceholder: string;
}

@Component({
  selector: 'app-loan-drawer-decline-form',
  imports: [],
  templateUrl: './loan-drawer-decline-form.html',
  styleUrl: './loan-drawer-decline-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanDrawerDeclineForm {
  public readonly showDeclineForm = input<boolean>(false);
  public readonly declineReason = input<string>('');
  public readonly labels = input.required<DeclineFormLabels>();

  public readonly reasonInput = output<Event>();

  public onReasonInput(event: Event): void {
    this.reasonInput.emit(event);
  }
}
