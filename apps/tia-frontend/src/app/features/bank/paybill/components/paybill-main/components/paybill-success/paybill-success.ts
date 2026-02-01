import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { SummaryField } from '../../shared/models/summary.model';
import { BasicCard } from "@tia/shared/lib/cards/basic-card/basic-card";
import { PaymentSummary } from "../../shared/ui/payment-summary/payment-summary";
import { ButtonComponent } from "@tia/shared/lib/primitives/button/button";

@Component({
  selector: 'app-paybill-success',
  imports: [BasicCard, PaymentSummary, ButtonComponent],
  templateUrl: './paybill-success.html',
  styleUrl: './paybill-success.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaybillSuccess {
  public readonly items = input.required<SummaryField[]>();
  public readonly headerTitle = input.required<string>();
  public readonly iconBgColor = input<string>('');
  public readonly iconBgPath = input<string>('');

  public readonly payAnother = output<void>();
  public readonly goDashboard = output<void>();
}
