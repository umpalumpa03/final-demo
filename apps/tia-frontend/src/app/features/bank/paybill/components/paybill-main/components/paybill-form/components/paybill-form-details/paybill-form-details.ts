import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BillDetails } from '../../../../shared/models/paybill.model';

@Component({
  selector: 'app-paybill-form-details',
  imports: [],
  templateUrl: './paybill-form-details.html',
  styleUrl: './paybill-form-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillFormDetails {
  public readonly details = input.required<BillDetails | null>();
}
